---
title: 复刻 ChatGPT - 光标跟随效果
---

## 前言

![](https://s2.loli.net/2024/08/29/psO7rjYBZzAW3ay.png)

在我们使用 ChatGPT 的时候，我们可以观察到它的回复内容里有一个光标，这个光标它是会跟随着文字内容增加而移动。

## 思路

首先是基本的 DOM 结构：

```html
<div class="text-container">
  <div class="text"></div>
  <div class="cursor"></div>
</div>
```

一个容器里边装了一个 text 元素，一会函数执行后让文本填充进来。第二个就是闪烁的光标，我们的最终目的，就是要不断去改变光标的位置，让光标始终在文本的末尾。

接着是脚本内容：

```js
const textContainer = document.querySelector('.text-container')
const textElem = document.querySelector('.text')
const cursor = document.querySelector('.cursor')

function delay(durtaion) {
  return new Promise((resolve) => setTimeout(resolve, durtaion))
}
async function autoAppend() {
  function transfer(text) {
    return text.replace(/\n/g, '<br>');
  }
  function updateCursor() { }

  const content = `朋友们好啊，我是浑元形意太极门掌门人马保国，刚才有个朋友问我：“马老师发生什么事啦“。我说”怎么回事“，给我发了几张截图，我一看，哦，原来是昨天，有两个年轻人，三十多岁，一个体重九十多公斤，一个体重八十多公斤。他们说，欸，有一个说是：”我在健身房练功，颈椎练坏了，马老师你能不能教教我浑元功法，帮助治疗一下我的颈椎病。“我说可以，我说你在健身房练死劲儿不好用。他不服气，我说小朋友，你两个手来折我一个手指头，他折不动，他说你这也没用。我说我这有用，这是化劲儿，传统功夫是讲化劲儿的，四两拨千斤，二百多斤的英国大力士,都握不动我这一个手指。他说要和我试试，我说可以。欸！我一说他啪一下就站起来了，很快啊！,然后上来就是一个左正蹬，一个右鞭腿，一个左刺拳。我全部防出去了啊，防出去以后自然是，传统功夫以点到为止，右拳放在他鼻子上，没打他，我笑一下，准备收拳。因为这时间，按照传统功夫的点到为止，他就输了，如果我这一拳发力，一拳就把他鼻子打骨折了，放在他鼻子上没用打他，他也承认，我先打到他面部，他不知道拳放在他鼻子上，他承认我先打到他面部啊！我收拳的时间不打了，他突然袭击左刺拳来打我脸。我大意了啊，没有闪。他的左拳给我眼，给我右眼蹭了一下，但没关系啊，他也说，他结束也说了。两分多钟以后，当时流眼泪了捂着眼，我说停停，然后两分钟以后，两分多钟以后，就好了我说小伙子你不讲武德，你不懂。他说马老师对不起对不起，我不懂规矩。啊，我是，他说他是乱打的。他可不是乱打的啊，正蹬，鞭腿，左刺拳，训练有素。,后来他说他练过三四年泰拳啊，看来是有备而来。这两个年轻人，不讲武德，来，骗，来，偷袭，我69岁的，老同志，这好吗，这不好，我劝，这位年轻人，好自为之，好好反思，不要再犯这样的聪明，小聪明，啊！武林要以和为贵，要讲武德，不要搞窝里斗。,谢谢朋友们`

  for (let i = 0; i < content.length; i++) {
    let text = content.slice(0, i)
    let result = transfer(text)
    textElem.innerHTML = result
    updateCursor()

    await delay(500)
  }
}
```

这里写一个自动追加文字的方法 `autoAppend`，将马保国的台词作为这一次的文本，然后遍历，每隔一小段时间然后追加一个文本，并且把文本转为html元素。在每一个追加过后，我们调用 `updateCursor` 来更新光标的位置。

每一次调用 `updateCursor` 函数的时候我们做三件事：第一件事是追加一个文字到末尾，第二件事是获取追加的文字位置，最后根据文字位置设置光标位置。

```js
function updateCursor() {
  const textNode = document.create
}
```

