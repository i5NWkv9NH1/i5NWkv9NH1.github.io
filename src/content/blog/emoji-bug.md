---
​---
title: Emoji 字符串截取导致的 BUG
---

## 前言

在 JavaScript 中处理包含 emoji 的字符串时，我们经常会遇到一些看似奇怪的问题。来看下面的例子：

```ts
const emoji = '🐶🐱🐭🐹'
console.log(emoji.length) // 10
console.log(emoji[0]) // �
console.log(emoji.slice(1, 3)); // ��
```

这个例子中，`emoji` 字符串包含 5 个表情符号，但打印出来的长度却是 10。当我们打印字符串的第一个字符时，返回的是一个无法显示的符号“�”。同样地，截取字符串的第二到第三个位置时，输出也是两个无法显示的符号“��”。为什么会这样呢？

![Emoji string](https://s2.loli.net/2024/08/27/BRMwEFdkWu9aIoq.png)

## 原因分析

### 计算机是如何存储字符串的

计算机不能直接存储文字，它只能存储数字。每个字符都有一个对应的数字，这个过程叫做**编码**。例如，字母 'a' 被编码为数字 97。类似地，每个 emoji 也对应一个数字。在计算机里，这些数字以二进制形式存储。

### Code Unit 和 Code Point

- **Code Point（码点）**：这是 Unicode 标准中为每个字符分配的唯一编码。例如，笑脸表情符号“😀”的码点是 `U+1F600`。码点是一个抽象的数字，表示字符的实际意义。
- **Code Unit（编码单元）**：这是用于存储字符的实际单位。
  - JavaScript 使用 UTF-16 编码，每个码元占用 16 位（2 字节）。一个字符可能由一个或两个码元组成。
  - 在 UTF-16 中，基本字符（如英文字母）由一个码元表示，而更复杂的字符（如 emoji 或生僻字）通常需要两个码元。

### 为什么会出现长度为 10？

在 JavaScript 中，`emoji.length` 返回的是 Code Unit（码元）的数量，而不是字符的数量。每个 emoji 使用两个码元，因此 5 个 emoji 总共占用 10 个码元。这就是为什么 `emoji.length` 返回 10 而不是 5。

![Code Unit](https://s2.loli.net/2024/08/27/9IXiBbs5Shw8Uld.png)

如图所示，一个 emoji 文字占两个码元，总共就10个码元。所以，在 JavaScript 里面打印出来的长度则是10.

### 为什么会显示 “�” 符号？

当你尝试访问 `emoji[0]` 时，只能获取到一个码元（16 位），这只是一个完整 emoji 表情的一半。UTF-16 使用两个码元来表示一个完整的 emoji 表情（代理对）。单独的高位或低位代理无法组成一个有效的字符，结果是显示一个无法识别的符号“�”。

同样，`emoji.slice(1, 3)` 只截取了部分代理对的内容，因此输出也是“��”。这些符号表示代理对的高位和低位单元，但它们并未组合成完整的字符。

## 如何正确处理 emoji？

1. **使用 `Array.from()`**：这个方法将字符串转换为数组，并自动识别代理对，从而正确处理每个 emoji。

```ts
const emoji = '🐶🐱🐭🐹🐰';
const charArray = Array.from(emoji);
console.log(charArray.length); // 5
console.log(charArray[0]); // 🐶
console.log(charArray.slice(1, 3)); // ["🐱", "🐭"]
```

![Code](https://s2.loli.net/2024/08/27/NlQGre4PobWSOnK.png)

2. **使用 `for...of` 循环**：这种循环能够按字符（而非编码单元）遍历字符串，因此在处理包含 emoji 的字符串时效果很好。

```ts
const emoji = '🐶🐱🐭🐹🐰';
for (const char of emoji) {
    console.log(char); // 依次打印每个 emoji
}
```

