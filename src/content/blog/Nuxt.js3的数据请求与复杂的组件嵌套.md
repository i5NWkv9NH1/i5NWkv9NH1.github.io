---
title: Nuxt.js 3 的数据请求与复杂的组件嵌套
pubDatetime: 2023-03-12
description: Nuxt.js 3 的数据请求与复杂的组件嵌套
featured: false
draft: false
tags:
  - JavaScript
  - Nuxt.js
---

## 前言

在使用现代 web 框架时，跨不同组件管理数据是一个常见的场景。想象一下，当其中一个组件中的操作（例如删除或更新数据）必须 reactive 另一个组件中的更新：例如获取产品等项目列表，并无缝地 reactive 整个应用中的删除等更新。

## 在 Nuxt 项目中保持数据一致

假如现在有一个 Nuxt 3 的项目，在页面组件中使用 `use fetch('/API/products')`​ 获取产品列表。在组件内部有一个 `ProductButtonDelete`​ 组件。当用户点击按钮时，我们触发一个 `$fetch`​（‘/API/products/1‘）调用。删除产品后，我们希望更新产品列表，获取删除之后的产品列表。

```html
<script setup lang="ts">
  // 获取数据
  const { data: products, refresh } = useFetch("/api/products");
  // 删除
  const remove = async (id: number) => {
    await $fetch(`/api/products/${id}`, { method: "DELETE" });
    // 更新数据
    refresh();
  };
</script>

<div>
  <ProductList>
    <ProductListItem v-for="product in products">
      <ProductButtonDelete @remove="remove(product.id)" />
    </ProductListItem>
  </ProductList>
</div>
```

然而，很多场景下都无法避免组件的深度嵌套。另一种更为直截了当的方式是在整个组件中向上传递事件，但这种方式又会导致在重构时更加麻烦。

```tree
components/
└── ProductList.vue
    └── ProductListItem.vue
        └── ProductDetail.vue
            ├── ProductDescription.vue
            ├── ProductPrice.vue
            └── ProductActions.vue
                ├── ProductButtonEdit.vue
                └── ProductButtonDelete.vue
```

## 解决方案：删除或更新数据时自动调用 useFetch

### 1. 创建全局的请求插件

```ts
// plugins/api.ts
type Handler = () => Promise<void>;
type Path = string;

export default defineNuxtPlugin(() => {
  let refreshHandlers: { path: Path; handler: Handler }[] = [];

  const $apiContext = {
    addRefreshHandler(path: Path, handler: Handler) {
      refreshHandlers.push({ path, handler });
    },
    removeRefreshHandler(handler: Handler) {
      refreshHandlers = refreshHandlers.filter(h => h.handler !== handler);
    },
    async refreshIncludedPaths(path: string) {
      const matchingHandlers = refreshHandlers.filter(r =>
        path.includes(r.path)
      );
      await Promise.all(matchingHandlers.map(h => h.handler()));
    },
  };

  const $api = $fetch.create({
    onResponse(context) {
      if (
        context.options.method === undefined ||
        context.options.method === "GET"
      )
        return;
      if (typeof context.request !== "string") return;
      $apiContext.refreshIncludedPaths(context.request);
    },
  });

  return {
    provide: {
      api: $api,
      apiContext: $apiContext,
    },
  };
});
```

这里，我们定义了一个 Nuxt 插件，对获取和刷新请求的 API 进行了抽象处理。

- ​`addRefreshHandler()`​: 允许注册新的刷新处理，当调用 `useFetch()`​ 时获取。
- ​`removeRefreshHandler()`​: 允许清理处理 `handle`​，确保在刷新期间不再调用。
- ​`refreshIncludedPaths()`​: 触发所有路径包含在给定路径中的处理 `handler`​。这允许基于上下文有选择地刷新数据。
- ​`$api()`​: 包装了 `$fetch`​，以触发 `refreshIncludedPaths()`​，因此在更新或删除数据时刷新整个应用程序中与 `useFetch()`​ 相关的所有数据。

​`refreshIncludedPaths()`​ 函数是逻辑的关键部分。因此，仔细看一下：

```ts
const $apiContext = {
  // ...
  async refreshIncludedPaths(path: string) {
    // path 可能是`/api/products/1`，`r.path` 可能是 `/api/products`
    const matchingHandlers = refreshHandlers.filter(r => path.includes(r.path));
    await Promise.all(matchingHandlers.map(h => h.handler()));
  },
  // ...
};
```

假设我们调用 `addRefreshHandler('/api/products', refresh)`​，并传入来自 `useFetch('/api/products')`​ 调用的 `refresh()`​ handler。此外，当我们通过调用 `$fetch('/api/products/1', { method: 'DELETE' })`​ 删除产品时，我们还调用了 `refreshIncludedPaths('/api/products/1')`​。

现在，`refreshIncludedPaths()`​ 中的 `filter()`​ 调用变为 `'/api/products/1'.includes('/api/products')`​，确保所有由 `useFetch('/api/products')`​ 调用返回的 `refresh()`​ handler 都被执行。

当然，在某些情况下，这可能过于广泛。例如，假设我们有一个页面获取产品列表（`useFetch('/api/products')`​）和一个获取经过筛选的产品列表的组件（`useFetch('/api/products', { query: { category: 'Hardware' } })`​）。在这种情况下，我们可能会不必要地刷新其中一个。~~然而，对于许多项目来说，稍微过多的调用可能是可以接受的。~~

我还考虑过使用 `refreshNuxtData()`​。但面临的问题是，它要么过于广泛（如果我们不指定任何 `key`​ 值，则刷新所有数据），要么在带有查询参数时过于精细。例如，当从 `/api/products`​ 和 `/api/products?category=hardware`​ 获取数据时，我们必须为这两个调用 `refreshNuxtData()`​ 时使用两个不同的 `key`​ 值，或者在没有查询参数的情况下调用它，并刷新不仅来自 `/api/products*`​ 的数据，而是所有数据。

另一种可能性是结合使用自定义 `key`​ 值和 `useLazyAsyncData()`​，这非常麻烦，并且会影响其他方面，比如缓存。

### 2. 在 Composable 中使用 Context

```ts
// composables/api.ts
import type { UseFetchOptions } from "nuxt/app";

export const useApi = () => {
  const nuxtApp = useNuxtApp();

  return {
    invoke: nuxtApp.$api,
    useGet: <T>(
      url: Parameters<typeof $fetch>[0],
      options: Omit<"method", UseFetchOptions<T>> = {}
    ) => {
      const { refresh, ...rest } = useFetch(url, {
        ...options,
        $fetch: nuxtApp.$api,
      });

      const handler = async () => {
        await refresh();
      };
      if (typeof url === "string") {
        nuxtApp.$apiContext.addRefreshHandler(url, handler);
      }

      onUnmounted(() => {
        nuxtApp.$apiContext.removeRefreshHandler(handler);
      });

      return {
        ...rest,
        refresh,
      };
    },
  };
};
```

在这个 **composable 中，** 我们返回了 `invoke()`​ 和 `useGet()`​ 函数。其中，`invoke()`​ 用于触发更新和删除操作，而 `useGet()`​ 则是 `useFetch()`​ 的替代品，我们在加载数据时始终希望使用它。

### 3. 在组件中使用 Composbles

```ts
// composables/product.ts
export const useProduct = () => {
  const { invoke, useGet } = useApi();

  return {
    useList() {
      return useGet("/api/products");
    },
    async remove(id: number) {
      await invoke(`/api/products/${id}`, {
        method: "DELETE",
      });
    },
  };
};
```

```ts
<!-- product list -->
<script setup lang="ts">
  const { useList } = useProduct();
  const { data: products } = await useList();
</script>
```

```ts
<!-- product -->
<script setup lang="ts">
  const { remove } = useProduct();

  const props = defineProps<{
    id: number;
  }>();
</script>

<template>
  <VBtn @click="remove(props.id)">Delete</VBtn>
</template>
```

## 其他替代方案

虽然上面的全局API上下文方法有效地解决了保持数据同步的问题，但值得考虑其他替代方法：

### 1. 通过组件的事件总线（EventBus）进行事件冒泡

一种替代方案是通过组件层级进行事件冒泡。在这种方法中，可以使用 Vue.js 的自定义事件机制，通过在组件层级上传递事件，实现数据同步。

当数据发生更改时，可以触发自定义事件，然后在组件层级中捕获这些事件并进行相应的处理。

在 Vue.js 中，可以使用 `$emit`​ 触发自定义事件，然后在父组件中使用 `@custom-event`​ 来监听和处理这些事件。

优点：

- 相对简单的实现，不需要引入全局上下文。
- 可以更灵活地控制事件的传播和处理逻辑。

缺点：

- 可能会导致较深的嵌套层级，使得代码复杂性增加。
- 在大型项目中可能需要谨慎使用，以避免事件传播的性能问题。

### 2. 使用实时数据库，如 Supabase 或 Firebase

利用实时数据库，如 Supabase 或 Firebase，这些数据库提供了内置的订阅功能。当数据库中的数据发生更改时，订阅的组件会自动接收更新。

优点：

- 提供实时更新，无需手动刷新请求。

缺点：

- 成本较高，且不太适用于部分老旧的项目。

### 3. GraphQL

使用 Vue Apollo 结合 GraphQL。

优点：

- 数据获取效率高，因为只请求必要的数据。
- 一些 GraphQL 客户端提供内置的状态管理和缓存机制。

缺点：

- 引入了新的复杂性，学习曲线相对较高。
- 需要设置 GraphQL 服务器。

### 4. 使用 Pinia 进行状态管理

Pinia.js 是 Vue.js 官方推荐的状态管理库，将状态集中管理，包括 API 数据。

优点：

- 为状态提供单一的真实来源。
- 可以在任何组件中进行获取。

缺点：

- 需要谨慎设计状态管理，
- 可能对简单的项目而言过于复杂，杀鸡用牛刀。

‍
