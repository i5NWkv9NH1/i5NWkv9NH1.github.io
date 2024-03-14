---
title: 使用 Vite.js 和 Vue.js 构建一个 UI 库
pubDatetime: 2024-01-22
description: 使用 Vite.js 和 Vue.js 构建一个 UI 库
featured: false
draft: false
---

## 前言

在管理多个 Vue.js 后台应用并追求 UI 一致性的过程中，你或许会发现，需要一个组件库。当我首次尝试创建一个 Vue.js 组件库时，我花费了大量时间查询外网来寻找一个满足所有需求且不太复杂的设置。如果当时有一篇类似的文章，那会为我节省大量精力，避免我亲自去应对这些繁琐的问题。我希望这篇文章能像我当初希望的那样，对你有所帮助。

本文将介绍如何设置和发布一个 Vue.js UI 组件库，~~包括配置构建流程以及将你的包发布到 npm，以便你或其他人能够轻松使用~~。**在配置方面，我尽量保持简单和简洁，尽可能使用默认设置**。当你完成所有步骤后，你就能像安装其他 npm 包一样，轻松地在项目中安装属于你的 UI 组件库。

```html
# 如果你使用的是 npm npm install @[your_npm_username]/[library_name] #
这里我使用的是 bun bun install @sora/vue-ui
```

```tsx
# 在你的组件中这样使用它
import { SBtn } from '@sora/vue-ui'

export default defineComponent({
	name: 'Test',
	setup() {
		return () => <SBtn variant={'outlined'}>Button</SBtn>
	}
})
```

## 在开始之前

### 包管理器和项目名称

在这篇文章中，我们使用的包管理器是 `bun`​。如果你使用的是 npm、yarn 或者 pnpm，运行命令的方式都是一样的，只需要将 CLI 替换成你所使用的包管理器即可。另外，项目的名称是 `@sora/vue-ui`​，你可以换为你想要的项目名称。

### Tree shakeable

最重要的一点是完全地 **Tree shaking**，如果你不知道它，那么可以了解 [MDN 这篇文章](https://developer.mozilla.org/zh-CN/docs/Glossary/Tree_shaking)，当导入一个组件时，它只会导入到需要用到的 JavaScript 代码和 CSS 文件，减少了项目依赖，优化项目性能。

### Scss 预处理器

组件的样式使用的是 `scss`​ 的语法，在打包时，`vite`​会把这些 scss 代码转为普通的 `css`​ 样式表。

### TypeScript

虽然本文使用到的是 TypeScript，但打包之后还是 JavaScript 文件，只不过是添加了对应的类型声明，在普通的 JavaScript 项目中依然可以使用。

## 创建 Vite 项目

如果你之前没有使用过 Vite，可以把它看作是 `npm create vue@latest`​ 的替代品。只需运行几个命令，你就可以准备好开始了。

```sh
 bun create vite@latest
✔ Project name: … vue-ui
✔ Select a framework: › Vue
✔ Select a variant: › Customize with create-vue ↗ - 自定义项目依赖

Vue.js - The Progressive JavaScript Framework

✔ 是否使用 TypeScript 语法？ … 否 / 是				- 是
✔ 是否启用 JSX 支持？ … 否 / 是                       - 是
✔ 是否引入 Vue Router 进行单页面应用开发？ … 否 / 是 	- 否
✔ 是否引入 Pinia 用于状态管理？ … 否 / 是              - 否
✔ 是否引入 Vitest 用于单元测试？ … 否 / 是？  > 		- 是
✔ 是否要引入一款端到端（End to End）测试工具？ › 		- 不需要
✔ 是否引入 ESLint 用于代码质量检测？ … 否 / 是			- 是
✔ 是否引入 Prettier 用于代码格式化？ … 否 / 是			- 否

正在构建项目 /home/sora/sources/vue-ui...

项目构建完成，可执行以下命令：

  cd vue-ui
  npm install
  npm run dev
```

按照 Vite 的 CLI 提供的选项进行选择，这里需要用到的是 TypeScript 语法、JSX 支持、Vitest 单元测试和 ESLint。至此，项目创建完成。

## 进行一次 Git 提交

创建完项目初始化并定期提交 Git 是一个很好的习惯，在以后可能会出现 Bug 时可以回溯代码。

```sh
git init
git config --local user.name 'YOUR_USER_NAME'
git config --local user.email 'YOUR_EMAIL'

git add .
git commit -m "feat: setup vue ui library project"
# 如果有 git-flow
git flow init -d
```

## 基本的构建设置

现在你可以运行 `bun dev`​ 并浏览到 Vite 提供的URL。在开发 UI 库时，这是一个你可以轻松导入你的 UI 库并实际看到你的组件的地方。将src文件夹中的所有代码视为你的演示页面，

而实际的 UI 库代码将保存在另一个文件夹中。

现在创建这个文件夹并命名为 `lib`​。你也可以取不同的名字，但 `lib`​ 算是一个共识。

你的 UI 库的主要入口点将是 `lib`​ 文件夹中的一个名为 `main.ts `​的文件。在安装库时，你可以导入从这个文件中导出的所有内容。

```tree
# 在创建项目之后

+ ├── lib
+ │   └── main.ts
├── src
│   ├── ...
├── vite.config.ts
└── vitest.config.ts
```

## Vite Library Mode

此时，如果你使用 `bun run build`​ 构建项目，Vite 将把 src 文件夹内的代码转译到 dist 文件夹中。这是 Vite 的默认行为。

目前，你只会将演示页面用于开发目的，所以还没有必要打包项目的这部分。相反，你希望打包和发布 lib 文件夹内的代码。

这就是 Vite 的 **Library Mode** 发挥作用的地方。它专门设计用于构建库。要使用此模式，只需在vite.config.ts中指定你的库入口点。

```ts
+ import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
+  build: {
+    lib: {
+      entry: resolve(__dirname, 'lib/main.ts'),
+      formats: ['es']
+    }
  }
})
```

默认的格式是 `es`​ 和 `umd`​。对于组件库而言，只需要 `es`​。这也避免了添加 `name`​ 属性的必要。

> 如果在 VSCode中，你的 TypeScript linter 对 `path`​ 和 `__dirname`​ 报错，只需安装 ：`bun add -D @types/node`​。

### TypeScript 和 Library Mode

尽管需要为 `src`​ 和 `lib`​ 文件夹都启用 `TypeScript`​ ，但在构建 UI 库时最好不包含 `src`​。

为了确保在构建过程中只包含 `lib`​ 目录，你可以创建一个专门用于构建的单独的 `TypeScript`​ 配置文件。

> 使用单独的配置文件有助于避免在 demo 页面上直接从 `dist`​ 文件夹导入组件时出现 `TypeScript`​ 错误，因为这些组件尚未构建。

```tree
@sora/vue-ui
├── tsconfig.app.json
+ ├── tsconfig.build.json
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.vitest.json
├── vite.config.ts
└── vitest.config.ts
```

唯一的区别是构建配置仅包含 lib 目录，而默认配置包含 lib 和 src 两个目录。

```json
// tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  },
  "include": ["lib/**/*"]
}
```

为了在构建时使用 `tsconfig.build.json`​，你需要在 `package.json`​ 中的构建脚本中将配置文件传递给 `tsc`​：

```json
  "scripts": {
    …
    "build": "run-p type-check \"build-only {@}\" --",
+    "build-lib": "tsc --p ./tsconfig-build.json && vite build",
```

现在可以再次执行 `bun run build`​​，然后在你的 `dist `​​文件夹中看到以下内容：

```sh
bun run build                                                                                                                                            08:34:39
$ run-p type-check "build-only {@}" --
$ vue-tsc --build --force
$ vite build
vite v5.1.4 building for production...
✓ 1 modules transformed.
dist/vue-ui.js  0.07 kB │ gzip: 0.08 kB
✓ built in 71ms
```

```sh
# tree dist                                                                                                                             08:35:03
dist
├── favicon.ico
└── vue-ui.js

0 directories, 2 files
```

> 默认情况下，输出文件的名称与 package.json 中的 name 属性相同。这可以在 Vite 配置中更改（build.lib.fileName）。

文件 `vite.svg`​ 在你的 `dist`​ 文件夹中，因为 `Vite`​ 会将 `public`​ 目录中的所有文件复制到输出文件夹。让我们禁用这个行为：

```json
build: {
+  copyPublicDir: false,
…
}
```

### 构建 TypeScript 类型声明

由于这是一个 包含 TypeScript 的 UI 库，你可能还希望将类型定义随包一起发布。刚好有一个 Vite 插件可以做到这一点：`vite-plugin-dts`​​。

```sh
bun add -D vite-plugin-dts
```

默认情况下，`vite-plugin-dts`​ 将为 `src`​和 `lib`​ 生成类型定义，因为这两个文件夹都包含在项目的 `.tsconfig`​ 中。这就是为什么我们需要传递一个配置参数：`include: ['lib']`​。

> 在 `exclude`​ 选项中添加 `['src]`​ 也排除掉生成该文件下的类型定义。

```ts
// vite.config.ts
+import dts from 'vite-plugin-dts'
…
  plugins: [
    vue(),
    vueJsx(),
+   dts({
+       include: ['lib'],
+       exclude: ['src']
    }),
  ],
…
```

测试一下，在 UI 库中添加一些实际的代码。打开 `lib/main.ts`​ 并写几个导出函数，例如：

```ts
export function SBtn(color: string): string {
  return color;
}
export function SIcon(name: string): string {
  return name;
}
```

然后运行 `bun run build`​ 来打包你的代码。如果你的 `dist`​ 文件夹的内容看起来像下面这样，那么已经准备好了 🥳：

```sh
bun run build
$ run-p type-check "build-only {@}" --
$ vue-tsc --build --force
$ vite build
vite v5.1.4 building for production...
✓ 1 modules transformed.

[vite:dts] Start generate declaration files...
dist/vue-ui.js  0.10 kB │ gzip: 0.09 kB
[vite:dts] Declaration files built in 2253ms.

✓ built in 2.49s
```

```sh
# tree dist                                                                                                                             08:35:03
dist
├── main.d.ts
└── vue-ui.js

0 directories, 2 files
```

## 一个没有组件的 UI 库算什么呢？

我们做的这些不仅仅是为了导出 `SBtn`​ 和 `SIcon`​ 这两个函数，所以给 UI 库添加一些实质性的东西。

创建三个非常常见的基本组件：一个按钮、一个标签和一个文本输入框。

```sh
lib
├── components
│   ├── index.ts
│   ├── SBtn
│   │   ├── index.ts
│   │   └── SBtn.tsx
│   ├── SInput
│   │   ├── index.ts
│   │   └── SInput.tsx
│   └── SLabel
│       ├── index.ts
│       └── SLabel.tsx
└── main.ts

4 directories, 8 files
```

以及这些组件的一个非常基本的实现：

```tsx
// SBtn/SBtn.tsx
import type { PropType } from "vue";
import { computed, defineComponent, renderSlot } from "vue";
import "./SBtn.scss";

export type ButtonSize = "x-large" | "large" | "default" | "small" | "x-small";

export const SBtn = defineComponent({
  name: "SBtn",
  props: {
    size: {
      type: String as PropType<ButtonSize>,
      default: "default",
    },
    text: {
      type: String as PropType<string | undefined>,
      required: false,
    },
  },
  setup(props, { slots }) {
    const useClass = computed(() => [`s-btn`, `s-btn--${props.size}`]);
    return () => (
      <button class={useClass.value}>
        {slots.default ? renderSlot(slots, "default") : props.text || ""}
      </button>
    );
  },
});

// SBtn/index.ts
export * from "./SBtn";
```

```tsx
// SInput/SInput.tsx
import { type PropType, defineComponent, ref, watch } from "vue";
import "./SInput.scss";

export const SInput = defineComponent({
  name: "SInput",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String as PropType<string>,
      required: false,
    },
  },
  setup(props, { emit }) {
    const modelValue = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (modelValue.value = props.modelValue)
    );
    watch(modelValue, () => emit("update:modelValue", modelValue.value));

    return () => (
      <input
        class="s-input"
        v-model={modelValue.value}
        placeholder={props.placeholder}
      />
    );
  },
});

// SInput/index.ts
export * from "./SInput";
```

```tsx
// SLabel/SLabel.tsx
import { type PropType, defineComponent } from "vue";
import "./SLabel.scss";

export const SLabel = defineComponent({
  name: "SLabel",
  props: {
    text: {
      type: String as PropType<string | undefined>,
      required: false,
    },
  },
  setup(props) {
    return () => <label class="s-label">{props.text || ""}</label>;
  },
});

// SLabel/index.ts
export * from "./SLabel";
```

最后，从主文件 `main.ts`​ 中导出这些组件：

```ts
// lib/components/index.ts
import * as components from "./components";
import * as compoables from "./composables";

export function createVueUI(options: any) {
  return options;
}

export { components, compoables };
```

如果你再次运行 `bun run build`​，你会注意到转译后的文件 `vue-ui.js`​ 现在有 52kb ！

```sh
bun run build                                                                                                                                            09:02:03
$ run-p type-check "build-only {@}" --
$ vue-tsc --build --force
$ vite build
vite v5.1.4 building for production...
✓ 16 modules transformed.

[vite:dts] Start generate declaration files...
dist/vue-ui.js  52.38 kB │ gzip: 16.81 kB
[vite:dts] Declaration files built in 1273ms.

✓ built in 2.49s
```

上面的组件实现包含了 `Vue.js`​ 代码，因此 Vue.js 的代码也会被打包。由于这个 UI 库在已经安装了 Vue.js 的项目中使用（即其他项目使用此 UI 库时需要先安装 Vue.js），你可以将这些依赖项外部化，从打包配置中移除 Vue.js 依赖：

```ts
//vite.config.ts
+ rollupOptions: {
+   external: ['vue'],
+   output: {
+     globals: {
+       vue: 'Vue',
+     },
+   },
+ },
```

重新打包之后，体积相较之前有了很大的压缩，只有 1.16 kb。

```sh
bun run build                                                                                                                                            09:02:47
$ run-p type-check "build-only {@}" --
$ vue-tsc --build --force
$ vite build
vite v5.1.4 building for production...
✓ 11 modules transformed.

[vite:dts] Start generate declaration files...
dist/vue-ui.js  1.16 kB │ gzip: 0.51 kB
[vite:dts] Declaration files built in 1489ms.

✓ built in 1.96s
```

## 添加样式

如开头所述，这个库将使用 `SCSS`​ 预处理器来为组件添加样式。 Vite 默认只支持 `CSS`​ ，需要额外安装 `SCSS`​：

```sh
bun add -D sass
```

```sh
# tree lib
lib
├── components
│   ├── index.ts
│   ├── SBtn
│   │   ├── index.ts
│   │   ├── SBtn.scss
│   │   └── SBtn.tsx
│   ├── SInput
│   │   ├── index.ts
│   │   ├── SInput.scss
│   │   └── SInput.tsx
│   └── SLabel
│       ├── index.ts
│       ├── SLabel.scss
│       └── SLabel.tsx
└── main.ts

4 directories, 11 files
```

之后，为几个组件添加你想要的样式：

```scss
// SBtn/SBtn.scss
$size: 36px;
$border-opacity: 0.12;

.s-btn {
  padding: 1rem;
  align-items: center;
  border-radius: 4px;
  display: inline-grid;
  grid-template-areas: "prepend content append";
  grid-template-columns: max-content auto max-content;
  font-weight: 500;
  justify-content: center;
  letter-spacing: 0.0892857143em;
  line-height: normal;
  max-width: 100%;
  outline: none;
  position: relative;
  text-decoration: none;
  text-indent: 0.0892857143em;
  text-transform: uppercase;
  transition-property: box-shadow, transform, opacity, background;
  transition-duration: 0.28s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  vertical-align: middle;
  flex-shrink: 0;
  border-color: rgba(0, 0, 0, $border-opacity);
  border-style: solid;
  border-width: 0;

  &--x-small {
    min-width: 36px;
    height: 20px;
    padding: 0 8px;
    font-size: 0.625rem;
  }
  &--small {
    min-width: 50px;
    height: 28px;
    padding: 0 12px;
    font-size: 0.75rem;
  }
  &--default {
    min-width: 64px;
    height: 36px;
    padding: 0 16px;
    font-size: 0.875rem;
  }
  &--large {
    min-width: 78px;
    height: 44px;
    padding: 0 20px;
    font-size: 1rem;
  }
  &--x-large {
    min-width: 92px;
    height: 52px;
    padding: 0 24px;
    font-size: 1.125rem;
  }
}
```

```scss
// SInput/SInput.scss
.s-input {
  padding: 1rem;
}
// SLabel/SLabel.scss
.s-label {
  padding: 1rem;
}
```

别忘了，样式文件还需要在 `tsx`​ 文件中引入，不然无法生效：

```scss
// SBtn/SBtn.tsx
+ import './SBtn.scss'

import type { PropType } from 'vue'
...
```

### 打包样式

在对 UI 库打包之后，你会注意到在 dist 文件夹中有一个新文件：

```sh
# tree dist
dist
├── main.d.ts
+  ├── style.css
└── vue-ui.js

0 directories, 3 files
```

但这个文件有两个问题：

1. 你需要在使用该 UI 库的项目中手动导入该文件。

2. 它是一个包含所有组件样式的文件。

#### 带着 CSS 一起打包

虽然在原组件中我们直接导入了样式文件，但打包后，CSS 文件并没有在组件 Javascript 代码中导入。

```ts
// dist/vue-ui.js
import { defineComponent as l, computed as r, createVNode as n, ref as o, watch as a, withDirectives as i, vModelText as m } from "vue";
const c = /* @__PURE__ */ l({
  name: "SBtn",
  props: {
    size: {
      type: String,
      default: "default"
    },
    text: {
      type: String,
      required: !1
    }
  },
  setup(e) {
    const u = r(() => ["s-btn", `s-btn--${e.size}`]);
    return () => n("button", {
      class: u.value
    }, [e == null ? void 0 : e.text]);
  }
})
....
```

因此，在实际应用场景中，`CSS`​ 文件应该是单独生成的，允许其他开发者决定如何处理该文件。

但是，如果我们假设使用该 UI 库的项目，有可以处理 CSS 导入的 bundle 配置呢？为了使样式文件能够生效，打包之后的 JavaScript bundle 必须包含对 CSS 文件的导入。

此时，我们使用另一个 Vite 插件 `vite-plugin-lib-inject-css`​ 来实现我们需要的功能，而且无需任何配置。

```sh
bun add -D vite-plugin-lib-inject-css
```

运行打包命令，之后查看 `dist/vue-ui.js`​ 的顶部代码。如下所示：对 UI 库打包之后，css 文件成功被导入了。

```js
// dist/vue-ui.js
import "./main.css";
…
```

> 你可能会注意到 CSS 文件的文件名已经从 `style.css`​ 更改为 `main.css`​。这种变化发生是因为插件为每个 JavaScript 块生成一个单独的 CSS 文件，而在这种情况下，每个打包后的文件名称取决于配置文件中 entry 的文件名。

#### 拆分 CSS

但仍然存在第二个问题：当你从你的 UI 库中导入组件时，`main.css`​ 也被导入，所有的CSS样式都会进入你的项目。即使你只导入了 `Button`​ 组件。`libInjectCSS`​ 插件为每个块生成一个单独的 CSS 文件，并在每个块的输出文件开头包含一个 import 语句。

所以，如果你将 JavaScript 代码拆分开来，最终会得到单独的 CSS 文件，只有在导入相应的 JavaScript 文件时才会被导入。

做到这一点的一种方法是将每个文件转换为 Rollup 的入口点。而且，**Rollup 文档中正好有一种推荐的方法：**

> 如果你想将一组文件转换为另一种格式，同时保留文件结构和导出命名，推荐的方式是将每个文件转换为一个 entry，而不是使用 output.preserveModules ，因为后者可能会对由插件创建的虚拟文件进行 Tree shaking。

所以让我们将这个配置添加到你的配置中。

首先安装 glob，因为在前端工程化中，需要用它来匹配、查找并处理各种后缀的文件。

```sh
bun add -D glob
```

然后将你的 Vite 配置更改为这样：

```ts
// vite.config.ts
// vite.config.ts
-import { resolve } from 'path'
+import { extname, relative, resolve } from 'path'
+import { fileURLToPath } from 'node:url'
+import { glob } from 'glob'
…
    rollupOptions: {
	  external: ['vue'],
+     input: Object.fromEntries(
+       glob.sync('lib/**/*.{ts,tsx}').map(file => [
+         // The name of the entry point
+         // lib/nested/foo.ts becomes nested/foo
+         relative(
+           'lib',
+           file.slice(0, file.length - extname(file).length)
+         ),
+         // The absolute path to the entry file
+         // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
+         fileURLToPath(new URL(file, import.meta.url))
+       ])
+     )
    }
…
```

> Glob 帮助你指定一组文件名。在这种情况下，它选择所有以 .ts 结尾的文件。 [Glob Wikipedia]()

现在你在 dist 文件夹的根目录下有一堆 JavaScript 和 CSS 文件。虽然它可以正常跑动，但文件名看起来并不是特别美观，是吧？ ~~（强迫症~~

```sh
# tree dist
dist
├── main.d.ts
├── SBtn.css
├── SInput.css
├── SLabel.css
├── vue-ui2.js
├── vue-ui3.js
└── vue-ui.js

0 directories, 7 files
```

对 Vite 的配置进行修改：

```ts
// vite.config.ts
    rollupOptions: {
…
+     output: {
+       assetFileNames: 'assets/[name][extname]',
+       entryFileNames: '[name].js',
+     }
    }
…

```

再次打包 UI 库，现在所有的 JavaScript 文件应该都在 lib 中创建，并且有相同的组织文件夹结构和连同它们的类型定义。而 CSS 文件则在 `assets`​ 的新文件夹中。

> 注意，主入口文件的名称已从 `vue-ui.js`​ 更改为 `main.js`​。

## 发布包前的最后几个步骤

现在已经准备好了，只需在发布包之前考虑一些事项。 package.json 文件将与你的包文件一起发布，你需要确保它包含有关包的所有重要信息。

### Main file

每个 npm 包都有一个主要入口点，默认情况下，该文件位于包的根目录下的 index.js 中。

你的 UI 库的主入口点现在位于 dist/main.js，所以这需要在你的 package.json 中设置。对于类型入口点也是一样的：dist/main.d.ts

```json
// package.json
{
  "name": "@spra/vue-ui",
  "private": true,
  "version": "0.0.0",
  "type": "module",
+ "main": "dist/main.js",
+ "types": "dist/main.d.ts",
  …
```

### 定义要发布的文件

你还应该定义哪些文件应该打包到你的分发包中。

```json
// package.json
  …
  "main": "dist/main.js",
  "types": "dist/main.d.ts",
+ "files": [
+   "dist",
+   "dist/components",
+   "dist/composables"
+ ],
  …
```

### 依赖项

现在看看 UI 库的依赖项，应该只有一个 Vue.js 以及几个 devDependencies。

你也可以将这两个移到 devDepedencies 中。并额外将它们添加 为peerDependencies，以便使用此 UI 库的开发者知道它必须依赖 Vue.js。

```json
// package.json
- "dependencies": {
+ "peerDependencies": {
     "vue": "^3.4.15"
  },
  "devDependencies": {
+    "vue": "^3.4.15"
    …
  }
```

## 副作用

为了防止其他使用此 UI 库的项目的 tree-shaking 意外删除 CSS 文件，你还应该将生成的 CSS 指定为 Side effects，

```json
// package.json
"sideEffects": [
  "**/*.css"
],
```

### 确保已经打包

你可以使用 npm 钩子函数 prepublishOnly 来确保在发布包之前，对代码的更改进行一次打包：

```json
// package.json
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    …
+   "prepublishOnly": "bun run build"
```

## Demo 页面和部署

如果只是在 demo 页面上测试组件，你可以直接从你项目的根目录导入组件。这是因为你的 `package.json`​ 指向了转译后的主文件 `dist/main.ts`​。

```tsx
// App.tsx
import { defineComponent, ref, watch } from "vue";
import { SBtn, SInput, SLabel } from "../";

export default defineComponent({
  name: "App",
  setup() {
    const text = ref("Text");
    watch(text, () => {
      // eslint-disable-next-line no-console
      console.log("updated from App.tsx", text.value);
    });

    return () => (
      <div id="app">
        <SBtn size="large">Button</SBtn>
        <SInput v-model={text.value} placeholder="input text here..." />
        <SLabel text="label" />
      </div>
    );
  },
});
```

要发布你的包，你只需要运行 npm publish。如果你想将你的包发布到公共仓库，你必须在你的 package.json 中设置 private: false。

你可以阅读更多关于如何在 npm 发布包，包括在本地项目中安装它等相关的文章。

## 更多阅读

- [Publish/install your package](Publish/install%20your%20package)

- [Automatically publish you package with GitHub actions](https://dev.to/receter/automatically-publish-your-node-package-to-npm-with-pnpm-and-github-actions-22eg)

‍
