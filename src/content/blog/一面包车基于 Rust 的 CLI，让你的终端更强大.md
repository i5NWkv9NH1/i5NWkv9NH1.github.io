---
title: 一面包车基于 Rust 的 CLI，让你的终端更强大
pubDatetime: 2024-03-10
description: 一面包车基于 Rust 的 CLI，让你的终端更强大
featured: false
draft: false
---

## 前言

现在终端里面用 Rust 写的工具可真是太火了。Rust 是一门通用的编程语言，超级快而且安全可靠。它可能当今世界上增长最快、最受欢迎的编程语言。Rust 能用来搞操作系统、搭建 Web 服务器，还能写命令行工具。最近，有一大波用 Rust 写的命令行工具冒出来了，而且很多都是想要取代标准的Unix命令。它们更快、更容易上手，功能也比那些老古董 Unix 的强多了。今天我就给大家介绍一些我用了一阵子觉得很牛的 Rust 命令行工具。你也可以试试，让你的终端更强大！ ~~（逃~~

这些工具不仅支持 GNU/Linux，还适用于 macOS。虽然我没在 Windows 上试过，不过大多数也应该能在 Windows 上跑。我建议你根据个人喜好给这些命令起个 alias，把它们替换成你平时用的命令。如果你装了 Cargo，也就是 Rust 的包管理器，你可以用 Cargo 安装所有这些工具。

### Alacritty

先说说终端吧。[Alacritty ](https://github.com/alacritty/alacritty)是个跨平台的现代终端仿真器，自带一些合理的默认设置。支持 GPU 加速，飞一般的快，还能调教得特别顺手。Linux、macOS 和 Windows 上都能用。虽然它的 UI 不是那么花里胡哨，但好处是配置都是通过 YAML 文件搞定的。~~虽然我没把它设成我的主力终端。~~ 如果你真的需要速度和 GPU 加速，Alacrity 绝对是个好选择。[有篇很好的文章是讲如何在 Alacritty 里用 tmux 的](https://arslan.io/2018/02/05/gpu-accelerated-terminal-alacritty/)，你也可以试试 [Zellij](https://github.com/zellij-org/zellij)，它是一个用 Rust 写的现代终端复用器，可以和 Alacritty 配合得很好。

当然了，还有 [Warp ](https://www.warp.dev/)终端，但可惜它不是开源的，虽然挺强大的。

### 安装

```fish
# Arch Linux
yay -S alacritty
# Fedora/CentOS
dnf copr enable atim/alacritty
dnf install alacritty
# Debian/Ubuntu
add-apt-repository ppa:aslatter/ppa
apt install alacritty
# macOS Homebrew
brew install --cask alacritty
# Windows Scoop
scoop bucket add extras
scoop install alacritty
# Cargo on any
cargo install alacritty
```

## Starship

[Starship ](https://starship.rs/)大概是我用过的最好的终端提示工具。~~别再管 Oh My Zsh 之类的了。~~ Starship 性能好、定制性强，还有出色的默认主题和设置。我基本没改过默认设置，因为一切都开箱即用，很适合懒人。Starship 支持 zsh、fish 和 bash 等各种 shell，并且还能与其他 **shell plugins** 如 Oh My Zsh 一起使用，比如你还想用 Oh My Zsh 的其他插件 (auto-completion) 。Starship 在使用 Nerd Font 时效果最好，因为它可以根据上下文显示图标和连词。以前经常用 Oh My Zsh，主题是 powerlevel10k，但启动和提示有点慢。Starship 更快，功能更多，用户体验也很棒。

### 安装

```fish
# Arch Linux
yay -S starship
# Fedora/CentOS
dnf install starship
# Debian/Ubuntu
curl -sS https://starship.rs/install.sh | sh
# macOS/Linux Homebrew
brew install starship
# macOS MacPorts
port install starship
# Windows Scoop
scoop install starship
# Cargo
cargo install starship --locked
```

## Bat

[bat ](https://github.com/sharkdp/bat)是我最喜欢的 Rust ClI 工具之一。它是 cat 命令的替代品，用过 bat 之后你就再也不会回头了。它提供语法高亮、行号、Git 变更高亮、显示特殊字符、分页等功能。速度超快，而且看起来很漂亮。第一次尝试后，我立刻用 alias 把 bat 设置为 **cat**。默认情况下，bat 的行为类似于 less，通过分页显示大量输出，但可以禁用分页，使其像 cat 一样精确工作。它甚至可以作为 fzf 的预览器使用，并与 tail、man、git 等命令和工具结合使用，为输出添加语法高亮。语法高亮主题是可以配置的。

```fish
# Arch Linux
yay -S bat
# Fedora/CentOS
dnf install bat
# Debian/Ubuntu
apt install bat
# macOS/Linux Homebrew
brew install bat
# macOS MacPorts
port install bat
# Windows Scoop
scoop install bat
# Cargo
cargo install bat --locked
```

## Lsd 和 Exa

[LSD ](https://github.com/Peltoche/lsd)和 [exa ](https://github.com/ogham/exa)都是 `ls`​ 命令的替代品。它们都具有漂亮的颜色和图标，还有标题、排序、树状视图等功能。Exa 在树状视图方面略快于 LSD，并且可以显示文件和文件夹的 Git 状态。我更喜欢 exa，因为它支持 Git 并且树状视图更快。我已经设置了 `ls`​ 的别名，默认使用 exa。两者都可以配置以显示自定义列和排序行为。

## exa 安装

```
# Arch Linux
yay -S exa
# Fedora/CentOS
dnf install exa
# Debian/Ubuntu
apt install exa
# macOS Homebrew
brew install exa
# Cargo
cargo install exa

# Alias ls to exa
alias ls='exa --git --icons --color=always --group-directories-first'
```

## lsd 安装

```fish
# Arch Linux
yay -S lsd
# Fedora/CentOS
dnf install lsd
# Debian/Ubuntu
dpkg -i lsd_0.23.1_amd64.deb # get .deb file from https://github.com/Peltoche/lsd/releases
# macOS Homebrew
brew install lsd
# macOS MacPorts
port install lsd
# Windows Scoop
scop install lsd
# Cargo
cargo install lsd

# Alias ls to lsd
alias ls='lsd --header --color=always --group-directories-first'
```

## Rip

rip 是 rm 命令的改进版本。它更快、更安全、更用户友好。rip 将删除的文件发送到临时位置，因此可以使用 `rip -u`​ 恢复。我很喜欢它的简洁和撤销功能，不用担心使用 `rm`​ 时会不小心删除东西。虽然 rip 可以用别名替换 `rm`​，但建议最好不要这样做，因为你可能会习惯于这样做，在其他系统上无法撤销删除。

### 安装

```fish
# Arch Linux
yay -S rm-improved
# Fedora/CentOS/Debian/Ubuntu
# Install from binary or build locally using Cargo
# macOS Homebrew
brew install rm-improved
# Cargo
cargo install rm-improved
```

## Xcp

[xcp ](https://github.com/tarka/xcp)是 `cp`​ 命令的替代品。它更快、对用户友好，支持进度条、并行复制、.gitignore 支持等。我喜欢它的简单性和体验，特别是进度条。

### 安装

```fish
# Arch Linux
yay -S xcp
# Fedora/CentOS/Debian/Ubuntu/macOS
# Install from binary or build locally using Cargo
# Cargo
cargo install xcp

# Alias cp to xcp
alias cp='xcp'
```

## Zoxide

[zoxide ](https://github.com/ajeetdsouza/zoxide)是一个更智能的 `cd`​ 替代品。它记住了你访问过的目录，可以在不提供完整路径的情况下跳转到它们。你可以提供部分路径，甚至是路径中的一个单词。当存在类似的路径时，zoxide 使用 fzf 进行交互式选择。它运行速度超快，支持所有主要 shell。

```
# Arch Linux
yay -S zoxide
# Fedora/CentOS
dnf install zoxide
# Debian/Ubuntu
apt install zoxide
# macOS/Linux Homebrew
brew install zoxide
# macOS MacPorts
port install zoxide
# Windows Scoop
scoop install zoxide
# Cargo
cargo install zoxide --locked
```

安装后，你需要将以下内容添加到你的 shell 配置文件中。对于其他 shell，请参考[文档](https://github.com/ajeetdsouza/zoxide#step-2-add-zoxide-to-your-shell)。

```fish
# bash (~/.bashrc)
eval "$(zoxide init bash)"
# zsh (~/.zshrc)
eval "$(zoxide init zsh)"
# fish (~/.config/fish/config.fish)
zoxide init fish | source

# Alias cd to z
alias cd='z'
```

## Dust

[Dust ](https://github.com/bootandy/dust)是 du 命令的替代品。它快速，具有更好的用户体验，提供了磁盘使用情况的良好可视化。

### 安装

```fish
# Arch Linux
yay -S dust
# Fedora/CentOS
# Install binary from https://github.com/bootandy/dust/releases
# Debian/Ubuntu
deb-get install du-dust
# macOS Homebrew
brew install dust
# macOS MacPorts
port install dust
# Windows Scoop
scoop install dust
# Cargo
cargo install du-dust
```

## Ripgrep

[ripgrep](https://github.com/BurntSushi/ripgrep)（rg）是一个逐行搜索工具，可以在当前目录递归搜索正则表达式模式。它比 grep 更快，具有许多功能，如压缩文件搜索、彩色输出、智能大小写、文件类型过滤、多线程等。亮点之一是它能够通过解析 .gitignore 文件并跳过隐藏和被忽略的文件。

### 安装

```fish
# Arch Linux
yay -S ripgrep
# Fedora/CentOS
dnf install ripgrep
# Debian/Ubuntu
apt-get install ripgrep
# macOS/Linux Homebrew
brew install ripgrep
# macOS MacPorts
port install ripgrep
# Windows Scoop
scoop install ripgrep
# Cargo
cargo install ripgrep
```

## Fd

[fd ](https://github.com/sharkdp/fd)是 find 的简化替代品。使用起来更直观，具有明智的默认设置。由于并行遍历，它非常快，显示现代的彩色输出，支持模式和正则表达式、并行命令、智能大小写、解析 .gitignore 文件等。

### 安装

```
# Arch Linux
yay -S fd
# Fedora/CentOS
dnf install fd-find
# Debian/Ubuntu
apt install fd-find
# macOS Homebrew
brew install fd
# macOS MacPorts
port install fd
# Windows Scoop
scoop install fd
# Cargo
cargo install fd-find
```

## Sd

[sd ](https://github.com/chmln/sd)是一个查找和替换的命令行工具，可以用作 `sed`​ 和 `awk`​ 的替代品。它更加对用户友好和现代化。同时它比 sed 快得多。

```fish
# Arch Linux
yay -S sd
# Fedora/CentOS
dnf install sd
# Debian/Ubuntu
# Install binary from the release page
# macOS Homebrew
brew install sd
# Windows Scoop
choco install sd-cli
# Cargo
cargo install sd
```

## Procs

[procs ](https://github.com/dalance/procs)是 `ps`​ 的替代品。最佳亮点是它提供可读性的输出，多列搜索，比 `ps`​ 提供更多的信息，对 docker 支持，分页，观察模式和树状视图。它是比 `ps`​ 更对用户友好和现代化的替代品。你可以按名称和 PID 进行过滤，并使用逻辑与/或运算符组合多个过滤器。它还有一个对于查看进程层次结构非常有用的树状视图。它还可以显示运行 docker 容器的进程的 docker 容器名称。

### 安装

```fish
# Arch Linux
yay -S procs
# Fedora/CentOS
dnf install procs
# Debian/Ubuntu
# Install binary from the release page
# macOS Homebrew
brew install procs
# macOS MacPorts
port install procs
# Windows Scoop
scoop install procs
# Cargo
cargo install procs
```

## Bottom

[bottom ](https://github.com/ClementTsang/bottom)是 `top`​ 的替代品，具有漂亮的终端 UI。它功能丰富且可定制。

### 安装

```
# Arch Linux
yay -S bottom
# Fedora/CentOS
dnf copr enable atim/bottom -y
dnf install bottom
# Debian/Ubuntu
dpkg -i bottom_0.6.8_amd64.deb
# macOS Homebrew
brew install bottom
# macOS MacPorts
port install bottom
# Windows Scoop
scoop install bottom
# Cargo
cargo install bottom --locked
```

## Topgrade

[Topgrade ](https://github.com/topgrade-rs/topgrade)是一个很棒的实用程序，如果你像我一样喜欢折腾操作系统，那就太适合了。它会检测系统上的大多数软件包管理器并及时进行更新。它支持配置，因此你可以配置它忽略某些软件包管理器。在我的系统上，它检测到了 apt-get, homebrew, pip 等。Topgrade 也支持跨平台，可以在 Windows、macOS 和 Linux 上使用。

### 安装

```
# Arch Linux
yay -S topgrade
# Fedora/CentOS/Debian/Ubuntu/Windows
# Install binary from the release page
# macOS Homebrew
brew install topgrade
# macOS MacPorts
port install topgrade
# Cargo
cargo install topgrade --locked
```

## Broot

[Broot ](https://github.com/Canop/broot)是 `tree`​ 命令的替代品，具有更好的用户体验，你可以使用它导航文件结构。它支持解析 .gitignore。你可以从树状视图中切换到一个目录，以面板形式打开子目录，甚至预览文件。它具有出色的键盘导航功能。它还有许多其他功能。

### 安装

```fish
# Arch Linux
yay -S broot
# Fedora/CentOS/Debian/Ubuntu/Windows
# Install binary from release page https://dystroy.org/broot/install/
# macOS Homebrew
brew install broot
# macOS MacPorts
port install broot
# Cargo
cargo install broot --locked
```

## Tokei

[Tokei ](https://github.com/XAMPPRocky/tokei)是一个很好的计算代码行数和统计信息的工具。它非常快速、准确，并且具有漂亮的输出。它支持超过150种语言，并可以以 JSON、YAML、CBOR 和人类可读的表格形式输出。

### 安装

```fish
# Arch Linux
yay -S tokei
# Fedora/CentOS
dnf install tokei
# Debian/Ubuntu
# Install binary from the release page
# macOS Homebrew
brew install tokei
# macOS MacPorts
port install tokei
# Windows Scoop
scoop install tokei
# Cargo
cargo install tokei
```

## 其他一些 Rust CLI 工具列表：

- [Nushell](https://github.com/nushell/nushell)：用 Rust 写的现代 Shell
- [kdash](https://github.com/kdash-rs/kdash/)：一个快速简单的 Kubernetes 仪表板
- [xh](https://github.com/ducaale/xh)：HTTPie 的替代品，性能更好
- [monolith](https://github.com/y2z/monolith)：将任何网页转换为单个 HTML 文件并内联所有资源文件（如样式、脚本）
- [delta](https://github.com/dandavison/delta)：用于 git、diff 和 grep 输出的语法高亮分页器
- [ripsecrets](https://github.com/sirwart/ripsecrets)：在提交到 git 之前查找代码中的密钥
- [eva](https://github.com/nerdypepper/eva)：一个CLI REPL计算器

‍
