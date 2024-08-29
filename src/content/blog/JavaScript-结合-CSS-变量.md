---
title: JavaScript 结合 CSS 变量
---

## 前言

![](https://s2.loli.net/2024/08/28/qpBNve6OJzRxmMg.gif)

你有没有遇到过这种情况？ 比如现在有一个简单的小球在页面上水平移动，我们想要让小球移动的距离刚好等于它的父元素宽度减去小球本身的宽度。这看起来挺简单的，对吧？但问题来了：在纯 CSS 里，我们没法直接拿到小球父元素的宽度，也就没法用 CSS 直接计算出小球该移动多远。🤔

好在我们可以借助 CSS 变量，配合 JavaScript 来轻松解决这个问题。

```css
transform: translateX(cacl(父元素的宽度 - 100%))
```

## 示例代码

```css
.container {
  width: 80%; /* 父元素的宽度为窗口宽度的80% */
  height: 300px;
  border: 3px solid #aaa;
  position: relative;
  margin: 0 auto; /* 居中显示 */
}

.ball {
  width: 100px; /* 小球的宽度 */
  height: 100px; 
  border-radius: 50%; /* 圆形小球 */
  background: #f40; /* 小球的颜色 */
  left: 0;
  top: 30px;
  position: absolute; /* 绝对定位 */
}
```

```js
const container = document.querySelector('.container'); // 获取父元素
const w = container.clientWidth; // 获取父元素的宽度

// 设置 CSS 变量 --w，值为父元素的宽度
container.style.setProperty('--w', w + 'px');
```

这样，在父元素里就新增了一个 css 变量值。

![](https://s2.loli.net/2024/08/28/l4e9G6StuMVEHDY.png)

现在，有了一个 `--w` 变量来存储父元素的宽度。我们可以使用这个变量来定义小球的水平移动动画。

```css
@keyframes move {
  50% {
    transform: translateX(calc(var(--w) - 100%)); /* 移动的距离为父元素宽度减去小球宽度 */
  }
}

.ball {
  animation: move 2s infinite; /* 添加动画 */
}
```

## 让动画响应窗口尺寸变化

虽然上面的代码已经可以让小球动起来了，但如果我们调整窗口大小，小球的移动距离就不会自动调整了。为了让它更加灵活，我们可以监听窗口尺寸变化，并重新计算 CSS 变量的值。

```
const updateWidth = () => {
  const w = container.clientWidth;
  container.style.setProperty('--w', w + 'px');
};

window.addEventListener('resize', updateWidth); // 监听窗口大小变化
updateWidth(); // 初始化时也更新一次
```

通过监听 `resize` 事件，每当窗口大小变化时，我们都重新计算父元素的宽度并更新 CSS 变量，这样小球的移动就始终正确。