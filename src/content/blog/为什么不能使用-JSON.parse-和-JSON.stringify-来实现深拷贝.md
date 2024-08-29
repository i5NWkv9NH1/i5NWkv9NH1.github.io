---
title: 为什么不能使用 JSON.parse 和 JSON.stringify 来实现深拷贝
---

## 前言

在 JavaScript 中，深拷贝就是把一个对象及其所有子对象完整地复制一份。这听起来很简单，但在实际操作中却隐藏着一些坑。许多人习惯用 `JSON.parse` 和 `JSON.stringify` 这两个方法来实现深拷贝，因为它们很方便。然而，这种方法有一个大问题：**处理不了循环引用**。

## 示例分析

假设我们有一个对象 `obj`：

```ts
const obj = {
  arr: [1, 2, 3],
  a: 4
};
obj.sub = obj;  // obj 的 sub 属性指向它自己
obj.arr.push(obj);  // obj 自己也被添加到了 arr 数组里
```

在这个例子中，`obj` 里面形成了循环引用。也就是说，`obj` 的 `sub` 属性指向 `obj` 本身，并且 `obj` 也在 `arr` 数组中。这种情况下，如果你尝试用 `JSON.parse` 和 `JSON.stringify` 来深拷贝这个对象，问题就来了。

## 为什么 JSON 方法不能处理这种情况？

`JSON.parse` 和 `JSON.stringify` 方法看起来很简单，但它们不能处理对象中的循环引用。具体来说：

1. **`JSON.stringify`**：这个方法把对象转换成一个 JSON 字符串。然而，如果对象中有循环引用（也就是说，它的某个属性指向了对象本身或形成了一个环），`JSON.stringify` 会出错。因为 JSON 这种格式不能表示这种循环结构。你会得到一个错误，比如：

```ts
// 尝试 stringify，会抛出错误
JSON.stringify(obj); // 会报错

```

![](https://s2.loli.net/2024/08/27/3u8ZAkplgVWaLSJ.png)

2. **`JSON.parse`**：这个方法是把 JSON 字符串转换回 JavaScript 对象。如果字符串本身有问题（比如由 `JSON.stringify` 出错），`JSON.parse` 也会出错。

## 常见的做法

```ts
function deepClone(value) {
  // 首先判断它是不是原始值
  if (value === null || typeof value !== 'object') {
    return value
  }
  
  // 当成对象统一处理，如果是数组的话就准备一个数组，如果是一个对象的话就准备一个对象。
  const result = Array.isArray(value) ? [] : {}
  
  // 把每个属性都来进行递归深度克隆
  for(let key in value) {
    // 这里排出掉原型上的东西
    if (value.hasOwnProperty(key)) {
      result[key] = deepClone(value[key])
    }
  }
  
  return result
}
```

上面的函数是正统的做法，虽然可以进行深拷贝，但还是无法解决循环引用的问题，因为当你运行之后，就会看到它无限递归。

![](https://s2.loli.net/2024/08/27/1GcbYyzKF94EUBJ.png)

## 解决方案

要解决循环引用的问题，我们可以使用 **Map**。通过每个对象及其克隆版本的映射关系，可以避免重复拷贝和无限递归。为此，我们使用 `WeakMap` 来实现，它能够有效地缓存对象并且不会阻止垃圾回收。

### 为什么使用 WeakMap？

在深拷贝操作中，为了处理对象的循环引用，我们可以使用 `WeakMap` 来缓存已经拷贝过的对象。这是因为 `WeakMap` 中的键是弱引用的，当这些对象没有其他引用时，垃圾回收机制可以自动回收这些对象，避免了内存泄漏的问题。相比之下，`Map` 中的键是强引用的，只要 `Map` 持有对象的引用，这些对象就不会被回收，这可能会导致内存泄漏。因此，在处理循环引用或临时缓存时，`WeakMap` 是更合适的选择。使用 `WeakMap` 可以确保对象在不再使用时能够被自动清理，从而提高内存管理的效率，避免在复杂对象结构中的内存问题。

### 代码示例

在深拷贝的实现中，我们通过在函数内部维护一个 `WeakMap` 来存储已经克隆过的对象及其副本。当我们递归地克隆对象时，首先检查这个 `WeakMap`，如果对象已经存在于缓存中，我们直接返回缓存的副本，避免了重复克隆和无限递归。这个方法不仅解决了循环引用的问题，还使得深拷贝操作更加高效。

在深拷贝实现中创建一个内部函数 `_deepClone`，主要是为了利用闭包特性，确保缓存对象（如 `WeakMap`）的作用域仅限于当前 `deepClone` 调用。这样可以避免全局污染，同时使得每次深拷贝操作都有自己独立的缓存，避免了多个深拷贝操作之间的相互干扰。此外，分离逻辑使代码更具模块化和可读性，便于维护和理解。

```ts
function deepClone(value) {
  const cache = new WeakMap()
  function _deepclone(value) {
    if (value === null || typeof value !== 'object') {
    	return value
  	}
  	if (cache.has(value)) {
      return cache.get(value)
    }
    const result = Array.isArray(value) ? [] : {}
    cache.set(value, result)
    for(let key in value) {
      if (value.hasOwnProperty(key)) {
        result[key] = _deepclone(value[key])
      }
    }
    
    return result
  }
  
  return _deepclone(value)
}
```

```ts
const newObj = deepClone(obj)
console.log(newObj.arr !== obj.arr)	// true
console.log(newObj.sub !== obj.sub)	// true
console.log(newObj.arr[3] !== obj)	// true
console.log(newObj.arr[3] === newObj) // true
```

![result](https://s2.loli.net/2024/08/27/kJXSyYL9or5qHgv.png)