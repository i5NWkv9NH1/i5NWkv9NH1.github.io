---
title: JavaScript 文件加载失败如何重新加载
pubDatetime: 2024-04-04
draft: true
tags:
  - JavaScript
---

## 前言

在加载 JavaScript 文件时，有时候会遇到一些问题，比如文件加载失败。这可能是由于网络问题或者服务器配置错误造成的。为了保证网页的正常运行，我们可以实现一个简单的机制，当 JavaScript 文件加载失败时自动重试并使用备用域名。

## 解决方案

1. **监听全局错误事件**: 当任何资源加载失败时，JavaScript 会触发一个错误事件。我们可以通过监听 `window` 的 `error` 事件来捕捉这些错误。
2. **判断错误来源**: 当捕捉到错误时，我们需要检查错误是否由 `<script>` 标签引起的。如果错误是由其他原因引起的，比如语法错误，我们就不需要做任何处理。
3. **备用域名准备**: 通常情况下，文件加载失败可能是由于主域名出现了问题。我们可以准备几个备用域名，当主域名加载失败时，尝试从备用域名加载文件。
4. **记录重试状态**: 我们需要一个机制来记录每个文件已经尝试过多少次，以及当前尝试使用的域名。这样可以确保每次重试时都使用不同的域名。
5. **动态生成新 `<script>` 标签**: 当检测到某个 `<script>` 标签加载失败时，我们会创建一个新的 `<script>` 标签，设置其 `src` 为新的域名，然后将其插入到页面中替换掉原来的标签。

## 示例代码

```ts
const domains = ["backup.domain.com", "backup2.domain.com"]; // 备用域名数组
const retryMap = new Map(); // 用于记录每个文件的重试状态

// 监听 window 的错误事件
window.addEventListener(
  "error",
  e => {
    // 检查错误是否是由 <script> 标签引起的，并且不是 ErrorEvent 类型的错误
    if (e.target.tagName !== "SCRIPT" || e instanceof ErrorEvent) {
      return;
    }

    const scriptElement = e.target; // 获取加载失败的 <script> 标签
    const currentUrl = new URL(scriptElement.src); // 获取当前加载失败的 URL
    const pathName = currentUrl.pathname; // 获取路径名，用于识别是哪个文件

    // 如果文件还没有记录重试状态，则初始化为 0
    if (!retryMap.has(pathName)) {
      retryMap.set(pathName, 0);
    }

    const currentRetryIndex = retryMap.get(pathName); // 获取当前的重试次数
    if (currentRetryIndex >= domains.length) {
      console.error(`所有备用域名都尝试过了，但仍然无法加载 ${pathName}`);
      return; // 所有备用域名都尝试过了
    }

    const newDomain = domains[currentRetryIndex]; // 获取当前尝试使用的备用域名
    const newUrl = new URL(currentUrl); // 复制原来的 URL
    newUrl.host = newDomain; // 替换为新的域名

    const newScript = document.createElement("script"); // 创建新的 <script> 标签
    newScript.src = newUrl.toString(); // 设置新的 src
    newScript.async = true; // 防止阻塞页面

    // 将新的 <script> 标签插入到原来的 <script> 标签之前
    scriptElement.parentNode.insertBefore(newScript, scriptElement);

    // 更新重试状态，准备下次失败时使用下一个域名
    retryMap.set(pathName, currentRetryIndex + 1);

    console.log(`尝试使用备用域名加载 ${pathName}: ${newUrl}`);
  },
  true
);
```
