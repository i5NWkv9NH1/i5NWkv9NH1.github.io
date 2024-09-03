---
title: 用动图的方式了解 JavaScript 异步（一）
pubDatetime: 2023-07-10
tags:
  - JavaScript
---

## 了解异步 Javascript 背后是如何运行的

浏览器执行环境中的 JavaScript 是单线程的，也就是一次只能执行一件事，通常这不是什么问题，但假设目前有一个超级繁琐的事件（如对多媒体文件的操作）要处理 30 秒，或者去获取一个未知要多少时间的外部资源，这样一来其他事情就都会被搁置在后，让使用者等待。

这是非常大的问题，但解决方法也非常的简单：“不要呆呆站在那里等！”。

假设订了外卖，会乖乖的等到外卖员到家后吃饭，还是先做其他事情呢？想必是后者，那么同样的道理，各种不同的执行环境(runtime) 也提供了 JavaScript 自身并不存在的功能来处理非同步的操作，像是浏览器中有： Web API ，可以轻松创建非同步、避免事件阻塞的网页。

## 难懂的专业名词

### Call Stack：处理事情，就像在吃威化饼干一样

> 浏览器引擎将会在这里一行一行的解析执行函数，调用函数时就会被放入，并在回传值后离开。

回到 JavaScript 引擎本身，当调用一个函数时，函数会被加入到一个叫做：“Call Stack” 的 [STACK （堆栈）](https://zh.wikipedia.org/zh-tw/%E5%A0%86%E6%A0%88)之中，想像成吃饼干一样，饼干（函数）由最上方加入然后再由上方开始吃掉(处理)，代码由上而下执行将函数推入执行推栈中，当被执行完就会离开。

![callstack.gif](https://s2.loli.net/2024/02/25/XjN4ZpL3xfqk8cI.gif)​

### Web API：浏览器提供的异步助手

> 由执行环境 (Runtime) 提供，处理异步事件，并在事件结束后将回调函数放入 Callback Queue 中。

而处理异步事件很常遇到的：fetch、setTimeout、addEventListener 都是由 Web API 所提供的方法，使用这些方法传入的回调函数将会交由 Web API 处理，因此 Call Stack 才能迅速被清空，处理下一个事件，不阻塞 JavaScript 的执行。

![web-api.gif](https://s2.loli.net/2024/02/25/2PbeWinN9JAGXrl.gif)​

### Callback Queue：等待入场的队伍

> 存放回调函数，等待进入 Call Stack 中执行。

Web API 的事项处理完成后并不会马上返回 Call Stack 被执行，而是会被放入 Callback Queue 中等待。这样也造成了像是 setTimeout 或 setInterval 并不会「准确的」如同描述的时间内被执行，而是单纯在描述时间后会被加入 Callback Queue。

![callback-queue.gif](https://s2.loli.net/2024/02/25/nPo82f3vB7Cjy1K.gif)​

## Event Loop

> 直到 Call Stack 被清空，Event Loop 会将最早进入 Callback Queue 的函数放回 Call Stack 中。

那么 Callback Queue 中的任务要如何被执行呢？ 就轮到 Event Loop 出场的时候了，它只有也仅有一项功能：“连接 Callback Queue 与 Call Stack”。具体来说，当 Call Stack 是空的，第一个 Callback Queue 的任务就会被放入 Call Stack 中。

![event-loop.gif](https://s2.loli.net/2024/02/25/JY4GyADgeurqPxV.gif)​

## 結語

希望通过简单的动图，能够更直观快速地了解到异步 JavaScript 背后究竟发生了什么事。

![full.gif](https://s2.loli.net/2024/02/25/Nxu4G8EUws52aKI.gif)​

## 参考资料

- DEV - [JavaScript Visualized: Event Loop ](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)
- JSConf - [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ&list=WL)
- JSConf - [In The Loop - setTimeout, micro tasks, requestAnimationFrame, requestIdleCallback](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
- Loupe - [理解异步 JavaScript 背后的运作方式的图示。](http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)

‍
