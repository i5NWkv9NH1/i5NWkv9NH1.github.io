---
title: script setup 到底做了什么
description:
pubDatetime: 2024-08-30
---

## 前言

众所周知，Vue.js@3 新增了 `setup` 语法，让开发者在编写组件时更加简洁直接。表面上看，`setup` 语法糖只是一种语法上的优化，但它背后到底做了什么？是否与传统的 `setup` 函数写法完全一致？让我们通过一些分析来了解它的本质。

## 简单示例

首先来看一下使用 `setup` 语法糖的写法：

```vue
<script setup>
const msg = "Hello, world";
const count = ref(0);

function increase() {
  count.value++;
}
</script>
```

这种写法相当于：

```ts
export default {
  setup() {
    const msg = "Hello, world";
    const count = ref(0);

    function increase() {
      count.value++;
    }

    return { msg, count, increase };
  },
};
```

表面上看，这两种语法在效果上是相同的，都是在组件中定义变量、响应式数据和方法，并且将这些东西暴露出来供模板使用。但它们真的完全一致吗？我们通过一些对比来深入了解它们之间的差异。

## 深入分析

为了更清楚地看到两种写法的差异，我们创建了两个组件：一个使用传统的 `setup` 函数（`FooSetup`），另一个使用 `script setup` 语法糖（`FooScriptSetup`）。

```vue
<template>
  <FooSetup ref="refSetup" />
  <FooScriptSetup ref="refScriptSetup" />
</template>

<script setup>
import FooSetup from "./components/FooSetup.vue";
import FooScriptSetup from "./components/FooScriptSetup.vue";
import { onMounted, ref } from "vue";

const refSetup = ref(null);
const refScriptSetup = ref(null);

onMounted(() => {
  console.log(refSetup.value);
  console.log(refScriptSetup.value);
});
</script>
```

接下来，我们去控制台打印出数据。

![](https://s2.loli.net/2024/08/29/a8ROSMCVWmzKXJi.png)

在控制台打印出这两个组件的实例后，发现使用传统写法的组件实例中暴露了很多成员，而使用 `setup` 语法糖的组件实例却没有暴露任何东西。为什么会出现这样的差异？

![](https://s2.loli.net/2024/08/29/qYXFDfx5bVvp37E.png)

而使用语法糖打印出来的结果里面却什么都没有。为什么会造成这种差异呢？

### 编译差异

1. 使用插件来查看单文件组件的编译结果

传统写法和使用语法糖之后编译出来的东西是不一样的，因为最终运行的一定不是单文件组件，而是单文件组件编译出来的结果，这个时候，我们需要借助一个插件 `vite-plugin-inspect`，启动 Vite.js 之后，它会生成两个地址：第二个地址就是查看编译结果的地址。

```
import Insepct from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Insepct()
  ],
})
```

![](https://s2.loli.net/2024/08/29/aH7ERrwMv4KF6e5.png)

可以看到工程里边编译了几个文件，我们把重点聚焦在 `FooScript` 和 `FooScriptSetup` ，看它们两个的编译结果。

2. FooScript 传统写法的组件的编译结果

首先来看 `FooScript` 这个使用传统写法的组件它的编译结果。我们可以清晰地看到，`template` 语法在编译结果后不存在了，而是被转为了一个 `render` 函数，在 `template` 里的什么乱七八糟的指令、属性绑定、v-for、v-if 等这些东西，最终都不复存在，全部变成了 `render` 函数里边。

![](https://s2.loli.net/2024/08/29/4fHuWIVBbziJoSg.png)

接着，我们再重点关注 `setup` 函数，我们可以看到是，它原封不动地被编译出来。写的代码是啥，最终的编译结果就是啥。

![](https://s2.loli.net/2024/08/29/1fWhN6gwMQsjuzH.png)

3. FooScriptSetup 语法糖写法的组件的编译结果

首先可以看到，`template` 同样会被编译成 `render` 函数，这个没区别。

![](https://s2.loli.net/2024/08/29/zWqKeHoY4Ly3jsk.png)

但是 `<script setup>` 语法糖里的内容的编译结果，似乎与传统写法的组件的编译结果相比，并没有太多差异。变量、响应式数据、函数都被 `return` 出来。

但是！仔细观察，右边编译结果多了一个不起眼的 `expose`。

![](https://s2.loli.net/2024/08/29/dpx3HusYcL9g4Mw.png)

那为什么多了这条语句之后造成了代码编写上的差异？

### 不起眼的 Expose

在 Vue.js 官方文档里，有专门对它的描述。`expose` 作为一个数组属性，有两种用法：

- 一种是在传统写法里配置，它表示我要向外界暴露出这个组件实例中有哪些成员？

```ts
  expose: [
    'a',
  ],
  methods: {
    a() { }
  },
  setup() {
    const msg = 'Hello, world'
    const count = ref(0)

    function increase() {
      count.value++
    }

    return {
      msg, count, increase
    }
  }
```

我们这里在 `methods` 属性中添加了一个 `a` 方法，如果说我们希望父组件能够拿到这个组件的 `a` 方法，那么就在 `expose` 数组中使用字符串来添加该函数的名字。

一旦我们在实例中使用了 `expose` 方法，那么控制台就不会将所有组件实例拥有的属性、方法都给暴露出来，而只暴露出我们 `expose` 数组里指定的东西。

![](https://s2.loli.net/2024/08/29/pG1lSdVJB4LQROu.png)

可以看到，控制台打印出来的传统写法的组件，已经与使用语法糖写法的组件没有区别了。看到这里，我想正在阅读这篇文章的你，已经有些眉目了。大概了解了语法糖它本质是怎样的 😂。

- 第二种写法

我们还可以在 `setup` 函数里将 `expose` 给结构出来。

```ts
  setup(props, { expose }) {
    const msg = 'Hello, world'
    const count = ref(0)

    function increase() {
      count.value++
    }

    expose({
      msg
    })

    return {
      msg, count, increase
    }
  }
```

![](https://s2.loli.net/2024/08/29/WG8kP9mqX24cBAi.png)

可以看到，控制台打印出了这个组件实例暴露出来的 `msg`。

如果我们只调用 `expose` ，但是也没有传参，表示我们不希望暴露出任何东西，那么这样子一来，控制台就不会打印出组件实例上任何东西了。

![](https://s2.loli.net/2024/08/29/GnACcsmRQZ69MzT.png)

所以说，如果我们使用了 `setup` 语法糖，那么 Vue.js 会自动给你加上 `expose()` ，让组件实例不暴露任何东西。

### 为什么要多此一举

Vue.js@3 为什么要这样子做？把组件实例里有的东西都暴露出来不好吗？

当然不是，这实际上不是一件好事。因为这种做法就提供了一种可能，你在这个组件实例之外，你可以通过 `reference` 去拿到这个组件实例上的任何成员，比方说，我给 `FooScript` 加个 `reference`，然后父组件通过 `ref.count` 拿到子组件的响应式数据，这就打破了**单向数据流**的约定。

```vue
<script>
onMounted(() => {
  console.log(refFooScript.value);
  // 修改子组件的内部数据
  refFooScript.value.count = 2;
  console.log(refFooScript.value.count);
  console.log(refFooScript.value);
});
</script>
```

![](https://s2.loli.net/2024/08/29/yqGtYZ5sVWmlb6z.png)

`count` 是组件内部的数据，你就给外部提供了一种改动它的可能性， 这种做法存在很大的隐患。**单项数据流**这种约定一旦被打破，代码就离屎山越来越近。

所以，为了解决这个问题，vue.js@3就引入了 `expose` 方法，而在 `setup` 语法糖里，Vue.js@3在编译过程中自动帮我们引入 。

### 一定要暴露？

那如果我们一定要暴露子组件某个响应式数据或方法呢？

```ts
<script setup>
import { ref } from 'vue';
const msg = 'Hello, world'
const count = ref(0)

function increase() {
  count.value++
}

defineExpose({
  msg,
  count,
  increase
})
</script>
```

如果使用的是 `setup` 语法糖的话，直接使用 `defineExpose` 就好。当然，`defineExpose` 是一个宏，它并不参与运行时，它只是参与编译，类似的还有 `defineProps, defineEmits` ，这些都是不参与运行。

![](https://s2.loli.net/2024/08/29/uTvDiz6LtgZ1aRV.png)

## 总结

通过以上分析，我们可以看出，`setup` 语法糖不仅仅是语法上的简化，更是在编译和实例暴露行为上的精细控制，理解这些差异有助于~~我们在实际开发中更好地使用 Vue.js 3，编写出更安全、可维护的代码。~~ 避免屎山。
