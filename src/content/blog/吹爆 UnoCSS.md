---
title: 吹爆 UnoCSS
pubDatetime: 2023-11-21
description: 吹爆 UnoCSS
featured: false
draft: false
---

目前除了流行的 TailwindCSS，已经存在许多替代选择。比如 WindiCSS、Twind或Tachyons。在本文中，我将介绍另一种选择，这是一个相对较新的库——UnoCSS。在阅读完本文后，你可能会考虑在下一个项目中使用 UnoCSS，而不是 TailwindCSS。

## 什么是 UnoCSS？

UnoCSS 自称为原子 CSS 引擎。原子 CSS 是一种 CSS 架构，其中每个类只执行一个操作。原子 CSS 类的示例是你在 TailwindCSS 中看到的类。例如：

```css
.bg-white {
  background-color: rgb(255 255 255);
}
.border {
  border-width: 1px;
}
```

如果之前你用过 TailwindCSS 或者类似的东西，你可能已经知道用这些类可以快速又容易地给 HTML 加上样式，而且还容易维护。

但是和 TailwindCSS 不同，UnoCSS 本身并没有包含这些类。它更像是一个 Meta 框架，可以让你构建类似 TailwindCSS 的原子 CSS 框架。

比如，要在 UnoCSS 中实现上面那个 `bg-white`​ 类，可以创建下面这样的配置：

```js
// uno.config.ts
{
  rules: [["bg-white", { "background-color": "rgb(255 255 255)" }]];
}
```

你现在可以在你的代码中使用 `class="bg-white"`​，UnoCSS 将把上述的 `bg-white`​ 类输出到你的 CSS。

当然，我们不希望为 `bg-white`​、`bg-black`​、`bg-red`​ 等每个类都这样做，那将会很繁琐。UnoCSS 允许开发者使用**正则表达式**来创建动态规则。一个例子如下：

```ts
// uno.config.ts
{
  rules: [[/^bg-(.+)$/, match => ({ "background-color": match[1] })]];
}
```

这只支持命名的 CSS 颜色，但由于这只是 JavaScript 代码，理论上可以扩展它，使其也包括我们自定义颜色与 CSS 颜色代码之间的映射。

但所有这些看起来都是在做很多重复无用的工作，只是为了重新实现 TailwindCSS 已经有的功能。在这一方面，UnoCSS 提供了 Presets 功能，能够让开发者重用其他人的代码。

预设（Presets）是一组规则和其他配置值，你可以包含在自己的 UnoCSS 配置中。目前在 Github 上已经有开发者分享了在 UnoCSS 中实现了包含所有 TailwindCSS 功能的 UnoCSS 预设。它被称为 @unocss/preset-wind，已经包含在主要的 unocss NPM 包中。我们可以通过导入它在我们的配置中使用：

```ts
// 添加到配置文件中
import { presetWind, defineConfig } from "unocss";

export default defineConfig({
  presets: [presetWind()],
});
```

现在差不多可以用上 TailwindCSS 和 WindiCSS 的所有功能了，因为这个预设实际上就是 TailwindCSS 和 WindiCSS 的结合体。它甚至还搞定了 TailwindCSS 的主题配置（虽然不是百分之百的完整）。

UnoCSS 还有其他的预设，比如 @unocss/preset-uno，这个预设甚至包含了 Bootstrap 和 Tachyons 的 class，或者 @unocss/preset-attributify 预设，可以让你直接在 HTML 元素上指定类。从最后一个例子中可以看到，预设可以做的远不止添加新的原子类那么简单。

此外，还有很多社区维护的预设，实现了 TailwindCSS 插件或其他有趣的功能。如果想看看所有官方和一些社区维护的预设列表，可以访问[官方文档](<[https://github.com/unocss/unocss#presets。](https://github.com/unocss/unocss#presets%E3%80%82)>)。

## 为什么选择 UnoCSS 而不是 TailwindCSS 呢？

可能你在想，这两个库或引擎本质上实现的功能差不多，为什么要折腾这所谓的替代方案？

### 性能

在我看来，UnoCSS 相对于 TailwindCSS 有两个主要优势。首先是**性能**。

UnoCSS的速度要比TailwindCSS和WindiCSS快得多，正如你可以从 UnoCSS 文档中的基准测试结果看到的那样。

```log
10/21/2021, 2:17:45 PM
1656 utilities | x50 runs

none                            8.75 ms /    0.00 ms
unocss       v0.0.0            13.72 ms /    4.97 ms (x1.00)
windicss     v3.1.9           980.41 ms /  971.66 ms (x195.36)
tailwindcss  v3.0.0-alpha.1  1258.54 ms / 1249.79 ms (x251.28)
```

这是因为 UnoCSS 不像 TailwindCSS 那样将文件解析为 **AST**。由于 UnoCSS 是作为 Vite 插件实现的，它不必为所有源文件生成单独的文件监视器。相反，它只是转换 Vite 提供的文件。

### 灵活

UnoCSS 比 TailwindCSS 更加**灵活**。

因为它是一个引擎而不是一个完整的、固执己见的 CSS 框架，你可以决定使用哪些功能。也许在某个项目中你需要为大量文本添加样式，所以你可以考虑安装 @unocss/preset-tagify 预设，使你能够做用 class 来作为 HTML 的标签 😂：

```ts
<text-red> red text </text-red>
I'm feeling <i-line-md-emoji-grin /> today!

// 编译成：
<span class="text-red"> red text </span>
I'm feeling <span class="i-line-md-emoji-grin"></span> today!
```

## 结语

这就是 UnoCSS 可以带给你的一种可能性，随着社区的壮大，未来会有更多的预设、更多让人眼前一亮的功能。

想要使用 UnoCSS，最好是在先熟悉了 TailwindCSS 的情况下，因为 UnoCSS 官网文档都是基于你已经掌握了某些概念和规范的前提下。而且，尽管 UnoCSS 支持几乎所有 TailwindCSS 的功能，但在一些特殊情况下可能不太正常。主题配置也不是那么完美，当然，也是没有文档的。最后，VSCode 扩展并不如 TailwindCSS 的那个好用。自动补全有时候不太靠谱，不如 TailwindCSS 的那么好用，有时还会在 HTML 之外错误地检测到类名。

虽然有这些问题，但 UnoCSS 绝对是 TailwindCSS 的一个不错的替代品，特别是如果你关心开发体验，因为它能带来更好的开发服务器性能，或者你想要更大的灵活性。

如果你看完这一切后想尝试一下，可以

```npm
bun add -D unocss
```

‍
