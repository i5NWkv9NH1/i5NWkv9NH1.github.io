---
title: 使用 Defer 优化白屏时间
pubDatetime: 2024-08-30
draft: true
tags:
  - JavaScript
  - Vue.js
---

## 前言

假设你有一个父组件 `Parent.vue`，它渲染了 100 个 `VSheet` 组件，每个 `VSheet` 里又包含了 5000 个 `VCard` 组件：

```vue
<!-- Parent.vue -->
<template>
  <VContainer>
    <VSheet v-for="item in 100">
      <!--  -->
      <Anything />
    </VSheet>
  </VContainer>
</template>
```

而每个子组件 `Child.vue` 看起来是这样的：

```vue
<!-- Child.vue -->
<template>
  <VCard v-for="card in 5000" :key="card">
    <!--  -->
  </VCard>
</template>
```

即使这些组件没有复杂的 JavaScript 代码，它们在渲染时仍然可能导致白屏问题。那问题的根源在哪里呢？

## 原因分析

![devtool](https://s2.loli.net/2024/08/27/lRzWmAfrgqe1pLU.png)

如图所示，性能分析工具显示大部分时间花在了渲染和 JavaScript 执行上。这是因为 Vue 在生成组件时会生成大量的 JavaScript 代码，从而导致渲染过程非常耗时。

JavaScript 是**单线程**的，这意味着它只能一次执行一个任务。在浏览器中，这种单线程的特性影响了页面的渲染、用户交互以及脚本执行：

- **UI 渲染**：浏览器需要不断地渲染页面的内容，这也包括处理用户的交互，比如点击和滚动。
- **JavaScript 执行**：JavaScript 执行会阻塞其他任务，尤其是 UI 渲染。如果脚本执行时间过长，会导致浏览器无法及时更新页面，从而产生白屏或卡顿。

## 解决方案

虽然组件很多，但用户一次只能看到页面的一部分。我们可以优先渲染那些对用户体验最重要的组件，让用户能尽快看到页面的核心部分。这样，即使总的渲染时间没有减少，用户的体验也会得到显著改善。

举个例子，假设我们有多个 `Comp` 组件。我们可以让 `Comp_` 组件在页面的第一帧渲染，`CompB` 组件在第二帧渲染，`CompC` 组件在第四帧渲染。这样可以确保用户首先看到重要的组件，而不必等到所有组件都渲染完毕。

![](https://s2.loli.net/2024/08/27/1ODxvphUT36J8eM.png)

## 示例代码

为了实现这个优化，我们可以使用 `requestAnimationFrame` 来延迟渲染不那么重要的组件。下面是一个示例代码：

```ts
// useDefer.ts
import { ref, onMounted } from "vue";

/**
 * useDefer 钩子用于在 Vue 组件中实现延迟渲染功能。
 * 通过逐帧更新渲染状态来分批处理组件的渲染，以减少白屏时间。
 * @param maxCount - 最大帧数，默认值为 100。
 * @returns 一个函数，接受一个帧数参数 n，根据当前的帧数返回是否应该渲染组件。
 */
export function useDefer(maxCount = 100) {
  // 记录当前的帧数
  const frameCount = ref(0);
  let rafId: number;

  /**
   * 更新帧计数。
   * 使用 requestAnimationFrame 在每一帧更新帧计数，并递归调用自己。
   * requestAnimationFrame 能够在浏览器的下一个重绘周期中执行代码。
   * 这样可以确保渲染操作与浏览器的刷新率同步，从而减少卡顿和白屏现象。
   * 通过分批处理渲染任务，每次仅渲染一部分内容，可以避免一次性加载所有内容而导致的性能瓶颈。
   */
  function updateFrameCount() {
    rafId = requestAnimationFrame(() => {
      frameCount.value++;
      // 递归调用 updateFrameCount，直到帧计数达到 maxCount
      if (frameCount.value < maxCount) {
        updateFrameCount();
      }
    });
  }

  // 启动帧计数更新
  updateFrameCount();

  // 在组件挂载完成后，取消动画帧请求
  onMounted(() => {
    cancelAnimationFrame(rafId);
  });

  /**
   * 根据当前帧数决定是否应该渲染组件。
   * @param n - 需要的帧数。
   * @returns 布尔值，表示是否应该渲染组件。
   */
  return function defer(n: number) {
    return frameCount.value >= n;
  };
}
```

```vue
<!-- Example -->
<Comp_ v-if="defer(0)" />
<Comp_ v-if="defer(1)" />
<CompB v-if="defer(4)" />
<CompB v-if="defer(10)" />

<!-- Parent.vue -->
<template>
  <VContainer>
    <VSheet v-for="item in 100">
      <!--  -->
      <Anything v-if="defer(item)" />
    </VSheet>
  </VContainer>
</template>

<script setup>
const defer = useDefer();
</script>
```

在上面的代码中，第一个组件会在第一帧渲染，第二个组件会在第二帧渲染，依此类推。

如果你有多个组件，也可以使用自定义的数组对象来管理它们：

```vue
<template>
  <VSheet v-for="comp in comps" :key="comp.key">
    <component :is="comp.component" v-if="defer(comp.defer)" />
  </VSheet>
</template>

<script setup>
import { useDefer } from "./useDefer";
import Comp from "./Comp.vue";
import CompA from "./CompA.vue";

const defer = useDefer();
const comps = [
  { key: "Comp_", component: Comp, defer: 1 },
  { key: "CompA", component: CompA, defer: 2 },
  // ...
];
</script>
```

## 其他解决方案

- **懒加载**：使用 `defineAsyncComponent` 可以让不立即可见的组件或资源在需要时再加载。
- **骨架屏**：骨架屏是一种占位图，通常用于在数据加载时提供视觉反馈。可以使用简单的 CSS 或者组件库来实现骨架屏：
- **服务端渲染**：服务器端渲染可以在服务器端生成 HTML，减少客户端渲染时间。使用 Nuxt.js 等框架可以方便地实现 SSR。

## 参考链接
