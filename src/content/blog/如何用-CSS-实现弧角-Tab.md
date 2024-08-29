---
title: 如何用 CSS 实现弧角 Tab
---

![](https://s2.loli.net/2024/08/28/yjaQbUfk9tBTcuV.png)

首先，我们准备好一个元素，把元素的左上角和右上角设置为圆角：

```css
.tab {
  width: 150px;
  height: 40px;
  margin: 0 auto;
  background: #ed6a5e;
  border-radius: 10px 10px 0 0;
}
```

![](https://s2.loli.net/2024/08/28/uHRNd3DIn17XAlW.png)

然后我们可以使用伪类在 tab 的左下角和右下角去拼接一个弧形：

```css
.tab {
  position: relative;
}
.tab::before, .tab::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  bottom: 0;
  background: #000;
}
.tab::before {
  left: -10px;
}
.tab::after {
  right: -10px;
}
```

![](https://s2.loli.net/2024/08/28/JiYB1ZOfr6QgVuo.png)

接下来，让我们使用渐变将这两个元素做成一个弧形的效果：

```css
.tab::before {
  // 将渐变的圆心设置为左上角
  // 元素从左上角10个像素范围的透明开始，变成背景颜色。
  background: radial-gradient(
  	circle at 0 0, 
    transparent 10px, 
    #ed6a5e 10px
  );
}
.tab::after {
  right: -10px;
  background: radial-gradient(
    circle at 100% 0,
    transparent 10px,
    #ed6a5e 10px
  );
}
```

![](https://s2.loli.net/2024/08/28/f6YBUC15uhPbI3o.png)

接着，让我们使用 `transform` 来旋转整个元素：

```css
.tab {
  transform: rotateX(0deg);
}
```

但是，会发现并没有立体的效果。

![](https://s2.loli.net/2024/08/28/kxHLW42gydN7Mme.gif)

为此，我们需要添加一个 `perspective` 值，让 tab 能够进行立体翻转。

```css
.tab {
  transform: perspective(30px) rotateX(180deg);
}
```

![](https://s2.loli.net/2024/08/28/KSIruNzJX2FpkcT.gif)

但是，还没有达到理想的效果，因为它是沿着元素的中心点来水平旋转的，而我们希望能够以底边为中心进行旋转，于是我们通过 `transform-origin` 来修改 tab 的旋转水平位置是中心点，而竖直方向是底边：

```css
.tab {
  transform-origin: center bottom;
}
```

![](https://s2.loli.net/2024/08/28/JryjUR9x7gFTODm.png)

