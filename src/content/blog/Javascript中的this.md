---
title: Javascript 中的 this
pubDatetime: 2019-08-10
description: Javascript 中的 this
featured: false
draft: false
tags:
  - JavaScript
---

## 用简单的故事了解 this 是什么

小明和小美是一对夫妻，他们住在芝麻街的 34 号，有一天小明或小美说：“这个房子太旧了，需要重新装修！”，可以发现这个 this 就代指小明和小美所住的家，也就是“芝麻街 34 号”的意思。

但假设今天呼叫 this 的人不是小明和小美，而是另外一个家庭，那么 this 会代表“另外一个家”，而不是“芝麻街 34 号”，在这个故事中的概念实际上与 JavaScript 的 this 一模一样！

## 使用 this

在 JavaScript 中可以使用 this 在全域以及函式执行环境中，此外 this 在严格模式下的表现也会有所不同。以下会举例四种使用情境。

其中直接在全域中使用 this 与在函式中使用 this 意义并不大(方法一、二)，知道就好。

### 一、在全域中使用 this

如果直接打印 this，那么用浏览器中执行就会是 window，在 node.js 中执行会是 global。

```ts
console.log(this === window); // true
```

### 二、在函式中使用 this

在非严格模式🔗下，this 会指向全局作用域，也就是 window 或 global，这是因为执行环境(比如说浏览器)认为你是在指 window.调用的函数。

```ts
function show() {
  console.log(this === window); // true
}
show();
```

但在严格模式下，this 会是 undefined，避免 this 莫名的存取到全域作用域，就算在嵌套的函数中也是一样。

```ts
"use strict";
function show() {
  console.log(this === undefined);
}
show();
```

### 三、在方法中使用 this

上学的小孩就叫做「学生」，在对象中的函数就被称作「方法」。如果调用了一个方法，那么 JavaScript 就会将 this 指向该方法所属的对象。

```ts
function sayName() {
  return `我的名字是： ${this.name}`;
}

const me = {
  name: "小明",
  sayName,
};

const you = {
  name: "小美",
  sayName,
};

me.sayName(); // 小明
you.sayName(); // 小美
```

### 四、在构造函数中使用 this

当使用 new 关键字串建一个新的对象时，那么 JavaScript 就会将 this 指向该方法所属的对象。

```ts
function Student(name) {
  this.name = name;
}

const student = new Student("小明");
console.log(student.name); // 小明
```

## 指定 this

前面提到 4 使用情境，但是有时候会需要手动指定 this 的值，这时候就可以使用 call()、apply()、bind() 三种方法。

## 总结

this 会如此让人混乱是因为它需要基于所在上下文（context）来判断，最简单的原则就是：谁调用 this，this 就代表谁。

## 参考资料

[What is THIS keyword in JavaScript? - Tutorial for beginners](https://www.youtube.com/watch?v=fVXp7ZWjlO4)

‍
