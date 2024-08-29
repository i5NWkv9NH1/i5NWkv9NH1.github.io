---
title: 封装 Resize 指令
---

## 前言

![](https://s2.loli.net/2024/08/29/y17iscjvPt95rOC.gif)

有些元素的区域是可以变化的，可能是因为浏览器窗口的大小变化，也有可能是它本身可以被调整。比如上面的图表，当图表所在的区域变大时，我们就需要渲染更多的数据。这在大屏数据展示中很常见：屏幕越大，显示的内容就越多。

为了实现这个效果，**我们需要知道某个元素的尺寸什么时候发生了变化**，这样我们就可以在尺寸变化时做出相应的调整。假设我们有一个指令：`v-size-ob`，可以用来监听元素的尺寸变化，并将变化的尺寸信息（比如宽度和高度）传递给一个回调函数来处理。

```vue
<template>
	<div v-size-ob="onSizeChange">
    
  </div>
</template>
```

```ts
function onSizeChange(size) {
  width.value = size.width
}
```

在这个例子中，`v-size-ob` 指令帮助我们监听某个DOM 元素的尺寸变化，然后通过回调函数 `onSizeChange` 把变化后的尺寸信息传递出来。

## 思路

在 Vue 中实现这个监听尺寸变化的指令，我们需要做两件事：

1. 监听 `el` 元素的尺寸变化。
2. 在 `el` 元素被移除时，取消这个监听。

### 如何实现尺寸变化的监听事件

在 JavaScript 中，有一个叫 `ResizeObserver` 的 API，它可以用来监听 DOM 元素的尺寸变化。我们可以用 `ResizeObserver` 来观察某个 DOM 元素，当它的尺寸变化时，就会触发我们提供的回调函数。

```ts
const ob = new ResizeObserver(callback); // () => {}
ob.observe(dom); // 监听 DOM 元素

export default {
  mounted(el, binding) {
    // 当元素挂载时
  },
  unmounted(el) {
    // 当元素被移除时
  }
};
```

`ResizeObserver` 不仅可以监听一个元素，还可以同时监听多个元素。所以，回调函数中会告诉你哪些元素发生了尺寸变化。

```ts
// ResizeObserver 返回一个 entries 数组
const ob = new ResizeObserver((entries) => {});
```

我们需要遍历这个 `entries` 数组，因为可能有多个元素尺寸发生变化。

```ts
for (const entry of entries) {
  console.log(entry);
}
```



![](https://s2.loli.net/2024/08/29/3ZyFB7vRWCs5Ujr.png)

可以看到，控制台输出了一个 `entry` 对象，它包含了很多信息，包括哪个元素发生了变化（`target`）、变化后的尺寸信息（`borderBoxSize`、`contentBoxSize`）等。我们要做的就是在尺寸变化时，调用模板中传给指令的回调函数。

那么接下来我们要让它调用回调函数时，运行我们在template中传给指令的另一个回调函数：

```ts
const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    // 运行指定 DOM 元素的回调函数
  }
});

export default {
  mounted(el, binding) {
    // 监听 el 元素的尺寸变化
    ob.observe(el);
    // 获取模板中传递的回调函数
    console.log(binding.value);
  }
};
```

**⚠️ 注意：我们将 `ResizeObserver` 作为一个全局变量，这样无论这个指令在模板中被使用多少次，都是使用的同一个观察对象。**

![](https://s2.loli.net/2024/08/29/zqN76B31gPEx5jG.png)

那么接下来要考虑的是，如何在 `mounted` 中将元素的回调函数放到全局变量中运行呢？我们可以考虑使用 `map` 来存储。将观察的 DOM 元素作为 key，而对应的回调函数作为 value。

![](https://s2.loli.net/2024/08/29/bMtH7VQsGrSw9vn.png)

```ts
const map = new Map()

export default {
  mounted(el, binding) {
    // ...
    map.set(el, binding.value)
    ob.serve(el)
  }
}
```

但是更加注意的是，我们这里使用了 `new Map` 来存储，可是当我们把 DOM 元素作为 map 里某一个键，将来有一天我们不再需要监听的时候，这个 DOM 元素在页面上已经被移除了，但是在 map 里它仍然会存在着，它占用的内容空间没有被回收，如果不在某个特定的时间点把它给回收，可能导致会发生内存泄漏的问题。所以，为了图方便，我们可以使用 `WeakMap`。

```ts
const map = WeakMap()
```

接着，在 ResizeObserver 回调函数中添加模板中绑定的回调函数存储到map中：

```ts
for (const entry of entries) {
  const handle = map.get(entry)
  if (handle) {
    handle({
      // 这里可以根据业务场景需要传递
			// width: entry.contentRect.width,
      // height: entry.contentRect.height,
      widrth: entry.borderBoxSize[0].inlineSize,
      height: entry.borderBoxSize[0].blockSize,
    })
  }
}
```

为什么这里需要使用数组索引来获取呢？因为有些元素它可能生成的不止一个盒子，例如 `li` ，渲染出来会带有一个前缀黑点，其实也算一个盒子。所以这里就需要通过索引第一项来获取宽高。

除此之外，尺寸的信息为什么不是width和height。这是因为规范中考虑到逻辑属性，有些国家例如中东沙特，他们的网页布局方式可能是从上往下，或者从右往左（RTL），与常规布局完全不一样，所以在官方规范中为了严谨和消除歧义，就使用了 `inlineSize` 和 `blockSize` 两个逻辑属性来分别表示宽高。

最后，我们在模板里就可以使用这一指令并且使用参数来处理我们需要的业务逻辑。

```vue
<template>
	<div class="chart" v-size-ob="onSizeChange" />
</template>

<script setup>
// 在 ResizeObserver 回调函数中传递参数
function onSizeChange({ width, height }) {
  // ... 做点什么
}
</script>
```

## 代码

```ts
const map = new WeakMap();

const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const handle = map.get(entry.target);
    if (handle) {
      handle({
        width: entry.borderBoxSize[0].inlineSize,
        height: entry.borderBoxSize[0].blockSize
      });
    }
  }
});

export default {
  mounted(el, binding) {
    map.set(el, binding.value);
    ob.observe(el);
  },
  unmounted(el) {
    map.delete(el);
    ob.unobserve(el);
  }
};
```

```vue
<template>
  <div class="chart" v-size-ob="onSizeChange"></div>
</template>

<script setup>
function onSizeChange({ width, height }) {
  console.log(`宽度: ${width}, 高度: ${height}`);
  // 可以在这里执行其他逻辑，比如重新渲染图表
}
</script>
```

