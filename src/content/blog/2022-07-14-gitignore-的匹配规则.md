---
title: Gitignore 的匹配规则
description:
pubDatetime: 2022-07-14
---

前言

## 第一种规则：直接书写单词

```ini
dist
```

在这种规则下，它可以匹配整个工程里边，所有名称为 `dist` 的目录或者是文件。

![](https://s2.loli.net/2024/08/28/l6sQKgyAr4d1iDC.png)

可以看到，`dist` 文件夹和 `dist` 文件已经变成灰色，它已经被 `Git` 排除掉了。

那么也有可能这个目录是在某一个目录的里边。可以看到，`output/dist` 文件夹也被排除掉了。

![](https://s2.loli.net/2024/08/28/sVROyhqQ2XnELMB.png)

## 第二种规则：带斜杠

带斜杠的文件或文件夹存在几种情况，一种是在前面，一种是在中间，也有可能在前面和中间。

```ini
/output
output/dist
/output/disk
output/
```

这种情况下，它就不是针对整个工程了，而是以 `gitignore` 这个文件的位置出发去寻找匹配的。

```ini
/dist	 #以 gitignore 位置出发，寻找当前路径 dist 文件或文件夹
```

![](https://s2.loli.net/2024/08/28/edyS3QjECrbwJmv.png)

如图所示，在同级目录下的 `dist` 目录被排除，而第二层级的文件夹或者文件则不会。

```ini
dist/
```

在末尾加上一个斜杆，表示只匹配文件夹，这样一来所有的 `dist` 目录都会被排除。

![](https://s2.loli.net/2024/08/28/jc7pRzGM8kHhu5y.png)

如图所示，同级 `dist` 文件夹和 `output/dist` 文件夹被排除，但 `test/dist` 作为文件则不会。

```ini
output/dist/
```

以 `output/dist/` 为例子，`Git` 会从 `.gitignore` 当前路径，将 `output` 文件夹下的 `dist` 文件夹排除，其他文件夹则不会被排除。

![](https://s2.loli.net/2024/08/28/Sszfhq8gUmQLu2a.png)

## 第三种规则：通配符

在上述例子中，如果我们要将所有 `dist` 排除掉，则可以加入：

```ini
**/dist*
```

![](https://s2.loli.net/2024/08/28/8WLqbiYP9v65O2R.png)

如果我们只想要排除文件夹，不包括文件的话：

```ini
**/dist/
```

![](https://s2.loli.net/2024/08/28/rs3GQNXKWFdOJul.png)

如果要指定具体的文件夹，我们还可以：

```ini
# 将 `output` 文件夹中所有的 `dist` 文件夹和文件给排除。
output/**/dist
```

![](https://s2.loli.net/2024/08/28/hj4o2NSUnigycHC.png)

```ini
# 将 `output` 文件夹中所有 `dist` 文件夹给排除
output/**/dist/
```

![](https://s2.loli.net/2024/08/28/lxs8P5Whr2yHpzR.png)
