---
title: Z-index 的管理
pubDatetime: 2023-04-22
description: Z-index 的管理
featured: false
draft: false
---

最近看到一篇：[Never Get Bit by z-index Again](https://rimdev.io/never-get-bit-by-z-index-again) 文章，作者介绍了使用 CSS 变量为 z-index 赋予相对而非绝对数值的方法，这真是一种优雅而简洁的方式！充分发挥了 CSS 变量的优势，这激发了我写这篇文章的灵感。

## 问题背景

在许多情况下，我们需要调整不同元素的 z-index，以确保它们在叠加时显示的顺序是正确的。但是使用固定的数值通常会导致代码的脆弱性，尤其是在大型项目中，不同部分可能会因为 z-index 冲突而导致难以追踪和维护的问题。通常会设置一个规范文件来统一规范数值，例如 Bootstrap 的 z-index 写成文件是这样规范的：

```css
dropdown: 1000;
sticky: 1020;
fixed: 1030;
modal-backdrop: 1040;
offcanvas: 1050;
modal: 1060;
popover: 1070;
tooltip: 1080;
```

但只要是修改到代码都会需要查看这张表单，并且确保我们的数值不会和其他元素冲突。会需要不断的维护确保个别数值的关系正确：

- 文件与代码需相互同步
- 需要时刻确保数值间的权重正确

## 解决方法

### 解决代码与文件不同步问题

幸好在今天，原生的 [CSS 变量得到了很好的支持](https://caniuse.com/css-variables)，我们可以通过直接使用 CSS 变量来定义 z-index 的值，从而解决了“需要额外文件、预处理器甚至 JavaScript 来管理”的问题。

```css
:root {
  --dropdown-zindex: 1;
}

.dropdown {
  /* 直接在 CSS 內引用变量 */
  z-index: var(--dropdown-zindex);
}
```

### 解决数值间的权重问题

通过 CSS 变量的方式可以直接在代码中引用变量，而不需要再去查看文件。但是还是需要确保数值间的权重正确，这时候我们可以通过 [CSS calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) 来解决这个问题。

```css
:root {
  --dropdown-zindex: 1;
  --sticky-zindex: calc(var(--dropdown-zindex) + 1);
}
```

为什么是 +1？因为 z-index 必须是整数，所以我们可以通过 +1 来确保 sticky 永远高于 dropdown，当然也可以抽离这个数值自行统一定义。

```css
:root {
  --gap-zindex: 10;
  --dropdown-zindex: 1;
  --sticky-zindex: calc(var(--dropdown-zindex) + var(--gap-zindex));
}
```

这样一来，我们通过完全原生的方式建立了一个简单的 z-index 管理系统，不需要额外的文件或预处理器，也不需要 JavaScript，只需要一点点的 CSS 变量与计算就可以了。

### 总结

> 给予相对的关系而非绝对的数值，让我们强烈地关联元素之间的关系，而非依赖于某个魔法数字。

相较于给予绝对的数值，透过相对的关系来管理 z-index 让我更关注在「这个元素会放在哪些元素之间」而非要去记住一个固定数字，回归了使用 z-index 原先想达成的用意。

## 延伸阅读

- [Index fun](https://psuter.net/2019/07/07/z-index) - psuter.net
- [Managing CSS Z-Index In Large Projects](https://www.smashingmagazine.com/2021/02/css-z-index-large-projects/) - Smashing Magzine
