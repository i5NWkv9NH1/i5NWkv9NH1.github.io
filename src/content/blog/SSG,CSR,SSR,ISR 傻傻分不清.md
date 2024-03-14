---
title: SSG, CSR, SSR, ISR 傻傻分不清
pubDatetime: 2022-10-12
description: SSG, CSR, SSR, ISR 傻傻分不清
featured: false
draft: false
---

## 前言

在构建网页时，面临的首要问题是“**网页内容如何生成并提交给用户？** ”为了解决这个问题，产生了各种不同的解决方法，称为“**网页渲染模式（Rendering Pattern）** ”。

这个问题表面看起来很简单，但背后涉及到许多不同的选择，选择正确的网页渲染模式对用户体验（UX）和开发者体验（DX）都至关重要。本文将介绍不同的网页渲染模式，并通过比较帮助您选择合适的网页渲染模式来构建网页。

### 良好 UX 的依据

为了创造良好的用户体验，必须使用客观的指标数值来衡量网页体验并修补潜在的缺陷，Google 提出的[网页核心指标](https://web.dev/learn-core-web-vitals/)与[相关的指标](https://web.dev/metrics/)就是很好的方式：

​![image.png](https://s2.loli.net/2024/02/25/lmdzjc8ZS473pRe.png)​

### 良好 DX 的依据

为了创造良好的开发者体验，确保开发时的效率与品质，以下是一些可以引领开发者更好开发的架构特质：

​![image.png](https://s2.loli.net/2024/02/25/8nY7pGc6KBxI9F5.png)​

接着参照以上的指标与特性就可以开始比较不同的网页渲染模式之间的差异与特点了。

> 文章中图片内的「！」代表关注点，主要还是依照个别项目评估为佳。

## 静态网站 Static Site Website

静态网站是将网页文件预先放置在服务器上，当用户请求网页时，服务器简单地返回网页文件给用户，不进行任何计算处理。由于网页内容是固定的，因此静态网站的最大问题是更新动态内容需要手动编辑或尝试使用静态渲染来生成新的文件。

## 静态渲染 Static Site Generation

静态渲染指的是通过静态网站生成的方法来创建网站。使用自动化工具，比如 Jekyll, Hugo, 11ty, Saber.js 等静态站点生成器，这些工具能够将数据与界面分离，并通过模板引擎（Template Engine）生成网页文件。这种模式也被称为静态站点生成（Static Site Generation）。

​![image.png](https://s2.loli.net/2024/02/25/6VJUklXvRn9SIOE.png)​

相较于手动编辑静态网站，使用静态生产器渲染可以更有效率的更新与管理网页，但仍然有几个问题需要注意：

### 问题一：网页动态内容如何呈现？

由于静态渲染的网页内容都是预先渲染好的，想要再额外显示动态的内容是个问题，这时候可以考虑几种应对模式：

- 使用服务器动态的生成并响应每一个页面请求：服务器渲染 SSR
- 在客户端动态加载内容：静态渲染加上客户端获取数据

### 问题二：生成时间过久该怎么办？

渲染大量的页面容易花费极大的时间成本，特别是在大量页面的情况下，由于静态网站的页面都是预先生成好的，因此每次更新网站内容时都需要重新生成「整个网站的所有页面」，这时候可以考虑几种应对模式：

- 让页面只在被索求的时候由服务器生成：增量静态生产 Incremental Static Regeneration

## 静态渲染 + 客户端请求 Static with Client-Side Fetch

在静态渲染的基础上使用 Ajax 的方式，在客户端使用 JavaScript 来发送请求获取数据并更新内容，这样就可以在静态网站中加入动态内容了，但仍需考虑几点问题：

​![image.png](https://s2.loli.net/2024/02/25/PgkHjWNUaw5InVT.png)​

- LCP - 如果内容没有及时加载就可能会导致渲染画面最大内容的时间过长
- CLS - 如果没有提供合适尺寸的画面骨架就会导致布局偏移
- 服务器营运成本 - 动态数据需要在每次页面加载的时候请求
- 可被即时访问 - 需要等待动态内容渲染完毕才能看到完整内容
- 可伸缩的架构 - 需要注意服务器的扩展性

## 服务端渲染 Server-Side Rendering

服务器渲染是指在用户每次请求网页时，服务器都会重新生成网页内容并返回给用户。由于页面即时生成需要时间，因此服务器渲染的网站通常会比静态网站慢。但也因为如此，服务器渲染的网站可以轻易地加入动态内容在页面之中。

​![image.png](https://s2.loli.net/2024/02/25/y3huC6apZtH4f9U.png)​

- TTFB：由于每请求一个页面都需要服务器重新生成，因此势必会更加耗时。
- FCP、LCP、TTI、FID：由于等待服务器重新生成，势必会比预先渲染好页面的静态网站慢，这些达成这些指标的时间也可能会更长。
- 服务器运营成本：由于每次请求都需要重新生成，因此服务器的负担会更重。
- 是否可回溯：都是即时根据当前数据生成页面，因此回溯到先前的页面状态会较为困难。
- 可被即时访问：当服务器无法运作时，就无法访问任何页面。

## 客户端渲染 Client-Side Rendering

客户端渲染是指使用 JavaScript 在浏览器中渲染整个页面。当用户请求网页时，服务器只会返回一个空白的 HTML 文件，并通过客户端 JavaScript 动态生成网页内容。

​![image.png](https://s2.loli.net/2024/02/25/7tiw4pm8goYuhex.png)​

- 注意FCP（首次内容绘制）、LCP（最大内容绘制）、TTI（可交互时间）、FID（首次输入延迟）：由于需要等待JavaScript加载，因此首次内容绘制的时间可能会更长。

## 增量静态生产（Incremental Static Regeneration，ISR）

增量静态生产是在静态生产的基础上进行的改进，旨在解决大量页面导致构建时间长、动态数据无法即时呈现的问题。在 ISR 中，只会事先渲染部分重要页面，剩余的页面等到有用户请求再渲染，也有一种方法是在指定的时间由服务器重新渲染该页面，以便定期刷新静态页面中的内容。

​![image.png](https://s2.loli.net/2024/02/25/KGQhm4Dyk63AnoC.png)​

服务器运营成本：需要一台服务器持续地渲染新页面，相较于完全的静态生成会有维持服务器的开销。

## 总结

渲染机制的基本差异主要在于：“渲染的时机是在服务器还是客户端？”以及“是预先渲染好还是动态生成？”这两个问题的答案是网页渲染模式的核心。如果是预先渲染好的网页通常会有更友好的 SEO，因为搜索引擎爬虫可以轻易地解读现成的网页文件，同时在客户端会有更好的性能，但相应的代价是服务器需要付出更多的开销。

## 参考资料

- [Rendering Patterns - patterns.dev](https://www.patterns.dev/posts/rendering-patterns)
- [Rendering Patterns - JavaScript Patterns](https://javascriptpatterns.vercel.app/patterns/rendering-patterns/introduction)
- [10 Rendering Patterns for Web Apps - Beyond Fireship](https://www.youtube.com/watch?v=Dkx5ydvtpCA)
- [Rendering on the Web](https://web.dev/rendering-on-the-web/)
