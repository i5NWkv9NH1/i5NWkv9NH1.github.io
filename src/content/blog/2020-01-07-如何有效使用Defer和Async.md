---
title: 如何有效使用 Defer 和 Async
pubDatetime: 2020-01-07
---

## 问题来源

![ezgif-5-5adf69835a.gif](https://s2.loli.net/2024/02/25/gcjnedvX5WiYJKr.gif)​

```html
<body>
  <script src="script.js"></script>
</body>
```

问题一：刚进入网页就让浏览器花费许多时间下载与解析脚本。如果在网页中加入脚本的话，会导致网页的渲染需要花更长的时间去完成。这是因为浏览器在载入脚本的时候会停止渲染网页，直到载入并执行完成才会继续。网页渲染到一半被搁置，对用户来说是极差的体验。

```html
<p>第一个元素</p>

<script>
  console.log(document.querySelectorAll("p")); // NodeList [ p ]
</script>

<!-- 上面的脚本查询不到之后的 DOM 內容 -->
<p>第二个元素</p>
```

问题二：脚本之后渲染的 DOM 元素会选取不到。如果脚本中有选取DOM 元素的操作，但是 DOM 元素还没被建构出来，就会出现undefined或直接报错的问题。

## 解决方案

现今的浏览器都支持 HTML 的 `defer`​ 和 `async`​ 属性，这两个属性都可以让浏览器在加载脚本的时候不会停止渲染网页，它们的差异主要在于执行时间点。以下会介绍三种方法，分别是不使用任何属性、使用 `defer`​ 属性、使用 `async`​ 属性。

### 方法一：把脚本放在底部

![bottom.gif](https://s2.loli.net/2024/02/25/JVD52GmBA6ORIsa.gif)​

```html
<body>
  <h1>title</h1>
  <script src="script.js" />
</body>
```

这是早期常见也最简单粗暴的做法，但这样会导致需要等到整个网页渲染完才能开始加载脚本，在特长的 HTML 文件或缓慢的网络速度下容易拖慢脚本被执行的速度。

### 方法二：Defer

![defer.gif](https://s2.loli.net/2024/02/25/cErqFOQfUxmeJZX.gif)​

```html
<head>
  <script src="script.js" defer></script>
</head>
<body>
  <p>第一个元素</p>
  <p>第二个元素</p>
</body>
```

defer 就是东西先下载，但晚点再执行的概念，这样做我们可以在网页的开头（通常会在 `<head>`​ 中）就向外请求脚本资源，并在 DOM 渲染完毕时才执行。

### 方法三：Async

![async.gif](https://s2.loli.net/2024/02/25/1wBuJxSP4HE9Dh2.gif)​

```html
<script src="script.js" async></script>
```

## 总结

> 这两个属性只适用于外部脚本，如果是行内脚本标签不会有任何效果。

在大多数场景下选择任何一个属性都会改善网页的性能，但如果脚本之间有先后顺序的依赖性，就需要特别注意了。

## 补充

### defer 在 DOMContentLoaded 事件之后吗？

「DOMContentLoaded」事件表示 HTML 文件已经完全被载入并被解析。对于「defer」脚本，它可以创建/删除 DOM 元素，因此「DOMContentLoaded」事件只会在所有「defer」脚本执行完成后触发，以确保在「defer」脚本进行所有可能的 DOM 更新后，最终 DOM 结构已经准备好。

### 如果同时添加 defer 与 async 会发生什么事？

```html
<script src="script.js" async defer />
```

第二属性会被作为备用属性，如果浏览器不支持第一项属性，就会使用第二项属性。

举例来说，如果浏览器不支持 async，就会使用 defer，如果浏览器不支持 defer，就会使用默认的行为。

## 参考资料

- [JavaScript.info - Scripts: async, defer](https://javascript.info/script-async-defer)
- [Growing with the Web - async vs defer attributes](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html#script)

‍
