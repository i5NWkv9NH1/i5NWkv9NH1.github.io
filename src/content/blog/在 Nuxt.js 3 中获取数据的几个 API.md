---
title: 在 Nuxt.js 3 中获取数据的几个 API
pubDatetime: 2024-02-26
description: 在 Nuxt.js 3 中获取数据的几个 API
featured: false
draft: false
---

## 前言

Nuxt.js 3 版本支持了多种渲染模式，可以同时在客户端和服务端调用 API 获取数据，但同时这也来带一些问题：如何避免重复的请求、如何高效的缓存数据等。为了解决这些问题，Nuxt.js 3 提供了内置的数据请求库 `$fetch`​ 和两个 composable 函数：`useFetch`​ 和 `useAsyncData`​ 。

## $Fetch

​`$fetch`​ 这一内置插件是基于 `ofetch`​ ，相当于提供了一个包装（wrapper）。而 `ofetch`​ 提供了几个非常重要的特性：

- 支持 node、浏览器和 workers。
- 能够智能地解析响应的 JSON 和 本地数据。
- 当 `response.ok`​ 返回的是 false 值时，会自动的抛出带有友好的错误消息和栈堆的异常。
- 如果请求发生错误，会自动重新发出请求。
- 提供异步的拦截器，注入到 ofetch 调用的生命周期事件中。

```ts
const todos = await $fetch("/api/todos").catch(error => error.data);
```

## useFetch

useFetch 是在 composable 函数里处理数据获取的最简单方式。

```html
<script setup>
  const { data, error, pending, refresh } = await useFetch<Todo[]>('/api/todos')
</script>

<template>
  <span v-if="pending">Loading...</span>
  <span v-else-if="data">Todos: {{ data }}</span>
  <span v-else-if="error">Error: {{ error }}</span>
  <button @click="refresh">Refresh</button>
</template>
```

它会返回三个响应式变量和一个函数：

- data：一个传入的异步函数结果的响应式变量。
- error：一个有关请求错误的响应式错误对象。
- pending：一个响应式布尔值，表示请求是否还在进行中。
- refresh/execute：一个用于重新发起请求并返回的数据的函数。默认情况下，Nuxt 在 `refresh`​ 完成之前不会再次执行。

useFetch 负责在服务器上发出请求，并将数据转发到客户端。这样，当页面初始化时，返回一个在服务端将数据渲染完好的 html 页面。我们可以通过 `useNuxtApp.payload()`​ 检查这个有效负载；Nuxt DevTools 会在 payload 选项卡中可视化显示这些数据。

useFetch 还通过使用 key 值来缓存 API 响应，这样可以减少 API 请求。这个 key 值是根据 URL 和 fetch 选项自动生成的。useFetch 是 Nuxt.js 中默认自动导入的，可以在设置函数、生命周期钩子、插件或路由中间件中使用。

我们还可以在 URL 字符串中使用 ref 的值，以确保组件在响应式变量更改时重新发出请求更新数据：

```ts
import { v4 as uuid } from "uuid";

const todoId = ref<string>(uuid());
const {
  data: tracks,
  pending,
  error,
} = useFetch(() => `/api/todos/${todoId.value}`);
```

如果 `todoId`​ 更新，url 也将发生改变，并再次发出请求获取数据。更多信息可以查看[官网文档](https://nuxt.com/docs/api/composables/use-fetch)。

### 选项

useFetch 函数第一个参数接收 url，第二个参数还接收 `options`​ 对象，用于控制发出的请求行为。

#### **lazy**

当将 `lazy`​ 设置为 `true`​ 时，Nuxt.js 会在异步请求函数解析完成前进行等待，当请求函数完成后，Nuxt.js 才会将数据渲染到异步组件或异步页面。

这项特性的底层是基于 Vue.js 的 `<Suspense>`​ 组件，以此确保视图中所有异步数据可用之前不会渲染。

```html
<script setup>
  const { pending, data: todos } = useFetch("/api/todos", {
    lazy: true,
  });
</script>

<template>
  <div v-if="pending">加载中...</div>
  <div v-else>
    <div v-for="todo in todos">{{ todo.name }}</div>
  </div>
</template>
```

等同于：

```html
<template>
  <Suspense>
    <!-- loading 等同于 pending，取决于数据是否全部获取到 -->
    <template #loading> 加载中... </template>
    <template #default>
      <div v-for="todo in todos">{{ todo.name }}</div>
    </template>
  </Suspense>
</template>
```

在这种情况下，需要通过解构获取 `pending`​ 值来处理加载状态。

```ts
const { pending, data: todos } = useLazyFetch<Todo[]>("/api/todos");
```

#### **Client**

默认情况下，useFetch 会在客户端和服务端同时发出请求，可以将 `server`​ 设置为 `false`​ ：

```ts
const { pending, data: posts } = useFetch<Todo[]>("/api/todos", {
  lazy: true,
  server: false,
});
```

这不需要在初始渲染时获取的数据时特别有用，比如不涉及 SEO 或敏感数据的情况使用。

> 当在页面中使用 useFetch 并且刷新页面时会感觉到加载很慢，这是因为 Nuxt.js 在服务端请求完数据后才返回页面。如果没有在服务器上获取数据，例如使用 `server: false`​，数据将在 hydration 过程完成之前不会被获取。这意味着即使在客户端等待 `useFetch`​，数据在 `<script setup>`​ 中仍将继续为 `null`​。

#### **Pick**

​`pick`​ 选项可以在服务端返回某个字段的数据，从而减少 HTML 页面的负载大小：

```html
<script setup>
  const { data: todos } = await useFetch<Todo[]>('/api/todos', {
    pick: ['id', 'name'],
  })
</script>

<template>
  <div v-for="todo in todos">
    <span>{{ todo.name }}</span>
    <span>{{ todo.id }}</span>
  </div>
</template>
```

如果想修改更多字段或者某个属性值，可以使用 `transform`​ 函数来修改查询结果：

```ts
const { data: todos } = await useFetch<Todo[]>("/api/todos", {
  transform: todos => {
    return todos.map(todo => ({ name: todo.title, id: todo.description }));
  },
});
```

#### **Refresh**

为了手动获取或更新数据，可以使用 useFetch 提供的 `execute`​ 或 `refresh`​ 函数：

```html
<script setup>
  const { data, error, execute, refresh } = await useFetch('/api/todos')
</script>

<template>
  <div>
    <p>{{ data }}</p>
    <button @click="refresh">刷新数据</button>
  </div>
</template>
```

这两个函数功能是相同的，但 `execute`​ 是 `refresh`​ 的别名，并且在使用 `immediate: false`​ 时更符合语义。

当 `immediate`​ 选项设置为 `false`​ 时（默认为 `true`​），它将不会立刻发出请求。

#### **watch**

利用 `watch`​ 选项，我们可以在项目中让 useFetch 依赖其他响应式值，当 watch 的响应式值发生更改时会重新调用异步请求函数：

```ts
const count = ref(1);

const { data, error, refresh } = await useFetch<Todo[]>("/api/todos", {
  watch: [count],
});
```

#### 何时使用 `refresh`​ vs. `watch`​ 选项？

- 当你知道服务器端的数据已被修改，并且需要相应地更新客户端端的数据时，使用 `refresh()`​。
- 当用户修改需要发送到服务器的参数时，将这些参数设置为 `watch`​ 源。例如，如果要使用分页（Paginate）或查询参数（Query params）获取数据，这样每当用户更改查询条件时，将从重新调用异步请求函数。

#### Query

使用 `query`​ 选项，可以在 useFetch 中包含查询参数：

```ts
const queryValue = ref("anyValue");

const { data, pending, error, refresh } = await useFetch<Todo[]>("/api/todos", {
  query: { status: true, date: new Date() },
});
```

这个选项是 ofetch 的一个扩展，利用 `ufo`​ 生成 URL。提供的对象会自动转换为字符串格式。

#### interseptor

我们可以在选项中定义异步拦截器，以注入 useFetch 的生命周期事件：

```ts
const { data, pending, error, refresh } = await useFetch("/api/todo", {
  onRequest({ request, options }) {},
  onRequestError({ request, options, error }) {},
  onResponse({ request, response, options }) {},
  onResponseError({ request, response, options }) {},
});
```

## AsyncData

​`useFetch`​ 专门用于从给定的 URL 获取数据，而 `useAsyncData`​ 允许更复杂的逻辑。基本上 `useFetch(url)`​ 等同于 `useAsyncData(url, () => $fetch(url))`​，为最常见的用例提供了更简洁的开发体验。 然而，在某些情况下，使用 `useFetch`​ 可能不太适用，例如当 CMS 或第三方服务提供其自己的查询层时。在这种情况下，你可以利用 `useAsyncData`​ 封装你的调用，仍然享受 `useFetch`​ 提供的便利：

```ts
const { data, error } = await useAsyncData("getTodos", () => fetchTodos());
```

在 `useAsyncData`​ 中，第一个参数用作缓存从第二个参数（即查询函数）获得的响应的唯一 key 值。当然也可以省略参数并直接传递查询函数本身。在这种情况下，唯一 key 值将会被自动生成。

‍
