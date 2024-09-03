---
title: 了解 JavaScript 的事件模型
pubDatetime: 2019-06-10
description: 了解 JavaScript 的事件模型
featured: false
draft: false
---

当一个子元素及其父元素都对同一个事件有相应的事件处理程序时，哪个元素将首先触发？是子元素还是父元素呢？

探讨 JavaScript 事件冒泡和捕获，可以找到这个问题的答案。

## 什么是事件捕获（Event Capturing）

在事件捕获（也称为涓流）中，父元素事件比子元素事件较更早之前触发。例如，div 上的事件在 button 的事件之前触发:

事件捕获顺序：

```txt
document → html → body → parent → child
```

捕获的优先级高于冒泡，这意味着捕获事件处理程序在冒泡事件处理程序之前执行，如事件传播的各个阶段所示:

1. 捕获阶段：事件向下移动元素
2. 目标阶段：事件到达目标元素
3. 冒泡阶段：事件从元素中冒泡出来

## 什么是事件冒泡

事件冒泡遵循与事件捕获相反的顺序。事件从**子元素**传播，然后在 DOM 层次结构中向上移动到其父元素:

事件冒泡顺序：

```txt
child → parent → body → html → document
```

## 监听传播事件

我们可以使用追加到 `HTML`​ 节点的 `addEventListener`​ 方法来侦听这些传播事件。它接受三个参数：事件名称、回调函数和可选的捕获值，该值默认设置为 `false`​ ：

```ts
element.addEventListener(event, handler, false);
```

## 当捕获值为 false

想象一下当捕获值为空时，如果用户单击按钮会发生什么情况？

```ts
element.addEventListener(event, handler);
```

点击事件开始于捕获阶段。它在目标的父元素中搜索带有事件处理程序的事件。它不会找到任何捕获阶段的事件处理程序。

接着，事件向下冒泡到目标。一旦执行了捕获阶段的所有事件，事件就转移到其冒泡阶段。它执行在目标元素上设置的任何事件处理程序。然后再次向上传播，通过目标的父元素搜索任何冒泡阶段的事件处理程序。现在，事件循环完成。

## 当捕获值为 true

```ts
element.addEventListener(event, handler, true);
```

上面的代码片段将遵循与 true 时相同的顺序。关键区别在于，**事件处理程序将在向下冒泡到目标之前执行它找到的任何事件处理程序。**

## 访问事件对象属性

在处理程序使用的方法中访问事件对象属性的差异：

- `event.target`​：指的是触发事件的 DOM 元素
- `event.eventPhase`​：返回事件传播的当前阶段（捕获：1，目标：2，冒泡：3）
- `event.currentTarget`​：指的是处理事件的 DOM 元素

请注意，如果事件侦听器附加到父元素，但是事件传播被子元素停止，`event.currentTarget`​将指向停止传播的 DOM 元素。

## 事件冒泡结构

现在来了解事件冒泡和捕获的工作原理，让我们尝试一个例子！假设我们有以下DOM结构和相应的事件侦听器：

```html
<button class="cta_button">Click me</button>
```

```ts
document
  .querySelector(".cta_button")
  .addEventListener("click", function (event) {
    console.info(`Click event fired on ${this.nodeName}`);
  });
```

在控制台中将记录`Click event fired on BUTTON`​。

## 嵌套的 DOM 结构

在上面的代码片段中，我们在 `div`​ 上设置了一个点击事件侦听器，它是按钮的父元素。当点击时，它会记录触发的事件类型和它所触发的元素。

```html
<div class="cta_container">
  <button class="cta_button">Watch me bubble</button>
</div>
```

```ts
document
  .querySelector(".cta_container")
  .addEventListener("click", function (event) {
    console.info(`Click event fired on ${this.nodeName}`);
  });
```

当用户点击 “Watch me bubble” 按钮时，事件将被定向到按钮。如果为按钮设置了事件处理程序，则触发事件。否则，事件会冒泡或传播到父`div`​，并在父元素上触发点击事件。如果未处理事件，则该过程将继续到外边界的下一个父元素，直到最终到达文档对象。

尽管点击的是按钮，但记录到控制台的信息是 `Click event fired on DIV`​。

## 给按钮添加事件侦听器

当我们还为按钮附加一个事件侦听器时会发生什么呢？

```html
<div class="cta_container">
  <button class="cta_button">Watch me bubble</button>
</div>
```

```ts
document
  .querySelector(".cta_container")
  .addEventListener("click", function (event) {
    console.info(`Click event fired on ${this.nodeName}`);
  });
```

输出变为 `Click event fired on BUTTON`​ 和 `Click event fired on DIV`​。

正如例子所示，**事件冒泡到了父级**。可以使用 `event.bubbles`​ 属性来判断事件是否会冒泡：

```ts
document
  .querySelector(".cta_button")
  .addEventListener("click", function (event) {
    console.info(
      `Click event fired on ${this.nodeName}. Does it bubble? ${event.bubbles}`
    );
  });
```

## 停止事件传播

除非手动阻止，否则 DOM 元素上的事件会传播到其所有父元素。虽然通常不需要阻止冒泡，但在某些情况下可能会很有用。

例如，停止传播可以防止事件处理程序相互干扰。

考虑使用 `mousemove`​ 和 `mouseup`​ 事件处理拖放操作。通过阻止传播，可以防止由于用户随机移动鼠标而导致的浏览器错误。

```ts
document.querySelector(".cta_button").addEventListener("click", event => {
  event.stopPropagation();
  // ...
});
```

让我们停止上一个例子中点击按钮的冒泡：

```ts
<div class="cta_container">
  <button class="cta_button">Watch the bubble stop</button>
</div>
```

添加事件侦听器：

```ts
document
  .querySelector(".cta_container")
  .addEventListener("click", function (event) {
    console.info(`Click event fired on ${this.nodeName}`);
  });

document
  .querySelector(".cta_button")
  .addEventListener("click", function (event) {
    event.stopPropagation();
    console.info(`Click event fired on ${this.nodeName}`);
  });
```

通过 `event.stopPropagation()`​ 阻止了事件冒泡。输出变为 `Click event fired on BUTTON`​。

## 阻止浏览器默认行为

如果想允许事件继续传播，但在没有处理事件的侦听器的情况下，你希望阻止浏览器执行其默认操作。你可以使用 `event.preventDefault()`​：

```ts
document.querySelector(".cta_button").addEventListener("click", event => {
  event.preventDefault();
  // ...
});
```

在下面的代码片段中，我们列出了我们的购物物品：

```html
<ul class="list">
  <li class="item">MacBook Pro</li>
  <li class="item">Sony a6400 camera</li>
  <li class="item">Boya universal cardioid microphone</li>
  <li class="item">Light ring</li>
</ul>
```

添加一个附加到 `<ul>`​ 的事件侦听器：

```ts
document.querySelector(".list").addEventListener("click", function (event) {
  console.info(`${event.type} event fired on ${this.nodeName}`);
  event.target.classList.toggle("purchased");

  console.log("target:", event.target); // <li class="item purchased">
  console.log("currentTarget:", event.currentTarget); // <ul class="list">
  console.log("eventPhase:", event.eventPhase);
});
```

这个事件侦听器会在 `<ul>`​ 元素上监听点击事件，并使用 `event.target`​ 检查点击事件的目标元素。如果目标元素是 `<li>`​，它将切换 `purchased`​ 类，以便你可以标记或取消标记购物物品。

## 事件捕获结构

在事件委托期间，当不支持事件冒泡时，事件捕获对于附加到动态内容的事件特别有益。例如，需要处理像焦点和模糊之类的事件，对于这些事件，不支持冒泡。

要在捕获阶段捕获事件，需要将 `useCapture`​ 选项设置为 `true`​。默认情况下，它被设置为 `false`​：

```ts
element.addEventListener(event, handler, true);
```

假如有如下 DOM 结构：

```html
<div class="cta_container">
  <button class="cta_button">Watch me capture</button>
</div>
```

将父元素的 `useCapture`​ 选项设置为 `true`​：

```ts
document.querySelector(".cta_container").addEventListener(
  "click",
  function (event) {
    console.info(`Click event fired on ${this.nodeName}`);
  },
  true
);

document
  .querySelector(".cta_button")
  .addEventListener("click", function (event) {
    console.info(`Click event fired on ${this.nodeName}`);
  });
```

与使用冒泡时得到的结果相反，输出是 `Click event fired on DIV`​ 和 `Click event fired on BUTTON`​。

## 事件捕获用例

现在创建一个购物车，如果想要向购物清单中添加一个输入字段，使得这个购物车能够为每个项目设置预算，附加到父元素的事件监听器将不适用于那些输入字段。

让我们以购物清单的代码和一个事件监听器为例：

```html
<h1 class="title">Shopping List</h1>
<ul class="list">
  <li class="item">
    MacBook Pro
    <input class="budget" type="number" min="1" />
  </li>
  <li class="item">
    Logitech MX Keys
    <input class="budget" type="number" min="1" />
  </li>
  <li class="item">
    Sony a6400 camera
    <input class="budget" type="number" min="1" />
  </li>
  <li class="item">
    Boya universal cardioid microphone
    <input class="budget" type="number" min="1" />
  </li>
  <li class="item">
    Light ring
    <input class="budget" type="number" min="1" />
  </li>
</ul>
```

```ts
document.querySelector(".list").addEventListener("focus", function (event) {
  console.info(`${event.type} event fired on ${this.nodeName}`);
  event.target.style.background = "#eee";

  console.log("target:", event.target);
  console.log("currentTarget:", event.currentTarget);
  console.log("eventPhase:", event.eventPhase);
});
```

将光标焦点放在任何输入字段上时，什么都不会发生。然而，将 `useCapture`​ 选项设置为 `true`​ 时，将会获得所需的结果：

## 总结

冒泡总是从子元素传播到父元素，而捕获则从父元素传播到子元素。为了记住传播顺序，可以简单粗暴地理解为“冒泡上升到 document 和捕获下来到子元素”。

‍
