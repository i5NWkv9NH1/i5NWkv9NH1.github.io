---
title: Console 导致的内存泄漏
---

## 前言

在开发中，我们常常会使用 `Eslint` 来规范我们的代码，当我们在项目中使用 `console.log` 语句来打印变量、函数等内容，VScode 就会提示**Unexpected console... **这是为什么呢？`console.log` 不是方便我们查看变量数据吗？

![](https://s2.loli.net/2024/08/29/PY61AEum4XD9aMc.png)

## 原因分析

根据 Eslint [官方文档](https://eslint.org/docs/latest/rules/no-console)中提到的 「`console.log` 一般用于调试，不太适合在生产环境下去使用」，主要是由于 console.log` 会导致[**内存泄漏**](https://en.wikipedia.org/wiki/Memory_leak)。

举个例子：我们有以下的代码：

```ts
function handleClick() {
  const arr = new Array(100000).fill(0)
  console.log(arr)
}
```

![](https://s2.loli.net/2024/08/29/EN8x6AuGchkPtbY.png)

如果没有打印的话，这个数组在函数中运行完之后应该就被销毁了，变成垃圾会被回收。但是现在我们使用了 `console.log` 语句把它打印出来了，就导致 JavaScript 无法回收这个变量。

让我们在性能分析工具看看，我们点击开始录制，然后将页面上的按钮点击几次，打印多个包含10000项的数组，然后点击垃圾回收，最后停止录制。

![](https://s2.loli.net/2024/08/29/4NOSDi3x1bvWKE8.gif)

然后我们打开内存，可以看到在我们点击内存回收之后，内存无法回到最初的水平。

![](https://s2.loli.net/2024/08/29/byM9QYIwiqt6hcm.png)

为什么呢？因为 `console.log` 语句打印的变量无法被回收。

然后我们将打印语句注释掉，看看内存回收后又是什么结果？

```ts
function handleClick() {
  const arr = new Array(100000).fill(0)
  // console.log(arr)
  return arr
}
```

![](https://s2.loli.net/2024/08/29/b7rhCyjsIMFBfxm.png)

可以看到，内存回到了最初的水平。

## Vite.js 移除 console

如果使用的是 Vite.js 作为打包工具，那么可以通过配置来达到在生产环境下移除 console。

```ts
export default defineComponent({ mode }) => {
  return {
    esbuild: {
      pure: mode === 'production' ? ['console.log', 'debugger'] : []
    }
  }
}
```



## 参考链接

- [[Memory leak when logging complex objects](https://stackoverflow.com/questions/12996129/memory-leak-when-logging-complex-objects)]

- [Eslint console](https://eslint.org/docs/latest/rules/no-console)
- [Memory Leak](https://en.wikipedia.org/wiki/Memory_leak)