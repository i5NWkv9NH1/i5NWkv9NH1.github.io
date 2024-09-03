---
title: Proxy 和 DefineProperty 区别
pubDatetime: 2024-08-06
tags:
  - JavaScript
---

## 前言

![](https://s2.loli.net/2024/09/01/OHgIVLBXuhp72r3.png)

在 JavaScript 中，`Proxy` 和 `Object.defineProperty` 都用于控制对象的行为，但它们的用途和实现方式有很大的不同。

## Proxy

根据 MDN 的定义，`Proxy` 是能够拦截和重新定义对象的基本操作。什么是对象的基本操作，我们在开发中，会经常使用对象，然后对这个对象进行很多操作：

```ts
const obj = {};
obj.a;
obj.a = 3;
```

比方说，读取某个对象的属性或者修改对象的某个属性的值，这些操作都是在语法书写层面，是JavaScript为了让开发者书写起来更加便利的**语法糖！**！！。

但实际上通过对象字面量读取等操作都是通过间接 JavaScript 对象的内部方法。

```ts
const obj = {};
obj.a; // [[GET]]
obj.a = 3; // [[SET]]
delete ojb.a; // [[DELETE]]

//	[[OwnPropertyKeys]]
for (const key in obj) {
}
```

![](https://s2.loli.net/2024/09/01/rLqR3nwzGNlvAem.png)

根据 ES2015 的文档，我们可以看到很多操作，都是通过间接调用对对象内部的基本方法。

![image-20240901200721164](/Users/sora/Library/Application Support/typora-user-images/image-20240901200721164.png)

可以看到，如果对象是一个函数的话，它还多了两个基本操作，当你调用函数的时候，调用的基本操作是 `[[Call]]`，当调用一个构造函数的时候，运行的是 `[[Constrcture]]`。从另一个角度看，函数本身也是对象。

## 深入理解

根据 `Proxy handle Method` 表格，对象的每个基本操作都对应着一个 `internal Methods`，当通过代理去读取被代理的对象，应该运行的是内部基本操作[[GET]]，但运行的时就掉进了 `handler` 里去，被 `handler` 拦截了。

```ts
const p = new Proxy((), {
  get(target, key) {
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    return true
  }
})

p.a	// [[GET]]
```

所以，当我们调用被代理的对象时，被代理对象的内部基本操作 `[[GET]]` 不会被调用，反而被 Proxy 的 `get` 方法拦截。`Proxy` 对象特点具体有：

1. **拦截广泛**：`Proxy` 可以拦截几乎所有对对象的基本操作，包括属性的读取、赋值、删除、枚举等。
2. **灵活性**：你可以定义自己的拦截器来处理各种操作，从而实现自定义的行为。
3. **适用范围**：适用于任何对象类型，包括普通对象、数组、函数等。

## DefineProperty

而 DefineProperty 它本身是一个对象的内部基本操作，如果通过 DefineOwnProperty 这个 `internal handle` 的话，很多东西都是拦截不到的，比如说读取原型等。具体有：

1. **限制性**：`Object.defineProperty` 只能定义或修改单个属性，无法拦截其他操作（如读取原型、数组方法等）。
2. **静态**：定义的 getter 和 setter 仅适用于指定的属性，无法处理对象上的其他操作。
3. **适用范围**：主要用于对象属性的定义和修改，适合用于需要精细控制属性行为的场景。

正因为 `DefineOwnProperty` 有局限性（尤其是数组的操作方法），似乎 Vue.js@2 对数组的原型链方法进行重写。

最后看一个代理数组的例子：

```ts
const arr = [1, 2, 3];

const p = new Proxy(arr, {
  get(target, key) {
    console.log("get", key);
    return target[key];
  },
  set(target, key, value) {
    console.log("set", key, value);
    target[key] = value;
    return true;
  },
});
p.push(1);
```

![](https://s2.loli.net/2024/09/01/bETRNmyzwJfQlr1.png)
