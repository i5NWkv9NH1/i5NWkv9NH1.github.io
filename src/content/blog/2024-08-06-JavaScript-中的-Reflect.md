---
title: JavaScript 中的 Reflect
pubDatetime: 2024-08-06
tags:
  - JavaScript
---

## 前言

在 ES6 规范中，JavaScript 引入了一个新对象：`Reflect`。它是干嘛的呢？简单来说，就是让我们可以直接调用对象的底层操作。就好比开车，有的人喜欢直接开车，有的人喜欢摸摸方向盘，检查一下油量，`Reflect` 就是那种直接开车的人——不绕弯子，直来直去。

## 简单的例子

假设我们现在有一个对象：

```ts
const obj = {};
obj.a = 1;
```

当我们写 `obj.a = 1` 这种赋值操作时，其实 JavaScript 在内部做了很多事，比如它会调用一个叫 `[[Set]]` 的内部方法来给对象设置属性。同样的道理，当你读取 `obj.a` 的时候，它其实是调用了另一个叫 `[[Get]]` 的内部方法。

也就是说，我们在语法书写层面的代码的时候，是一种**间接的调用内部方法**，是一种语法糖。

如果我们用 `Reflect` 来做这件事呢？它就帮我们绕开那些繁琐的表面操作，直接调用这些内部方法。比如说，给对象 `obj` 设置属性 `a` 的值，用 `Reflect` 来写就是：

一个例子，当我们要给对象 `obj` 设置属性 `a` 的值的时候：

```ts
const obj = {};
Reflect.set(obj, a, 2);
```

是不是很直接？这就像是直接在对象身上动刀子，而不是通过语法糖来操作它。

## Reflect 意义

用正常的语法（比如 `obj.key = value`）来操作对象属性时，JavaScript 其实不仅仅是在调用 `[[Set]]` 或者 `[[Get]]` 方法，它还会做一些额外的事情，比如检查对象是否可写、触发一些代理或者拦截器啥的。而用 `Reflect` 呢？就好比跟一个直肠子的人说话，不搞那些弯弯绕，直接告诉你我想要什么。

可以这么理解：用 `Reflect` 就是把中间商给“砍”了，省去了不必要的流程。

![](https://s2.loli.net/2024/09/01/mUNroicYOZX2fWK.png)

可以简单粗暴地理解为，通过 `object.key = value` 这种方式间接地去给属性赋值的话，那么在操作过程中除了调用基本方法 `Set` 会产生一些额外的步骤，而直接使用 `Reflect` 那么就不存在 “中间商”。

## 深入理解

```ts
const obj = {
  a: 1,
  b: 2,
  get c() {
    return this.a + this.b;
  },
};
```

在这个对象里，我们有一个 `c` 属性，它是通过 `get` 方法定义的。这个 `get` 方法看起来就像一个普通的属性访问，但实际上，每次访问 `obj.c` 的时候，都会调用一个内部的 `[[Get]]` 方法，这个方法还有个参数叫 `receiver`，负责决定 `this` 的指向。

![](https://s2.loli.net/2024/09/01/7kJUHIVMRTuqPBp.png)

根据文档，你会发现 GET 接收两个参数，最后一个参数 recveiver 接收一个 `this` 指向。当我们在读取对象的属性值的时候：

```ts
console.log(obj.c);
```

属性c的值是一个函数，那么这个函数里边的 `this` 指向谁是由内部方法里的 `[[get]]` 的第二个参数 `receiver`来决定的。

```ts
const obj = {
  get c() {
    return this......
  }
}
```

在整个语句中，我们只是简单地使用了 `console.log(obj.c)` 来打印对象属性的值。这里，属性 `c` 是通过 getter 方法定义的，这个 getter 方法是在语法层面上直接定义的，我们没有在调用时显式地指定 `this`。那么，这个 getter 方法中的 `this` 究竟指向谁呢？

当我们通过对象字面量直接定义 getter 方法时，JavaScript 默认会将当前对象 `obj` 作为 `this` 来处理。这意味着 `this` 会自动指向 `obj`，然后再调用内部的 `[[Get]]` 方法。

```ts
obj[[GET]]("c", obj);
```

没有通过显式的传递 `this`，那么内部方法就会将对象上下文作为默认的指向，对象属性的各个方法调用到 `this` 时，就会返回自身对象的上下文。

## 改动 this 指向

那么，我们可以改动 `this` 的指向吗？当然可以，`Reflect` 就是为此而生的，不通过对象字面量而是直接使用 `Reflect` 来调用对象的基本方法，我们可以将 `receiver` （自定义 this 的指向）传递给它。

```ts
const obj = {
  a: 1,
  b: 2,
  get c() {
    return this.a + this.b;
  },
};
```

```ts
const stuff = Reflect.get(obj, c, { a: 3, b: 4 });
console.log(stuff);
```

![](https://s2.loli.net/2024/09/01/XMlKDU7kdpzGi9c.png)

可以看到，我们修改了方法c 中的 `this` 指向，现在 `this` 指向新的对象上下文，而不是 `obj` 上下文。

## 实践

假如我们在做代理对象的时候，用 `Reflect` 来确保 `this` 的指向正确：

```ts
const obj = {
  a: 1,
  b; 2,
  get c() {
    return this.a + this.b
  }
}

const proxy = new Proxy(obj, {
  get(target, key) {
    console.log('read', key)
    return target[key]
  }
})

proxy.c
```

我们在这里定义了一个 `Proxy`，拦截 `obj` 对象，当我们读取方法 `c` 的时候，按理说不仅读了方法 `c`，方法 `c` 在运行过程中又会读取到属性 `a` 和属性 `b`，那么就应该是依次打印c、a、b。

![](https://s2.loli.net/2024/09/01/nYWvFaIZgKbhX5t.png)

可以看到，方法 c 并没有读取到自身对象的属性 a 和属性 b。为什么？

把我们的眼光聚焦到 Proxy 中，我们在 get 方法里返回了 `target[key]` ，那么当我们调用 `proxy.c` 的时候，实际上返回的是原始对象的方法 c，方法c里的 `this` 会指向 `target` 上下文，那么方法 c 读取到 `target` 上下文发现没有属性 a 和属性 b，那么就看不到方法 c 返回的值了。

### 解决方案

我们希望的是，当使用 `target` 返回代理对象的属性和方法时，应该把 `this` 指向被代理对象（obj）的上下文而不是 `target`。

```ts
const proxy = new Proxy(obj, {
  get(target, key) {
    return Reflect.get(target, key, proxy);
  },
});
```

这样一来，每次访问 `proxy.c` 时，不仅能拿到正确的 `this`，还能拦截并打印出哪些属性被读取了。

## 参考资料

- [ES2015](https://ecma-international.org/wp-content/uploads/ECMA-262_6th_edition_june_2015.pdf)
- [Proxy和definePrperty]()
