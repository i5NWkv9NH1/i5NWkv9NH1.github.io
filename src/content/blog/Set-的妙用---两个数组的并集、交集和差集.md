---
title: Set 的妙用 - 两个数组的并集、交集和差集
---

## 什么是 Set 对象

`Set` 是一种新的数据结构，类似于数组，但它不允许重复的值。利用 `Set`，我们可以很容易地进行集合运算。接下来，我们就用 `Set` 来解决一些常见的问题。

## 交集（Intersection）

**交集**就是两个数组中都存在的元素。比如说，数组 `[1, 2, 3, 4]` 和 `[3, 4, 5, 6]` 的交集是 `[3, 4]`。

代码示例：

```ts
function intersection(arr1, arr2) {
  const set1 = new Set(arr1); // 创建第一个数组的 Set
  const set2 = new Set(arr2); // 创建第二个数组的 Set
  const result = [...set1].filter(item => set2.has(item)); // 过滤出两个 Set 的交集
  return result; // 返回结果
}

// 示例
const array1 = [1, 2, 3, 4];
const array2 = [3, 4, 5, 6];
console.log(intersection(array1, array2)); // 输出: [3, 4]
```

![Intersection](https://s2.loli.net/2024/08/27/v2rBZdC14W8TFui.png)

## 并集 (Union)

**并集**是两个数组中的所有元素，不重复的部分。比如，数组 `[1, 2, 3]` 和 `[3, 4, 5]` 的并集是 `[1, 2, 3, 4, 5]`。

代码示例：

```ts
function union(arr1, arr2) {
  const set1 = new Set(arr1); // 创建第一个数组的 Set
  const set2 = new Set(arr2); // 创建第二个数组的 Set
  const result = [...set1, ...set2]; // 合并两个数组
  return [...new Set(result)]; // 去重并返回结果
}

// 示例
const array1 = [1, 2, 3];
const array2 = [3, 4, 5];
console.log(union(array1, array2)); // 输出: [1, 2, 3, 4, 5]
```

![Union](https://s2.loli.net/2024/08/27/9PYovmcltfTibz5.png)

## 差集 (Difference)

**差集**是存在于第一个数组中但不在第二个数组中的元素。比如，数组 `[1, 2, 3, 4]` 和 `[3, 4, 5, 6]` 的差集是 `[1, 2]`。

代码示例：

```ts
function difference(arr1, arr2) {
  const set1 = new Set(arr1); // 创建第一个数组的 Set
  const set2 = new Set(arr2); // 创建第二个数组的 Set
  const result = [...set1].filter(item => !set2.has(item)); // 过滤出只在第一个数组存在的元素
  return result; // 返回结果
}

// 示例
const array1 = [1, 2, 3, 4];
const array2 = [3, 4, 5, 6];
console.log(difference(array1, array2)); // 输出: [1, 2]
```

![Difference](https://s2.loli.net/2024/08/27/YIw4rZPxMGgHtfc.png)

