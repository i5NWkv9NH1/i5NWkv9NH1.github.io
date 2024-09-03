---
title: JavaScript 闭包是什么
pubDatetime: 2024-07-19
tags:
  - JavaScript
---

## 从头说起

> 闭包可以让你在函数内获取函数外作用域的变量

但这么说很难理解，什么是作用域？为了更好地了解闭包，让我们从头说起。通常在函数内会使用两种方法来使用变量：

- 方法 A：将变量作为参数传入函数内
- 方法 B：定义一个变量在函数内

```ts
// 方法 A
function add(a, b) {
  return a + b;
}

// 方法 B
function sayHello() {
  const greeting = "Hello";
  return greeting;
}
```

但如果函数外想要访问函数内的变量是不行的，这是因为函数会创建一个新的作用域，让变量只能在函数内使用。

```ts
function sayHello() {
  const greeting = "Hello";
  return greeting;
}

console.log(greeting); // ReferenceError: greeting is not defined
```

但如果直接使用函数以外的变量会发生什么事？是可行的！这是因为前面提到的：“闭包可以让你在函数内获取函数外作用域的变量”，闭包只是一种形容这样特性的词汇，实际牵扯到 JavaScript 的作用域与底层的运作方式，才造就了闭包这种特性。

```ts
const greeting = "Hello";
function sayHello() {
  return greeting;
}

console.log(sayHello()); // 仍然可以打印出 Hello
```

![image.png](https://s2.loli.net/2024/02/25/t6Ep39kKjAODV7F.png)​

## 什么时候该使用闭包？

> 函数以外的作用域会持续存在，即使函数已经执行完毕。

闭包要求更多的内存空间与运算，因此最好在真正需要的时候才使用这一特性，大多时候会用于以下几个情况：

### 形成私有变量

闭包可以让函数内的变量不会被外部函数所访问，因此可以用来形成私有变量。

```ts
function makeCounter() {
  let count = 0; // 外部无法访问到该变量

  return function () {
    return (count += 1);
  };
}

const counter = makeCounter();

console.log(counter()); // 1
```

### 模块化

闭包可以用来配合工厂模式，模块化代码，保存状态。

```ts
function makeCounter() {
  let count = 0;

  return function () {
    return (count += 1);
  };
}

const counterA = makeCounter();
const counterB = makeCounter();

console.log(counterA()); // 1
console.log(counterA()); // 2

console.log(counterB()); // 1
console.log(counterB()); // 2
```

## 参考资料

- [闭包 - MDN](https://developer.mozilla.org/docs/Web/JavaScript/Closures)
- [JavaScript Closures Tutorial - ColorCode](https://www.youtube.com/watch?v=aHrvi2zTlaU)
