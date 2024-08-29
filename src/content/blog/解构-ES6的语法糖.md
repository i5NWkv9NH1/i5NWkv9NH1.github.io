---
title: 解构 - ES6 的语法糖
pubDatetime: 2021-04-03
description: 解构 - ES6 的语法糖
featured: false
draft: false
---

## 什么是解构？

![ezgif-5-bb7e6d6c01.gif](https://s2.loli.net/2024/02/25/6XetYl7QFc8zMLy.gif)​

解构是一种创建新变量的语法糖，可以快速提取当前数组或对象的数据，并且可以重新命名提取的数据，使代码更简洁。实际上，非常简单，通过几个实际例子就能发现它的用途很多且很易懂。

## 实际案例

### 野餐时间

假设你有一个数组 `basket`，里面放了三样东西：🍎、🥪 和 🧃。如果你只想从中提取出苹果和三明治，可以这样写：

```ts
const basket = ["🍎", "🥪", "🧃"];
const [apple, sandwich] = basket;

console.log(apple, sandwich);
// 🍎 🥪
```

在这里，`apple` 和 `sandwich` 就是从 `basket` 数组中取出的第一个和第二个元素。你可以自己定义这些名字。

### 跳过数据

如果你只想提取 `apple` 和 `juice`，而不需要 `sandwich`，可以这样写：

```ts
const basket = ["🍎", "🥪", "🧃"];
const [apple, , juice] = basket;

console.log(apple, juice);
// 🍎 🧃
```

## 实战练习

### 观察一：解构参数

假设你一个 `sayHappyBirthday` 函数，它接收一个包含 `name` 和 `age` 的对象。如果你用解构来提取这两个属性，代码会更简洁：

```ts
function sayHappyBirthday({ name, age }) {
  return `生日快乐 ${name}！ 你现在是 ${age} 岁了!`;
}
```

### 观察二： 解构返回值

最常会用到解构的地方是在 React 与许多类似的框架中，比如 `useState`​ 它会返回一个数组，第一个元素是当前的状态，第二个元素是可以改变状态的函数，所以很常会这样写，看起来很像魔法但就只是把函数返回的数组解构命名而已：

```ts
const [count, setCount] = useState(0);

function useState(initialState) {
  // ...
  return [state, setState];
}
```

## 总结

在之前的写法中，我们通常会这样写：

```ts
const basket = ["🍎", "🥪", "🧃"];
const apple = basket[0];
const sandwich = basket[1];
const juice = basket[2];
```

现在用解构语法，可以让代码更简洁。快去试试吧。
