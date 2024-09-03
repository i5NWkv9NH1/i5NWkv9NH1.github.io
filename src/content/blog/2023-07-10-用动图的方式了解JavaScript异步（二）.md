---
title: 用动图的方式了解 JavaScript 异步（二）
pubDatetime: 2023-07-10
tags:
  - JavaScript
---

## 前言

回顾上一篇文章了解到，异步编程实际上是通过执行环境（例如浏览器、Node.js）提供的 API 来实现同时处理多个任务的。

简而言之，**JavaScript 引擎一次只能执行一项任务，但执行环境提供了方法，使得 JavaScript 可以以异步方式执行**。以下是一个简单的问题，来检查一下对上一篇文章的理解：

```ts
function cat() {
  console.log("🐱");
}

function dog() {
  setTimeout(() => {
    console.log("🐶");
  }, 0);
}

function human() {
  console.log("✋🏻");
}

cat();
dog();
human();
```

从字面上的顺序和意义来看，结果应该是：🐱 > 🐶 > ✋🏻，但实际上答案是：🐱 > ✋🏻 > 🐶。

这是因为 dog 函数中的 setTimeout 是**异步**的，会被推入 Callback Queue 中等待当前 Call Stack 上的任务都执行完之后才会被执行。

在此之前，会先继续完成当前主执行线程上的任务，所以先是 ✋🏻，然后才是 🐶。

![exam.gif](https://s2.loli.net/2024/02/25/9EYG4QnCroV1Ldi.gif)​

## 实际的异步程序

前面的例子非常简单，大不了就是指定一段代码在特定时间后返回处理，但实际会遇到的情况往往会复杂得多，实际案例来说像是：

- 索取不确定因素（需要等待一段时间）的数据 (AJAX)
- 处理耗时费力的工作，阻塞其他程序执行 (Thread Blocking)

遇到这些情况就必须考虑到错误情境的处理、程序的执行顺序的问题，这时候就需要一个好的异步方式，让代码更容易阅读、维护，也能更有效率地处理异步的程序。

三种常见的异步处理方法，由浅入深：

- 回调函数
- Promise 与其方法
- Async / Await

实际编写并提出每种方法的特点以及要注意的地方。接着会用以下这个非常简单的例子作为示例，并尝试不同的写法。

```ts
// 说明：这是一个同步的函数，作用是计算正方形面积 (边长 x 边长)
// 后面都会以这个简单的例子作为代码示例，改写为非同步程序
// 需求：计算正方形面积，但是要等 1 秒后才能回传结果

function getSquareArea(side) {
  return side * side;
}

getSquareArea(2); // 4
```

### 回调函数 Callback

> "[回调函数](https://developer.mozilla.org/zh-TW/docs/Glossary/Callback_function)" 是一个函数，将其作为参数传入另外一个函数的时候就可以被称作是回调函数。

为什么要使用回调函数呢？

为什么学习异步和回调函数相关呢？

想一想我们经常使用的 `addEventListener`​ 或 `setTimeout`​ 方法，它们都是将异步事件的执行任务包装为一个函数，并作为参数传递进去的例子：

```html
<button>点击我触发事件👆🏻</button>

<script>
  const button = document.querySelector("button");
  button.addEventListener("click", function (event) {
    console.log(event);
    alert(`你点击了按钮！请打开浏览器控制台查看结果。`);
  });
</script>
```

通过回调函数，可以将非同步的代码包装为函数，并在非同步事件发生后执行该函数。拿前面计算正方形面积的程序来改写，当成功或错误就会返回对应的结果到回调函数内：

```ts
function getRectangleArea(side, callback) {
  // 定义错误情境 - 非数字
  if (typeof side !== "number") {
    callback(new TypeError("请输入数字"));
    return;
  }
  // 定义错误情境 - 非正数
  if (side <= 0) {
    callback(new Error("请输入正数"));
    return;
  }
  // 执行非同步行为，并且在非同步事件发生后执行 callback
  setTimeout(() => callback(null, side ** 2), 1000);
}

getRectangleArea(2, (error, result) => {
  // 如果有错误，就会在这里被捕捉到
  if (error !== null) {
    console.error(error);
    return;
  }
  console.log(result);
});
```

这就是回调函数的基本概念，总结一下它的优缺点：

- **优点：**

  - 直接，易于理解。
  - 结构类似于同步代码。

  **缺点：**

  - 可能导致回调地狱（Callback Hell）。
  - 控制反转（Inversion of Control）。
  - 风格不统一，代码易混乱。

### Promise

> 「[Promise🔗](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise)」 是一个代表未来可能完成或失败的操作的对象。

为了克服回调函数的缺点，ES6 引入了 Promise，它提供了一种标准化的方式来处理异步操作。Promise 有三种状态：

- **状态：一个 Promise 只可能会有三种状态的其中一种：**

  - `Pending`（待定） - 初始状态，操作还未完成。

    `Fulfilled`（已完成） - 操作成功完成。

    `Rejected`（已拒绝） - 操作失败。

- **结果：一个 Promise 只可能会有两种结果的其中一种：**

  - `resolve`​ - 成功
  - `reject`​ - 失败

先写一个全新的 Promise 来了解看看：

```ts
// resolve 与 reject 可自由命名
const promise = new Promise((resolve, reject) => {
  // 一些非同步的代码
  if (/* 判断结果 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

可以看见传入 Promise 的回调函数需要两个参数：成功时与失败时该执行的函数名称。我们可以轻易的在这个 Promise 中定义成功与失败的条件，像以下代码中只需要在成功时返回 resolve，失败时返回 reject 就可以了：

```ts
// Promise 会在 1 秒后返回结果，如果出错就会返回失败，成功就返回结果
function getRectangleArea(side) {
  return new Promise((resolve, reject) => {
    // rej
    if (typeof side !== "number") {
      reject(new TypeError("请输入数字"));
      return;
    }
    // rej
    if (side <= 0) {
      reject(new Error("请输入正数"));
      return;
    }
    // res
    setTimeout(() => {
      resolve(side ** 2);
    }, 1000);
  });
}
```

现在成功的把回呼函数改为使用 Promise 了，但拿到了 Promise 之后该如何使用呢？直接同步的去使用 Promise 吗？

答案是不行的，因为当非同步行为执行时的当下 Promise 的状态会是 Pending，直接存取 Promise 是没办法将需要等待完成的值给取出来的。

```ts
// 无法在同步下直接调用 Promise
// 会输出 <Pending>
console.log(getRectangleArea(2));
```

#### 如何取得 Promise 的返回值？

可以使用 Promise.then 方法去应对该 Promise 执行完后成功与失败的情境：

```ts
Promise.then(success, error);
```

更常见还是会使用 .catch 来捕捉错误的情境，它们之间细节上有一些不同，不过使用 .catch 的方法会比较全面且直观，建议绝大多时候这样写即可：

```ts
Promise.then(success).catch(error);
```

换上前面设定好的题目就可以用这样的方式处理 getRectangleArea 这个函式回传的 Promise 物件：

```ts
getRectangleArea(2)
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

这就是 Promise 的基本概念，来总结一下 Promise 的特点：

- **优点：**

  - 更清晰的代码结构。
  - 统一的错误处理。
  - 提供了许多处理异步操作的方法，如 `Promise.all`。

  **缺点：**

  - 只能处理一个结果。
  - 旧浏览器不支持。

### Async / Await

> 「[Async / Await](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)」是一个语法糖，能够写出同步风格的异步代码。

**Async / Await** 是在 Promise 基础上引入的语法糖，可以让异步代码看起来像同步代码。

#### Async

async 关键字可以让 JavaScript 引擎了解目前正在编写一个异步的函数，并且让整个函数回调一个 Promise。

#### Await

await 关键字仅能在 async 函数内部使用，将其放置在 Promise 之前，它可以帮助我们等待 Promise 的解决，并取得其值。

```ts
async function asyncFunction() {
  const value = await getRectangleArea(2);
}
```

还可以加上 [try…catch 语法](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch) 去捕捉错误，写起來已經非常像同步代码了：

```ts
async function calcRectangleArea(side) {
  const rectangleArea = await new Promise((resolve, reject) => {
    if (typeof side !== "number") {
      reject(new TypeError("请输入数字"));
      return;
    }
    if (side <= 0) {
      reject(new Error("请输入正数"));
      return;
    }
    setTimeout(() => resolve(side ** 2), 5000);
  });
  console.log(rectangleArea);
}

calcRectangleArea(4);
```

## 该使用哪种方式处理非同步？

端看团队与个人偏好，并没有一定对错的答案。对我来说，如果没有包袱（版本问题、维护遗留代码）就用 **Promise + Async / Await** 即可，保持语法简洁且使用上也更为直观与一致，前提是最好理解了非同步的概念再使用会更好。

### 可以混用回调函数、Promise.then()、Async / Await 吗？

可以，但最好不要。应当统一方法避免造成不必要的~~混乱~~（圣战）。

## 参考资料

- [非同步的 JavaScript 介绍](https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/Asynchronous/Introducing)
- [Why Do We Need Javascript Promises? Inversion of Control | Asynchronous Javascript | Project Twine](https://www.youtube.com/watch?v=bAlczbDUXx8)
- [JavaScript Promises：简介](https://web.dev/i18n/zh/promises)

‍
