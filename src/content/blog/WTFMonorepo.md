---
title: WTF Monorepo
pubDatetime: 2023-04-10
description: WTF Monorepo
featured: false
draft: false
---

## 什么是 Monorepo？为什么需要它？

要了解 Monorepo 可以先从分析现有解决方案存在的问题点，再来延伸至 Monorepo 的解决方案。

### **Multi-Repository / Polyrepo（多仓库）**

当创建一个新项目时，大多数时候直觉的想法是「再创建一个新的 Git 仓库」，这样的做法在项目规模小的时候并不会有太大的问题，但随着项目规模的增大却会衍生出不少麻烦。

比如说不同的应用使用到相同的逻辑、类型、配置文件或包时都会发生难以统一管理或更新的问题。如果要同步仓库共用的代码片段会需要特地发布包，再由其他项目通过包管理工具进行追踪更新。

这种作法并没有任何问题，只是显然并不适合作为更新频繁项目的解决方案：

- 需要特别发布包
- 每次包更新都要对「任何」依赖的项目更新
- 需要管理「所有」仓库的包版本
- 需要在不同的仓库之间切换
- CI 流程较不方便
- 回溯系统状态困难

### **Monolith Repo（单体仓库）**

换个角度讲，如果项目架构上所有相互依赖的仓库都放在相同的仓库当中不就没有问题了吗？这样的做法便是：「把任何项目都塞到同个仓库就完事」。虽然有点反直觉，但确实解决了多仓库带来的问题！但这样的做法也会导致整个项目庞大且牵一发动全身，并且对技术选择僵化缺乏弹性（由于共用相同的包管理）。

最终还是有扩展性、维护性和灵活度的挑战：

- 代码耦合度高可能导致合并冲突和协作问题
- 任何改动都需要重新测试或部署整个项目
- 包管理缺乏弹性
- 项目庞大造成性能问题
- 权限管理问题

### Monorepo（單一儲存庫）

```html
Monorepo ├── apps │ ├── frontstage │ │ └── package.json │ ├── backstage │ │ └──
package.json │ ├── ui │ │ └── package.json │ └── design-system │ └──
package.json └── package.json
```

与 Monolith Repo 很像，同样是 **「把任何项目都塞到同个仓库就完事」** 特别容易与 Monolith 的做法搞混，差异在于每个仓库在包管理器当中还是视为独立的项目，这点可以通过 [包管理器相关设置](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) 或是通过像是 [Nx 透过 TypeScript Project References🔗](https://nx.dev/concepts/integrated-vs-package-based#integrated-repos)。

这么做主要可以改善包管理缺乏弹性的问题，将包共同的依赖管理在根目录当中，但也同时允许每个项目有自己的独立包，至于扩展性、维护性和灵活度的挑战还是要依靠其他工具来解决 😂。

## Monorepo 延伸

基于 Monolith Repo 与 Monorepo 都存在性能、权限、协作等问题，因此通常会通过其他工具来解决这些问题，像是：[rush🔗](https://rushjs.io/)、[Nx🔗](https://nx.dev/)、[Turborepo🔗](https://turborepo.dev/)，通过团队共享缓存避免重复执行、并行化执行、自动化依赖更新等各式各样的功能来强化体验。

## 总结

### **Monorepo 优势：**

1. 易于共享代码
2. 简化依赖管理
3. 微小更改变得容易
4. 易于大型代码重构
5. 易于团队跨项目合作
6. 统一 CI 流程

### **Monorepo 劣势：**

1. 额外学习与维护成本
2. 效能问题
3. 权限问题

Monorepo 与 Monolith Repo 的差异在于多包管理的弹性，如果项目间频繁需要共用的代码片段或包，那么 Monorepo 是一种不错可以考虑的解决方案，但如果项目间没有太多关联使用，Monorepo 反而会增加不必要的复杂度，考虑使用多仓库的方式。

## 延伸阅读推荐：

1. [你很常听到 monorepo，但为什么要用 monorepo?🔗 - ExplainThis]()
2. [The Concept Of Monorepos🔗 - Ahmed Elsakaan]()
3. [Monorepos - How the Pros Scale Huge Software Projects // Turborepo vs Nx🔗 - Fireship]()
4. [monorepo.tools🔗]()

这些链接可能提供了关于 monorepo 的更深入解释、使用案例以及工具推荐，有助于你更好地理解和应用 monorepo 的概念。

‍
