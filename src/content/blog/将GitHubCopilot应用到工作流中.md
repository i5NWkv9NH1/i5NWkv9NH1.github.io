---
title: 将 GitHub Copilot 应用到工作流中
pubDatetime: 2023-08-10
description: 将 GitHub Copilot 应用到工作流中
featured: false
draft: false
---

## 什么是 GitHub Copilot

GitHub Copilot 是微软推出的一款人工智能协作编程工具，[在各大 IDE 中都有支持](https://docs.github.com/en/copilot/using-github-copilot/getting-started-with-github-copilot?tool=azure_data_studio)，而我使用它的契机是因为在还是学生时领取过[ GitHub 学生大礼包](https://education.github.com/pack)，只需要使用学校 Email 注册加上一些在学证明即能领取，它的陪伴显著地提升了我的生产力与更有效率的学习开发技巧，是少数我觉得真正值得付费的服务之一。

> 如果是学生非常推荐领取，当然也可以免费试用 30 天，如果遇到无法支付等问题可以找某宝...

## GitHub Copilot 的定位

GitHub Copilot 的定位是目前非常适合协助开发者自动解决程序底层实践的操作，例如：填写一些 Boilerplate Code（公式化代码）、生成文件与假数据、常见有明显解答的问题、撰写测试……等用途，使开发者们可以花费更多心力专注在规划程序顶层逻辑的实践而非底部琐碎的操作。

### 如果你是一位新手

对于刚踏入开发领域的你，可能还在摸索语法、理解流程，这时 Copilot 就像是一位熟稔常见套路的导师，总能够提供正确且符合标准的程式码示例。它可以帮助你快速理解不同语言的写法，同时在学习过程中提供实际的参考。在初学阶段可以极大地培养你的写程式的信心，不过也要小心过于依赖提示而盲目接受。

建议 Copilot 提示的每一行代码都要仔细阅读并积极查证，确保理解每行代码背后的意涵，并且能够解释为什么这样写，这样才能够真正的学到东西，而不是只是照着提示输入。

### 如果你清楚自己在做什么

对于那些对自己项目有明确计划、清晰目标的开发者，Copilot 也是一个强大的助手。当了解并掌握了大部分语法基础或背景时，Copilot 可以成为你的快速开发伙伴，专注于更高层次的设计和逻辑。这使得你在开发过程中更加高效，能够更迅速地实现你的想法。同时，Copilot 的建议也可以作为一个好参考，有时甚至能够无意间启发解决问题的新思路。

善用 GitHub Copilot，让它成为你开发路上的得力助手，不仅提高了生产力，更有机会使你的程式码更加精简而高效。

## 基础操作

在[官方文件](https://docs.github.com/en/copilot/using-github-copilot/getting-started-with-github-copilot?tool=vscode)有详细的各种整合到 IDE 或编辑器的方式，以我常用的 VS Code 来说只需要简单的在扩展功能中新增 Copilot 并登录 GitHub 帐号即可，且在安装完成后右下角将出现一个 Copilot 的图示，就代表已经成功安装，并且可以通过点击它来设置 Copilot：

​![image.png](https://s2.loli.net/2024/03/03/UHvgPOshbWMK3Z1.png)​

### 接受提示

只要在代码中输入到一半 Copilot 就会开始提示，并且按下 Tab 接受提示：

​![greeting.gif](https://s2.loli.net/2024/02/25/JQ9ho6Gt5EYsIac.gif)​

### 接受部分提示

如果同意提示中的部分内容，可以通过快捷键采纳部分提示。

​![word.gif](https://s2.loli.net/2024/02/25/s3bCOXGdq1cLTkD.gif)​

| 操作系统 | 采纳下一个提示的词          |
| -------- | --------------------------- |
| macOS    | ​<kbd>Command</kbd>​ + `→`​ |
| Windows  | ​<kbd>Control</kbd>​+ `→`​  |
| Linux    | ​<kbd>Control</kbd>​ + `→`​ |

### 切换提示

如果对于提示结果不满意，也可以通过快捷键或将鼠标移动到提示上点击界面来切换不同的提示，或者是 Ctrl + Enter 则会开启新的视窗并生成更多提示建议（可以点击「采纳」按钮来加入现有代码中）：

​![next.gif](https://s2.loli.net/2024/02/25/RvPmoV9Wi84zYpN.gif)​

| 作業系統 | 檢視下一個提示                | 檢視上一個提示                  |
| -------- | ----------------------------- | ------------------------------- |
| macOS    | ​`Option (⌥)`​ 或 `Alt`​+`]`​ | ​`Option (⌥)`​ 或 `Alt`​ + `[`​ |
| Windows  | ​`Alt`​ +` ]`​                | ​`Alt`​ + `[`​                  |
| Linux    | ​`Alt`​ + `]`​                | ​`Alt`​ + `[`​                  |

​![更多建议提示窗口](https://s2.loli.net/2024/02/25/RXZhc3zCwDMQbBJ.png "更多建议提示窗口")​

## 进阶操作

### 与 Copilot 交流

通过安装额外的 [Copilot 聊天扩展功能](https://docs.github.com/en/copilot/github-copilot-chat/using-github-copilot-chat-in-your-ide)，可以通过对话的方式与 Copilot 进行互动。在对话框中通过关键字：@workspace、@vscode、@terminal 来指定对话的前后文范围，并且通过 / 来指定动作，比如：@workspace /explain 这个项目是怎么运作的？

​![](https://s2.loli.net/2024/02/25/w8g5RMxqSrWtCsz.png)​

### 指令范本

说得多不如实际操作，以下是一些可以尝试在现有项目中输入的 Prompt：

- /help：列出 Copilot 的指令
- /clear：清除 Copilot 的对话
- @workspace /explain：解释选取代码如何运作一系列步骤
- @workspace /fix：修复选取代码中的错误
- @workspace /new：创建新的项目
- @workspace /newNotebook：创建新的 Jupyter Notebook
- @workspace /tests：对选取代码创建单元测试
- @vscode /api：询问 VSCode 插件相关问题
- @terminal：解释需求如何透过终端中达成

除了标注 @ 作为前后文之外，也可以透过选取代码并右键使用「行内聊天 Inline Chat」功能来指定想要询问 Copilot 的片段，这样 Copilot 就能够更了解你的需求，并且提供更准确的提示。

​![](https://s2.loli.net/2024/02/25/HY2NawuxTPyD3nI.png)​

### 生成 Commit 信息

这项功能我还在观望，并不常使用，原因是因为亲自体验下来生成结果并不是特别好，而且由于个人的因素，习惯是使用中文 Commit 就更少，但看起来是一个不错的方向！

​![](https://s2.loli.net/2024/02/25/1nBEeQP5r6gGSM7.png)​

## 总结

期待 Copilot 更多新功能的推出，Copilot 支持各式各样的语言与框架，不过通常 Python、JavaScript、TypeScript、Ruby、Go、C# 还有 C++ 的提示会更为完善。通过分析代码前后文与使用的框架提供下一步的代码提示。

### 限制

- 有限的范围 - 尚无法处理复杂的代码结构或晦涩少见的语言或框架，答案的品质取决于训练资料的多样性，因此在较为冷门的语言或框架上 Copilot 的表现会较差。
- 潜在的偏见 - 基于现有训练资料来自各种储存库，人为的偏见与错误可能会被学习到并且产生不良的代码。
- 风险疑虑 - 编写安全敏感的代码时应谨慎操作，始终详细检查和测试生成的代码。

### 要点

- 不要盲目接受 - Copilot 提供的提示暂且只会是大方向的参考，不要盲目接受，要仔细阅读并积极查证，确保理解每行代码背后的意涵，并且能够解释为什么这样写。
- 提供完善的前后文与意图 - Copilot 透过分析目前打开的档案作为回应的前后文，因此良好的命名、注释与范例代码都可以更好的协助 Copilot 提供更准确的提示。具体来说像是使用规范化的注释规则：[JSDOC](https://jsdoc.app/) 能够有效的与 Copilot 沟通程式的需求。
- 使用英文沟通 - 可能单纯是我的偏见，不过为了避免因为语言间转换而曲解意图，通常我会觉得用英文与 Copilot 沟通效果会更好。

## 延伸阅读

[Quickstart for GitHub Copilot - GitHub](https://docs.github.com/en/copilot/quickstart)

[GitHub Copilot - Visual Studio Code](https://code.visualstudio.com/docs/editor/github-copilot)

[Copilot Chat in Visual Studio Code - GitHub Universe](https://www.youtube.com/watch?v=a2DDYMEPwbE)

‍
