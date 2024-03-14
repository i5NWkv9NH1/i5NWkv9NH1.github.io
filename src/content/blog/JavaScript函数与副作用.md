---
title: JavaScript 函数与副作用
pubDatetime: 2019-08-05
description: JavaScript 函数与副作用
featured: false
draft: false
tags:
  - JavaScript
---

JavaScript里的纯函数和副作用是什么鬼？ 纯函数和副作用是函数式编程里很常见的概念，而在 JavaScript 中也被广泛使用。咱们来了解一下。

一个函数可以接受零个或多个输入，并产生一个输出。你可以明确地从函数中返回输出，或者它只是返回一个未定义的值。一个明确返回值的函数如下所示：

```ts
function testMe(input) {
  return `testing ${input}`;
}

// Invoke the function
testMe(123); // returns 'testing 123'
```

```ts
function testMe() {
  // 该函数无返回值
}
testMe(); // returns undefined
```

好的，让我们深入了解今天的主题：纯函数 (Pure Function)。还会揭开副作用 (Side Effect) 的概念，以及它们对纯函数的影响。

## 纯函数和副作用及其示例

作为一个开发者，写代码都是根据函数的输入以此来产生输出。通常，你编写函数来执行基于输入的任务并生成输出。我们需要确保这些函数具备以下特点：

- 可预测性：对于相同的输入，它产生可预测的输出。
- 可读性：任何阅读该函数的人都能完全理解其目的。
- 可重用性：可以在代码的多个地方复用该函数，而不会改变它和调用者的行为。
- 可测试性：我们可以将其作为单元进行测试。

纯函数具有以上所有特征。它是一个对于相同输入产生相同输出的函数。这意味着当你传递相同的参数时，它会返回相同的结果。纯函数不应该有任何副作用来改变预期的输出。

下面的 `sayGreeting()`​ 函数是一个纯函数。你能猜到为什么吗？

```ts
function sayGreeting(name) {
  return `Hello ${name}`;
}
```

没错，它是一个纯函数，因为无论传入什么 `<name>`​，你总是会得到一个 Hello `<name>`​ 的输出。现在，让我们看看稍微改变了一点的相同函数。

```ts
let greeting = "Hello";

function sayGreeting(name) {
  return `${greeting} ${name}`;
}
```

是一个纯函数吗？嗯，不是。这个函数的输出现在依赖于一个称为 greeting 的外部状态。如果有人将 greeting 变量的值更改为 "Hola" 会怎么样？它将改变 sayGreeting() 函数的输出，即使你传递相同的输入。

```ts
sayGreeting("sora"); // return `Hello sora`

// When greeting is "Hola"
sayGreeting("sora"); // return `Halo sora`
```

因此，**我们在这里看到了：依赖于可能在函数不知情的情况下更改的外部状态值的副作用。**

一些更经典的副作用案例包括：

- 修改输入本身。
- 查询/更新 DOM。
- 记录日志（甚至在控制台中）。
- 进行 XHR/fetch 调用。
- 任何与函数最终输出无直接关系的操作都被称为副作用。现在来看另一个常见的带有副作用的函数，其中我们改变了输入并执行了不应该在纯函数中执行的操作。

```ts
function findUser(users, item) {
  const reversedUsers = users.reverse();
  const found = reversedUsers.find(user => {
    return user === item;
  });

  document.getElementById("user-found").innerText = found;
}
```

上面的函数接受两个参数，一个用户数组和要在数组中查找的 item。它通过反转数组找到数组末尾的项目。一旦在数组中找到项目，它使用 DOM 方法将该值设置为 HTML 元素的文本。

在这里，我们违反了纯函数的两个基本原则：

1. 我们改变了输入。
2. 我们查询和操作了 DOM。

那么，我们可以预料到什么问题呢？让我们看看。调用者将以以下方式调用 findUser() 函数：

```ts
findUser(users, "sora");
```

在这个阶段，调用者可能不知道该函数正在进行 DOM 操作，除非调用者读取 findUser() 函数的代码。因此，可读性受到损害。该函数的输出执行了与最终输出无关的操作。

此外，我们改变了输入数组。理想情况下，我们应该先拷贝数组，然后对新的数组副本进行更改（反转）以进行查找操作。现在让我们将其改为纯函数。

```ts
function findUser(users, item) {
  // 使用 es6 语法对数组进行拷贝
  const reversedUsers = [...users].reverse();
  // 在拷贝后的副本中进行查找
  const found = reversedUsers.find(user => {
    return user === item;
  });
  return found;
}
```

```ts
// caller
let users = ["sora_1", "sora_2", "sora_3", "sora_4"];
let found = findUser(users, "sora_4");
```

现在，findUser() 函数是一个纯函数。我们消除了改变输入的副作用，它返回了预期的输出。因此，该函数具有可读性，作为一个单元可测试，可重用和可预测。

## 纯函数和副作用是函数式编程的概念。

在这其中你可能会遇到一些术语，我来友好地解释一下。

> Referential Transparency（引用透明）：这意味着我们应该能够用其输出值替换函数调用（或调用），而不改变程序的行为。正如你所看到的，这只有在函数是纯函数的情况下才可能。

让我们看一个简单的纯函数：

```ts
function multipication(x, y) {
  return x * y;
}
```

那么，在这个表达式中，我们可以用其输出值替换函数调用，而不担心产生副作用，

```ts
10 + (multiplication(6, 3) ^ 2);

// 改为
10 + (18 ^ 2);
```

> Parallel Code（并行代码）：纯函数有助于并行代码的执行。然而，在JavaScript中，默认情况下代码是顺序运行的。

## 那么，我可以将所有函数都变成纯函数吗？

是的，从技术上讲，你是可以的。但是只有纯函数的应用程序可能无法完成太多实际任务。

你的应用程序可能会涉及到一些副作用，比如 HTTP 调用、控制台日志、IO 操作等。请在尽可能多的地方使用纯函数，并尽量隔离不纯的函数（有副作用的函数）。这将大大提高程序的可读性、可调试性和可测试性。

## 总结

拥抱函数式编程概念，如纯函数、减少副作用，会使得代码更易管理和维护。这意味着更少的错误、更快地识别问题、隔离问题、提高可重用性和可测试性。

‍
