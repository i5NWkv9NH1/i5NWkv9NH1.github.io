---
title: 不复杂！以简单的方式管理 Vue.js 中请求数据的状态
pubDatetime: 2024-01-22
description: 不复杂！以简单的方式管理 Vue.js 中请求数据的状态
featured: false
draft: false
---

获取和显示数据对于前端工程师来说是家常便饭的任务，但随着背后状态的增多，整个项目可能变得非常混乱。因此，通过这篇文章，我想指出一些问题并提出一些可行的解决方案，记录寻找更高效解决方案的过程。

尽管文章中使用了 Vue Composition API，但重点不在于使用的框架，而是背后的概念。React 的语境也是类似的，如果您想从 React 的角度入手，我推荐阅读这篇文章：[为什么你不应该在 React 中直接使用 useEffect 从 API 获取数据](https://blog.skk.moe/post/why-you-should-not-fetch-data-directly-in-use-effect/)。

## 从发送一个简单的请求开始

目前有一个简单的[产品 API](https://dummyjson.com/)，需求是将数据获取并显示在页面上。这里使用 JS 原生的 [fetch API](https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API) + [Async / Await](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/async_function) 来处理异步请求，并通过状态来驱动页面。

```html
<script setup>
  import { ref } from "vue";

  const product = ref({});

  async function getProduct() {
    const productResponse = await fetch("https://dummyjson.com/products/1");
    if (!productResponse.ok) {
      console.error(productResponse);
      return;
    }
    const productJSON = await productResponse.json();
    product.value = productJSON;
  }

  getProduct();
</script>

<template>
  <div>
    <img :src="product.thumbnail" />
    <h2>{{ product.title }}</h2>
    <p>{{ product.description }}</p>
  </div> </template
>​​
```

​![image.png](https://s2.loli.net/2024/02/25/LqdbX2NUwjCotGr.png)​

当然，这个有效的请求URL肯定能返回数据，但是问题在于：**但你发现这样做并没有办法显示请求出错或是加载的状态，用户无法知道任何进展！因此下一个版本来尝试新增更多状态来处理这个问题。**

## 新增加载与错误状态

在这个版本使用更多状态像是 isLoading 或 errorMessage 来记录请求的状态，并且通过这些状态来驱动 UI 给用户更多提示。

```html
<script setup>
  import { ref } from "vue";

  const { productUrl } = defineProps({
    productUrl: {
      type: String,
      default: "https://dummyjson.com/products/1",
    },
  });

  const product = ref({});
  const isLoading = ref(true);
  const errorMessage = ref("");

  getProduct(productUrl);

  async function getProduct(productUrl) {
    isLoading.value = true;
    const productResponse = await fetch(productUrl);
    if (!productResponse.ok) {
      console.error(productResponse);
      errorMessage.value = (await productResponse.json()).message;
      return;
    }
    const productJSON = await productResponse.json();
    product.value = productJSON;
    isLoading.value = false;
  }
</script>

<template>
  <div id="app">
    <div class="mx-auto max-w-fit bg-white p-4 text-black">
      <div class="bg-red-300 p-4" v-if="errorMessage">{{ errorMessage }}</div>
      <!-- 在这里判断是否请求中 -->
      <div v-else-if="!isLoading">
        <img :src="product.thumbnail" />
        <h2>{{ product.title }}</h2>
        <p>{{ product.description }}</p>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div> </template
>​​
```

​![i](https://s2.loli.net/2024/02/25/Y3OA7hIS4D6ue8G.png)​

‍

到这里用户使用体验已经接近完善了，但开发体验却不尽人意，因为当规模扩大或需求变更时，组件终将会塞满各式各样的状态，光是理解这些状态避免切换错误就是一件很累人且容易出错的事。

除此之外加载过程的[版面偏移](https://web.dev/articles/cls?hl=zh-tw)造成的闪烁除了影响用户体验之外，重新计算页面布局也会造成性能上的问题，下一版本来尝试制作 UI 并解决这个问题。

## 添加 UI 与骨架屏

这次版本除了给数据添加基本样式之外也新增了骨架 UI，其实就是更贴近实际结果更华丽的 Loader 而已，这么做的好处是可以解决先前遇到的版面偏移。

```html
<template>
  <div v-if="errorMessage">{{ errorMessage }}</div>
  <div v-else-if="!isLoading">
    <ProductCard :product="product" />
  </div>
  <div v-else>
    <SkeletonCard />
  </div>
</template>
```

​![](https://s2.loli.net/2024/02/25/fRuwOrW2MXZp9h5.gif)​

到这个步骤，用户体验已非常完美，既有数据的展示，也有加载以及错误状态，但在状态管理方面则可以考虑以下几种方案来增进开发体验。

## 一种方式：通过 Composable 包装请求逻辑

反思处理这些状态的过程，发现其实这些状态都是为了处理数据的请求，因此可以通过封装相关逻辑来处理这些状态，让组件只需要关注数据本身即可。

举例来说，制作一个 useFetch 并输入请求 URL，然后输出数据、错误信息、请求状态等，不用再为每个请求开关状态。

```html
<script setup>
  const { data, error } = useFetch("https://dummyjson.com/products/1");
</script>

<template>
  <div v-if="error">{{ error.message }}</div>
  <div v-else-if="product">
    <ProductCard :product="product" />
  </div>
  <div v-else>
    <!-- 插入 4 个骨架屏卡片 -->
    <SkeletonCard v-for="i in 4" :key="i" />
  </div>
</template>
```

具体实例可以参考[官方文档](https://play.vuejs.org/#eNp9VNtu4zgM/RWuX+JiM3YXxb4USbC3LrCLuaFzefKLYtONWkcyJCppEOTfh5RsN5kpBmiRhCIPzzmkdMz+7PtiFzC7zRa+dron8EihX1VGb3vrCI7gsJ1Dbbd9IGzgBK2zW5hx0ewsKXj8F6neTOdFOYaKR8+Zlamt8QRr5fGL62AJsw1R72/L8tFb03eqxo3tGnQFHXpd2wYLblqSbawvGSCV64YrmVE++212NQZDxBsp5vkVLFdTo1+5ptipLiDnjxVHaBSpOaBz1s0ZkNyBqS8nHTljcv6iTK6wH/yDcMs8CfkXwFurGuht5HQrgcU6EFkDuzetdcsq06AN/F5l8Efd6fpJIkJeV9nqeAQNp9OiTCURvaJFo3dcrVtOjcQ4U4AZul99sL3/Be4kDMgqgiF02NwCY8XkYoveqweMuDLAWDhwmihEpYx7L59n/Tm15PbpW+KBncdERrzimn/4AzqWLW0XvUPRIWepJf9+FWMlTmnzUBTFeL4oJyuzeXa2KLyHl3u3V3xw17ZY0xzIfpU5freDlcHnWNIGU5NmtRdDhKPwSWOPZNP+mNDJgMeTaOH3R/J/RiBX/mBqSOsVUQHKkkv4yoAnVgNr5NkjtNI9Sk5Z0jftILcQ+BROc/sxfg5tux0CbTAueUoVFhtnjQ2+O4C3oGnmgZyqn/iCKg9qAmiwR9PwvhxgfbjQEgWO6hk7ObscPR72/4WNXJBBc0RWjnSra606btKpAzBbZRoeS1pdsY8A1F5pAtJbtGFoKmEGCEa8voK97jq5gMGZqJOjg07dJmVKYnJBhtaW09xe++RLyo0oa6kWoGjDG+0HAZRUspssMDGKExKRUa28DBH9YlApk6t4Ma0ZHTtBLTZCjsNq/ThJHDLl4xRfHRgVXjw8ksF/lXnFz8pM6zy5l/oNSAb38JGvAfuQ58OiyEv2yNM931Bezs8DwMXmgvibv1O0KdLg+HQF18XNmSxpFoFH8SJf7vRlirTMhU98nvLZfVqE+Gt29VI62DKHm+vrGBVzTvwCkOcJtfohGs1vQESvMnnRdYfuQy8++Crj124Yaaa6zu7/jzFyAedjvN5g/fRK/NE/S6zKPsp9dTussumMlHtASsd3n97jM3+fDre2CR1n/+TwXkwKwjGl/RVMw7TP8iLb/+LLxs/CZ3/3TGj8KEqIRjtifpXxu/b3T6S/0L0pbmKduHj6BqMzlM8=)、[Vueuse 的示例](https://vueuse.org/core/useFetch/#demo)或是 [Nuxt 的示例](https://nuxt.com/docs/api/composables/use-fetch)，在这之上可以扩展更多功能像是快取、重试(Refresh)、渲染模式(mode)切換……等进阶功能。

## 另一种方式：使用实验性组件 <Suspense />

​`<Suspense>`​ 实际上就是 Vue 的默认组件用于处理异步加载的组件。在异步组件加载完成之前，可以显示默认内容。

​`<Suspense>`​ 有两个插槽🔗，分别是 default 和 fallback。它们的用途也很明显：default 用于放入异步组件，fallback 则是放入默认组件（如加载提示等信息）。

```html
<template>
  <!-- Vue.js 内置組件不需要引入，可以直接在 Template 中使用 -->
  <Suspense>
    <template #default>
      <!-- 放入异步组件 -->
      <AsyncProductCard />
    </template>
    <template #fallback>
      <SkeletonCard />
    </template>
  </Suspense>
</template>
```

所谓的异步组件实际上有两种可能性：1. `async setup()`​ 或者 2. [Top level await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await)。

```html
<!-- async setup() -->
<script>
  export default {
    async setup() {},
  };
</script>

<!-- top level await -->
<script setup>
  await xxx();
</script>
```

所以这样我们可以直截了当地制作一个异步组件 `AsyncProductCard`​（如下），并且通过上一层的 `<Suspense>`​ 帮助我们在组件加载完成之前自动显示预设内容。

```html
<script setup>
  import ProductCard from '../ProductCard.vue';

  import { ref } from 'vue';

  const product = ref({});

  async function getProduct() {
    const productResponse = await fetch('https://dummyjson.com/products/1');
    if (!productResponse.ok) {
      console.error(productResponse);
      // 在请求失败时抛出错误让父组件处理
      throw Error('请求失败');
    }
    const productJSON = await productResponse.json();
    product.value = productJSON;
  }
  await getProduct();
</script>

<template>
  <ProductCard :product="product" />
</template>
```

至于错误处理可以使用 Vue3 的 `onErrorCaptured`​🔗 生命周期，这个生命周期可以捕捉子组件的错误，并且可以在上层组件中处理错误，这样一来请求错误也可以显示反馈给用户了。

```html
<script setup>
  import { ref } from "vue";

  const error = ref(null);
  onErrorCaptured(err => {
    error.value = err.message;
  });
</script>

<template>
  <div v-if="error" class="bg-red-300">Err: {{ error }}</div>
  <ProductCard :product="product" />
</template>
```

## 延伸阅读

- [Suspense 组件](https://vuejs.org/guide/built-ins/suspense.html)
