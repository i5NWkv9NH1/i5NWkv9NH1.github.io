---
title: JavaScript 实现函数重载
pubDatetime: 2024-08-17
draft: true
tags:
  - JavaScript
---

## 什么是函数重载

**函数重载（Function Overloading）**是指在同一个作用域中，允许存在多个名称相同但参数列表不同的函数。在函数调用时，编译器根据传递的参数类型和数量来选择合适的函数版本。

## JavaScript 中实现函数重载

### 冗余的代码

```js
function getUsers(...args) {
  if (args.length === 0) {
    console.log("查询所有用户");
  } else if (args.length === 1) {
    if (typeof args[0] === "string") {
      console.log(`查询用户: ${args[0]}`);
    } else if (typeof args[0] === "number") {
      console.log(`查询用户 ID: ${args[0]}`);
    }
  } else if (args.length === 2) {
    if (typeof args[0] === "string" && typeof args[1] === "string") {
      console.log(`查询用户: ${args[0]} ${args[1]}`);
    } else if (typeof args[0] === "number" && typeof args[1] === "number") {
      console.log(`查询用户 ID 范围: ${args[0]} 到 ${args[1]}`);
    }
  }
}

// 调用示例
getUsers(); // 查询所有用户
getUsers(1); // 查询用户 ID: 1
getUsers(1, 20); // 查询用户 ID 范围: 1 到 20
getUsers("张"); // 查询用户: 张
```

在上述代码中，通过判断参数的数量和类型来模拟函数重载。不过这种方式代码会变得较为复杂和难以维护。

### jQuery 思路

```js
function addMethod(object, name, fn) {
  const old = object[name];
  object[name] = function (...args) {
    if (args.length === fn.length) {
      return fn.apply(this, args); // 调用当前函数
    } else if (typeof old === "function") {
      return old.apply(this, args); // 调用之前保存的函数
    }
  };
}
```

```js
const searcher = {};

addMethod(searcher, "getUsers", () => {
  console.log("查询所有用户");
});
addMethod(searcher, "getUsers", name => {
  console.log(`查询用户: ${name}`);
});
addMethod(searcher, "getUsers", (firstName, gender) => {
  console.log(`查询用户: ${firstName} ${gender}`);
});

// 使用示例
searcher.getUsers(); // 查询所有用户
searcher.getUsers("张"); // 查询用户: 张
searcher.getUsers("张", "男"); // 查询用户: 张 男
```

jQuery 实现的方式看上去优雅了很多，但是无法适应参数默认值，如果在 callback 参数中使用默认值，那么整个 args 长度会一直不匹配。

```ts
// fn.length = 1
addMethod(searcher, "getUsers", (name = "sora") => {
  console.log(`查询用户: ${name}`);
});
// fn.length = 0
addMethod(searcher, "getUsers", (name = "sora") => {
  console.log(`查询用户: ${name}`);
});
```

```ts
searcher.getUsers(1); // undefined
```

而且，它还无法适配参数的类型：

```ts
searcher.getUsers(1); // 得到第一页的用户，默认 10
searcher.getUsers("张"); // 查询用户: 张
```

调用两个参数数量一致，但是类型却不同，预期的情况应该是不同类型使用不同的业务逻辑。

### 其他方式

```ts
// overload.ts
function createOverload() {
  const map = new Map();

  function overload(...args) {
    const key = args.map(arg => typeof arg).join(",");
    const fn = map.get(key);
    if (fn) {
      return fn.apply(this, args);
    }
    throw new Error("no matching function");
  }

  overload.addImpl = function (...args) {
    const fn = args.pop();
    if (typeof fn !== "function") {
      //
      return;
    }
    const types = args;
    //
    map.set(types.join(","), fn);
  };

  return overload;
}
```

```ts
// index.js
import createOverload from "./overload";

// 创建重载管理器
const getUsers = createOverload();

// 添加不同的实现
getUsers.addImpl(() => {
  console.log("查询所有用户");
});

getUsers.addImpl("number", searchPage);
getUsers.addImpl("number", "number", (page, itemsPerPage) => {
  console.log(`查询第 ${page} 页，每页 ${itemsPerPage} 项`);
});

getUsers.addImpl("string", name => {
  console.log(`查询用户: ${name}`);
});

getUsers.addImpl("string", "string", (name, gender) => {
  console.log(`查询用户: ${name}, 性别: ${gender}`);
});

// 使用示例
getUsers(); // 查询所有用户
getUsers("name"); // 查询用户: name
getUsers(1); // 查询第 1 页，每页 10 项（假设默认每页 10 项）
getUsers(1, 1); // 查询第 1 页，每页 1 项
getUsers("name", "male"); // 查询用户: name, 性别: male
```
