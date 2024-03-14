---
title: 使用 Intersection Observer API 创建无限滚动（上拉加载）组件
pubDatetime: 2024-02-10
description: 使用 Intersection Observer API 创建无限滚动（上拉加载）组件
featured: false
draft: false
---

## 为什么需要无限滚动

无限滚动是一种列表页面设计方法，它在用户向下滚动时持续加载内容。它消除了分页的需要，即把内容分成多个页面。

无限滚动相对于分页的最大优势是它减少了对用户的干扰。一方面有助于创建无缝体验并鼓励用户保持参与。 降低互动成本。如果页面持续快速地加载新数据，而用户不必按下分页按钮并等待新数据加载，则交互成本会降低。另一方面，如果用户想要导航回他们已经看过的项目，用户不必按下后退按钮并等待上一页加载-他们可以简单地向上滚动。 非常适合移动设备。

## 什么是 Intersection Observer API

在以前获取 DOM 元素的位置通常会使用 `getBoundingClientRect()`​ 方法，不过基于性能优化、更简洁的代码、更灵活的配置的考量，使用 Intersection Observer API 会是更好的选择。

​`Intersection Observer API`​ [自 2019 年已经被各大浏览器广泛支持 🔗](https://caniuse.com/intersectionobserver)，其用途主要是检测 DOM 元素是否进入或离开另一个 DOM 元素或浏览器的视窗范围内，并且可以通过设置阈值来触发相应的事件。

其应用场景非常的广泛，包括常见的懒加载图片、元素可见性检测等，**无限滚动（上拉加载）** 就是其中的一个应用场景。

## 示例

既然称之为无限滚动就意味着 `回调函数`​ 要请求数据，不过在示例中直接简化此处的流程，写一个返回假数据的函数即可。

这样 `getCards`​ 函数就可以通过输入每页数据数与当前页数来生成对应的卡片数据。

```js
/**
 * @param {number} 每页数据数
 * @param {number} 当前页数
 * @returns {Array} 假卡片数据
 */
function getCards(perPage, currentPage) {
  return Array.from({ length: perPage }, () => ({
    title: currentPage.toString(),
  }));
}

getCards(3, 2); // [{ title: '2' }, { title: '2' }, { title: '2' }]
```

### 需求分析

无限加载即自动检测用户是否滚动到「无限加载组件」的底部，并触发加载动作。具体需求可以更详细地定义为以下几点：

1. 如果加载后组件仍然在可视范围内，持续加载数据直到超出可视范围。
2. 如果加载后组件在可视范围外，停止加载数据。
3. 超过 [x] 页时完全停止加载。

为了确定目标组件是否在可视范围内，可以创建一个通用的组件来进行检测并触发事件，即接下来要创建的 `Observer.vue`​ 元件。

### 创建 Observer.vue 组件

通过在列表底部嵌入一个没有内容和样式的元素，并设定 **“当与视窗关系发生变化时（离开/进入）”** 触发 Vue 自定义事件执行相关代码片段。

具体来说，封装好的 Observer.vue 组件如下：

```html
<script setup lang="ts">
  import {
    ref,
    onMounted,
    onBeforeUnmount,
    defineProps,
    defineEmits,
  } from "vue";

  const { observerOptions } = defineProps(["observerOptions"]);
  const emit = defineEmits(["onInView", "onOutsideView"]);

  const target = ref<HTMLElement>();
  const observer = ref<IntersectionObserver>();

  onMounted(() => {
    observer.value = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        emit("onInView");
      } else {
        emit("onOutsideView");
      }
    }, observerOptions);

    observer.value.observe(target.value!);
  });

  onBeforeUnmount(() => {
    console.log("distory");
    observer.value!.disconnect();
  });
</script>

<template>
  <div ref="target" class="target" />
</template>
```

组件代码非常简单，即通过在空的 `<div>`​ 元素上挂载时创建新的 IntersectionObserver 实例，触发相应的事件，并在组件销毁时移除 IntersectionObserver 实例。

之后将这个组件引入到无限加载列表的底部，这样就可以通过监听 `@onInView`​ 事件来触发加载动作。

### 设置 Props

一个无限加载的列表必备的 Props 有：

- ​`maxPage`​​ 最大页数
- ​`perPage`​​ 每页数据数
- ​`currentPage`​​ 当前页数
- ​`isInView`​​ 是否在可视范围内

```ts
const infinteScrollOptions = {
  maxPage: 10,
  perPage: 3,
  currentPage: 1,
  isInView: false,
};
```

并且创建第一批响应式数据，这里我在卡片中塞入了随机的 [picsum](https://picsum.photos/) 图片并根据 index 作为图片的 ID（请随意塞入任何你想呈现的数据）。

```html
<script setup>
import { ref } from "vue"
const cards = ref(getCards(infinteScrollOptions.perPage, infinteScrollOptions.currentPage))
<script>

<template>
  <ul class="cards">
    <li class="card" v-for="(card, index) in cards">
      <img :src="`https://picsum.photos/id/${index}/300/300`" width="300" height="300" alt="Random Image">
      <p>
        #Image: {{ index }}
      </p>
    </li>
  </ul>
<template>
```

### 无限滚动加载逻辑

接下来是在 `Observer.vue`​ 触发事件时，通过切换 `isInView`​ 的状态来决定是否继续执行加载动作，以及只有在 `Observer`​ 组件存在于可视范围中时才会主动触发加载。

加载过程中特别使用了 lodash 的 `throttle`​ 节流函数来控制加载频率最大 300 毫秒才能触发一次，是为了：

1. 避免加载的内容还没渲染上画面，导致疯狂触发列表仍未加载满而反复加载问题。
2. 避免用户频繁滚动时过度触发加载请求导致性能问题。

```ts
import { throttle } from "lodash";

function handleInView() {
  infinteScrollOptions.isInView = true;
  handleLoadmore();
}

function handleOutsideView() {
  infinteScrollOptions.isInView = false;
}

const handleLoadmore = throttle(
  function (options = infinteScrollOptions) {
    console.log("api...");
    const { perPage, currentPage, isInView, maxPage } = options;
    if (currentPage > maxPage) return;
    const newCurrentPage = currentPage + 1;
    infinteScrollOptions.currentPage = newCurrentPage;
    const newCards = getCards(perPage, newCurrentPage);
    cards.value = [...cards.value, ...newCards];
    if (isInView) {
      handleLoadmore();
    }
  },
  300,
  { leading: true, trailing: true }
);
```

### 使用 Observer 组件

```html
<Observer
  v-if="!(infinteScrollOptions.currentPage > infinteScrollOptions.maxPage)"
  @onOutsideView="handleOutsideView"
  @onInView="handleInView"
/>
```

## 纯 Javascript 示例

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Intersection Observer 例子</title>
    <style>
      .card {
        width: 200px;
        height: 300px;
        margin: 10px;
        border: 1px solid #ccc;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script src="app.js"></script>
  </body>
</html>
```

```ts
// app.js

// 分页数据
const perPage = 5;
let currentPage = 1;

// api 请求
// 返回假的卡片数据
const getCards = (perPage, currentPage) => {
  const start = (currentPage - 1) * perPage + 1;
  const end = start + perPage - 1;
  const cards = [];

  for (let i = start; i <= end; i++) {
    cards.push(`Card ${i}`);
  }

  return cards;
};

const cardContainer = document.getElementById("app");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 当目标元素进入可视范围内时触发加载
        const cards = getCards(perPage, currentPage);
        renderCards(cards);
        currentPage++;
      }
    });
  },
  { threshold: 1.0 }
); // 当目标元素完全进入可视范围内触发回调

const renderCards = cards => {
  cards.forEach(cardText => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = cardText;
    cardContainer.appendChild(card);
  });
};

// 初始加载第一页的卡片数据
const initialCards = getCards(perPage, currentPage);
renderCards(initialCards);

// 观察最后一个卡片元素
const lastCard = document.querySelector(".card:last-child");
if (lastCard) {
  observer.observe(lastCard);
}
```

‍
