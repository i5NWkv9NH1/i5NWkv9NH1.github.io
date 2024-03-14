---
title: WSL 2 中安装 MongoDB 6.0
pubDatetime: 2023-12-04
description: WSL 2 中安装 MongoDB 6.0
featured: false
draft: false
---

## 前言

近期在 WSL2 的 Ubuntu 22.04 上进行了 MongoDB 6.0的 安装尝试，并分享下面的指南，以便其他开发者参考。

需要注意的是，本文是对官方安装 MongoDB 文档的适配，原文档是针对 WSL 上的 Ubuntu 20.04 版本，MongoDB 版本是 5.0。

## 步骤

### 导入 MongoDB 包管理系统用的公钥

```sh
wget -qO - https://pgp.mongodb.com/server-6.0.asc | sudo apt-key add -
```

### 创建MongoDB列表文件

```sh
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

### 重新加载本地软件包数据库

```bash
sudo apt-get update
```

### 安装MongoDB 6.0

```bash
sudo apt-get install -y mongodb-org
```

### 确认安装并获取版本号

```bash
mongod --version
```

### 创建数据存储目录

```bash
mkdir -p ~/data/db
```

### 运行Mongo实例

```bash
sudo mongod --dbpath ~/data/db
```

### 检查 MongoDB 实例是否运行

在一个新的shell中运行以下命令：

```bash
ps -e | grep 'mongod'
```

‍
