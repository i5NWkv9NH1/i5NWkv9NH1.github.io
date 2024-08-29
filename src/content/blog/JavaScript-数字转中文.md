---
title: JavaScript 数字转中文
---

## 需求：将万亿以下的正整数数字转中文

```ts
function toChineseNumber(num) {
  
}
```

假设我们有一个数字 `45674567`，目标是将其转换为中文表示，例如“四千五百六十七万四千五百六十七”。

### 1. 分割数字

首先，我们需要把数字按每四位分割开来。可以用正则表达式来实现这一点：

```ts
function toChineseNumber(num) {
  const numStr = num.toString().replace(/(?=(\d{4})+$)/g, ',')
}
```

### 2. 转换为数组

我们把分割后的字符串转换为数组，并过滤掉任何空字符串：

```ts
function toChineseNumber(num) {
  const numStr = num.toString()
  .replace(/(?=(\d{4})+$)/g, ',')
  .split(',')
  .filter(Boolean)
  console.log(numStr)
}

console.log(toChineseNumber(45674567))
```

![](https://s2.loli.net/2024/08/28/LJFl9BDfxvqP45U.png)

### 3. 数字转中文

为了将数字转换为中文，我们先定义一个数组来映射数字到对应的中文字符：然后，我们创建一个函数 `_transform` 来处理单个四位数字的转换：

```ts
const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

// 转中文
function _transform(n) {
  for (let i = 0; i < n.length; i++) {
      const c = chars[+n[i]]
      console.log(c)
  }
}
```

![](https://s2.loli.net/2024/08/28/qd58Te2aSIOJhu1.png)

### 4. 添加单位

转为中文数字还不能满足需求，在中文中，数字后面通常会跟着单位，如“十”、“百”、“千”。因此，我们需要一个单位数组。需要注意的是，个位在汉字里面不进行任何表示，所以使用空字符串：

```ts
const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
const units = ['', '十', '百', '千']

// 转中文
function _transform(n) {
  for (let i = 0; i < n.length; i++) {
      const c = chars[+n[i]]
      const u = units[n.length - 1 - i]
      console.log(c, u)
  }
}
```

![](https://s2.loli.net/2024/08/29/YCj1Soa3cQfuZBg.png)

接下来要把数字和单位拼接起来。

```ts
const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
const units = ['', '十', '百', '千']

// 转中文
function _transform(n) {
  let result = ''
  for (let i = 0; i < n.length; i++) {
      const c = chars[+n[i]]
      const u = units[n.length - 1 - i]
      result += c + u
  }
 console.log(result)
}
```

![](https://s2.loli.net/2024/08/29/r2QVsZJo7mOKUSP.png)

### 5. 处理零的情况

看上去似乎没有什么问题。但是，如果字符串数字中间有个0，或者多个0，会是什么样子？

![](https://s2.loli.net/2024/08/29/mahpijgsBkC4qcN.png)

可以看到，当字符串存在 0 时，整个中文看上去都不合理。此时我们需要把字符串中的 0 进行判断。

```ts
function _transform(n) {
  let result = ''
  
  function handleZero(str) {
    return str.replace(/零{2,}/g, '零')
  }
  
  for (let i = 0; i < n.length; i++) {
    const c = chars[+n[i]]
    let u = units[n.length - 1 - i]
    if (c === chars[0]) {
      u = ''
    }
    result += c + u
  }
  result = handleZero(result)
 	console.log(result)
}
```

这里我们判断以0开头的字符串，并且使用了正则表达式来处理字符串中存在多个0的情况。

![](https://s2.loli.net/2024/08/29/QIbC7OVm2gqtGav.png)

接着，还需要处理字符串以0结尾的情况，我们还需要在正则表达式中匹配结尾一个或者多个0的情况，给它替换成空字符串。

```ts
function handleZero(str) {
  return str.replace(/零{2,}/g, '零').replace(/零+$/g, '')
}
```

### ![](https://s2.loli.net/2024/08/29/jIZTXp19NE2bguF.png)

### 6. 整体处理

由于这个函数是将处理四位数字字符串的情况，有了这个 `_transform` 函数之后，我们再把它放到全局环境中去，那么当我们传递大整数时，循环整个数字字符串，分割成每四位一组让辅助函数来处理。

```ts
const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
const units = ['', '十', '百', '千']

function toChineseNumber(num) {
  function _transform(n) {
    let result = ''

    function handleZero(str) {
      return str.replace(/零{2,}/g, '零')
    }

    for (let i = 0; i < n.length; i++) {
      const c = chars[+n[i]]
      let u = units[n.length - 1 - i]
      if (c === chars[0]) {
        u = ''
      }
      result += c + u
    }
    result = handleZero(result)
    return result
  }
    
  const numStr = num.toString()
                    .replace(/(?=(\d{4})+$)/g, ',')
                    .split(',')
                    .filter(Boolean)

  
  for (let i = 0; i < numStr.length; i++) {
    const part = numStr[i]
    const c = _transform(part)
		console.log(c)
  }
    
}
```

![](https://s2.loli.net/2024/08/29/jvMpRwlrdgWPeDF.png)

### 7. 整体处理大单位

最后，还需要带上大单位。

```ts
const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
const units = ['', '十', '百', '千']
const bigUnits = ['', '万', '亿']

function handleZero(str) {
  return str.replace(/零{2,}/g, '零')
}

function toChineseNumber(num) {
  function _transform(n) {
    let result = ''

    for (let i = 0; i < n.length; i++) {
      const c = chars[+n[i]]
      let u = units[n.length - 1 - i]
      if (c === chars[0]) {
        u = ''
      }
      result += c + u
    }
    result = handleZero(result)
		return result
  }
    
  const numStr = num.toString()
                    .replace(/(?=(\d{4})+$)/g, ',')
                    .split(',')
                    .filter(Boolean)

  let result = ''
  
  for (let i = 0; i < numStr.length; i++) {
    const part = numStr[i]
    const c = _transform(part)
		const u = bigUnits[numStr.length - 1 - i]
    result += c + u
  }
  console.log(result) 
}

toChineseNumber(123400001234)
```

![](https://s2.loli.net/2024/08/29/ySOKHMUbGBg4tQv.png)

可以看到一个小细节，结果多出来一个万。也就是说，当123400001234 数字有连续的4个0或者结尾全部位0时，万字时不出现的。

```ts
const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
const units = ['', '十', '百', '千']
const bigUnits = ['', '万', '亿']

function handleZero(str) {
  return str.replace(/零{2,}/g, '零')
}

function toChineseNumber(num) {
  function _transform(n) {
    let result = ''

    for (let i = 0; i < n.length; i++) {
      const c = chars[+n[i]]
      let u = units[n.length - 1 - i]
      if (c === chars[0]) {
        u = ''
      }
      result += c + u
    }
    result = handleZero(result)
		return result
  }
    
  const numStr = num.toString()
                    .replace(/(?=(\d{4})+$)/g, ',')
                    .split(',')
                    .filter(Boolean)

  let result = ''
  
  for (let i = 0; i < numStr.length; i++) {
    const part = numStr[i]
    const c = _transform(part)
		let u = bigUnits[numStr.length - 1 - i]
    
    if (c === chars[0]) {
      u = ''
    }
    result += c + u
  }
  result = handleZero(result)
	return result
}

console.log(toChineseNumber(123400001234))
console.log(toChineseNumber(123400000000))
```

![](https://s2.loli.net/2024/08/29/owX2IUNyGhm3JA4.png)

## 扩展

如果需要将数字转换为大写的中文表示，例如“壹”、“贰”等，我们可以利用映射表：

```ts
const map = {
  '零': '零',
  '一': '壹',
  '二': '贰',
  '三': '叁',
  '四': '肆',
  '五': '伍',
  '六': '陆',
  '七': '柒',
  '八': '捌',
  '九': '玖',
  '十': '拾',
  '百': '佰',
  '千': '仟',
  '万': '萬',
  '亿': '亿'
};

function toBigChineseNumber(num) {
  const result = toChineseNumber(num);
  return result.split('').map(s => map[s]).join('');
}

console.log(toBigChineseNumber(123400001234)); // 输出：壹仟贰佰叁拾肆亿零壹仟贰佰叁拾肆
```

![](https://s2.loli.net/2024/08/29/GDJnjrAoRHqtMv9.png)

