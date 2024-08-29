---
title: 用 JavaScript 绘制数学曲线：打造动态布局
---

## 前言

假设你希望在网页中呈现一些动态元素，并按照某个数学函数来排列这些元素。比如，你想模拟正弦波、余弦波，或者绘制一个简单的抛物线。要实现这一点，我们可以创建一个 `Curve` 类，利用它来生成元素的排列，并通过 CSS 来控制元素的显示位置和样式。

## DOM 结构

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Curve Layout with XY Axes</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="curve-container"></div>
    <script src="script.js"></script>
</body>
</html>
```

## 绘制 XY 坐标系

```css
body, html {
    margin: 0;
    padding: 0;
    height: 100%;
}

.curve-container {
    position: relative;
    width: 100%;
    height: 100vh; /* 全屏高度 */
    background-color: #f0f0f0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: 
        linear-gradient(to right, #ccc 1px, transparent 1px),
        linear-gradient(to bottom, #ccc 1px, transparent 1px);
    background-size: 20px 20px; /* 网格背景 */
}

.curve-element {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%; /* 圆形元素 */
    transform: translate(-50%, -50%); /* 中心对齐元素 */
    left: calc(50% + var(--dx)); /* 以容器中心为基准，偏移 --dx */
    top: calc(50% - var(--dy)); /* 以容器中心为基准，偏移 --dy */
}

.axis {
    position: absolute;
    background-color: #333;
}

.axis.x {
    width: 100%;
    height: 2px;
    top: 50%;
    left: 0;
}

.axis.y {
    height: 100%;
    width: 2px;
    left: 50%;
    top: 0;
}
```

**背景网格**：`linear-gradient` 来绘制水平和垂直方向的网格线，这样可以在视觉上形成一个坐标轴的感觉。

**曲线元素**：每个曲线上的点都是一个 `.curve-element`，通过 `position: absolute` 使它们可以精确定位在 `curve-container` 内部。

**坐标轴**：添加了 `.axis` 类，通过 `background-color` 和位置设置，来模拟 `x` 和 `y` 坐标轴。

## 使用 `Math` 函数创建曲线

```ts
class Curve {
    constructor(func, xRange, yRange) {
        this.func = func; // 接收一个数学函数 func 和 x、y 的范围。func 可以是任何一个 Math 提供的函数，比如 Math.sin、Math.cos 等。
        this.xRange = xRange; // x轴的范围
        this.yRange = yRange; // y轴的范围
    }

    calculateY(x) {
        // 将 x 代入数学函数，计算出 y 值
        return this.func(x);
    }

    generateCurveElements(container, numberOfElements) {
        const dx = (this.xRange[1] - this.xRange[0]) / (numberOfElements - 1); // x增量
        for (let i = 0; i < numberOfElements; i++) {
            const x = this.xRange[0] + i * dx;
            const y = this.calculateY(x);

            // 创建元素并设置样式
            const element = document.createElement('div');
            element.classList.add('curve-element');
            element.style.setProperty('--dx', `${x * 20}px`); // 放大x坐标
            element.style.setProperty('--dy', `${y * 20}px`); // 放大y坐标

            container.appendChild(element);
        }
    }
}

// 示例：创建一个二次函数曲线
const quadraticCurve = new Curve(x => x * x, [-10, 10], [0, 100]);
const container = document.querySelector('.curve-container');

// 添加XY轴
const xAxis = document.createElement('div');
xAxis.classList.add('axis', 'x');
container.appendChild(xAxis);

const yAxis = document.createElement('div');
yAxis.classList.add('axis', 'y');
container.appendChild(yAxis);

// 生成曲线元素
quadraticCurve.generateCurveElements(container, 50); // 生成50个元素

```

## 应用不同的数学函数

- **正弦波**：`Math.sin`

```ts
const sinCurve = new Curve(Math.sin, [-10, 10], [-1, 1]);
sinCurve.generateCurveElements(container, 50);
```

- **余弦波**：`Math.cos`

```ts
const cosCurve = new Curve(Math.cos, [-10, 10], [-1, 1]);
cosCurve.generateCurveElements(container, 50);
```

- **指数函数**：`Math.exp`

```ts
const expCurve = new Curve(Math.exp, [0, 3], [1, 20]);
expCurve.generateCurveElements(container, 50);
```

- **对数函数**：`Math.log`

```ts
const logCurve = new Curve(Math.log, [1, 10], [0, 2.3]);
logCurve.generateCurveElements(container, 50);
```

- **常数函数（水平线）**

```ts
// 创建一个水平线
const horizontalLine = new Curve(x => 2, [-10, 10], [2, 2]);
horizontalLine.generateCurveElements(container, 50);
```

- **直线方程（交叉线）**

```ts
// 创建一个从左下到右上的交叉线
const crossLinePositive = new Curve(x => x, [-10, 10], [-10, 10]);
crossLinePositive.generateCurveElements(container, 50);

// 创建一个从左上到右下的交叉线
const crossLineNegative = new Curve(x => -x, [-10, 10], [-10, 10]);
crossLineNegative.generateCurveElements(container, 50);
```

- **组合正弦余弦（交叉波浪线）**

```ts
// 创建一个正弦波
const sineWave = new Curve(Math.sin, [-10, 10], [-1, 1]);
sineWave.generateCurveElements(container, 50);

// 创建一个余弦波（相位相差 π/2 的正弦波）
const cosineWave = new Curve(Math.cos, [-10, 10], [-1, 1]);
cosineWave.generateCurveElements(container, 50);
```

## 扩展（图像 image）

1.  HTML

```css
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Image Patterns</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="button-container">
        <button data-function="horizontal">水平线</button>
        <button data-function="cross-positive">交叉线正</button>
        <button data-function="cross-negative">交叉线负</button>
        <button data-function="sine">正弦波</button>
        <button data-function="cosine">余弦波</button>
        <button data-function="quadratic">抛物线</button>
    </div>
    <div class="curve-container"></div>
    <script src="script.js"></script>
</body>
</html>

```

2. CSS

```css
body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #f0f0f0; /* 更柔和的背景颜色 */
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 20px;
    background-color: #ffffff;
    border-bottom: 1px solid #ccc;
}

.button-container button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    transition: background-color 0.3s;
}

.button-container button:hover {
    background-color: #0056b3;
}

.curve-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 60px); /* 减去按钮容器的高度 */
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff; /* 背景颜色为白色 */
    border: 1px solid #ccc; /* 增加边框 */
    border-radius: 10px; /* 圆角边框 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
    transition: background-color 0.3s; /* 背景颜色过渡效果 */
}

.curve-element {
    position: absolute;
    width: 20px; /* 缩小图像的宽度 */
    height: 20px; /* 缩小图像的高度 */
    background-size: cover; /* 确保图像不被拉伸 */
    border: 2px solid #333; /* 图像边框颜色 */
    border-radius: 50%; /* 圆形边框 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* 图像阴影 */
    transform: translate(-50%, -50%); /* 中心对齐图像 */
    left: calc(50% + var(--dx));
    top: calc(50% - var(--dy));
    transition: left 0.5s, top 0.5s; /* 平滑过渡动画 */
}
```

3. JavaScript

```ts
class Curve {
    constructor(func, xRange, yRange, color = 'red') {
        this.func = func; // 数学函数
        this.xRange = xRange; // x轴的范围
        this.yRange = yRange; // y轴的范围
        this.color = color; // 图像路径或颜色
    }

    calculateY(x) {
        return this.func(x);
    }

    generateCurveElements(container, numberOfElements, imageUrl) {
        container.innerHTML = ''; // 清空容器内容

        const dx = (this.xRange[1] - this.xRange[0]) / (numberOfElements - 1);
        for (let i = 0; i < numberOfElements; i++) {
            const x = this.xRange[0] + i * dx;
            const y = this.calculateY(x);

            // 创建图像元素并设置样式
            const img = document.createElement('img');
            img.classList.add('curve-element');
            img.src = imageUrl; // 设置图像路径
            img.style.setProperty('--dx', `${x * 30}px`); // 放大x坐标以增加间距
            img.style.setProperty('--dy', `${y * 30}px`); // 放大y坐标以增加间距

            container.appendChild(img);
        }
    }
}

// 函数定义
const functions = {
    horizontal: x => 2,
    'cross-positive': x => x,
    'cross-negative': x => -x,
    sine: Math.sin,
    cosine: Math.cos,
    quadratic: x => x * x
};

// 初始化
const container = document.querySelector('.curve-container');
const imageUrl = 'https://picsum.photos/20'; // 使用较小的图像
let currentFunction = 'horizontal'; // 默认函数

// 添加XY轴
const xAxis = document.createElement('div');
xAxis.classList.add('axis', 'x');
container.appendChild(xAxis);

const yAxis = document.createElement('div');
yAxis.classList.add('axis', 'y');
container.appendChild(yAxis);

// 创建初始曲线
const curve = new Curve(functions[currentFunction], [-10, 10], [-10, 10]);
curve.generateCurveElements(container, 50, imageUrl);

// 处理按钮点击事件
document.querySelectorAll('.button-container button').forEach(button => {
    button.addEventListener('click', () => {
        const func = button.getAttribute('data-function');
        if (func !== currentFunction) {
            currentFunction = func;
            curve.func = functions[currentFunction];
            curve.generateCurveElements(container, 50, imageUrl);
        }
    });
});

```

