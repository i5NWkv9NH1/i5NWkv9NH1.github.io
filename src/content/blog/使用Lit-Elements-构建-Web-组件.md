---
title: 使用 Lit & @open-wc 构建 Web Components
pubDatetime: 2024-06-29
description: 使用 Lit & @open-wc 构建 Web Components
featured: false
draft: false
---

> @open-wc 已更新初始化文件模板，文章的代码不具有参考性。正在更新中...
## 前言

在这篇文章里，将一起构建一个 Web 组件，把 Medium 的 RSS 源转化成一系列可以添加到博客或 Web 应用中的预览卡片。

接下来的内容将手把手教你如何用 `Lit` 和 `@open-wc` 来打造既灵活又可扩展的 Web 组件。而且，我们还会探讨如何自动生成组件文档，让文档和代码一样聪明！

准备好了吗？让我们开始这次有趣的旅程吧！


## 为什么不使用 Vue.js、React.js 等前端框架？

**Lit** 的好处在于它专注于 Web Components 标准，这样你能使用原生的浏览器特性而无需依赖额外的框架。它的性能很高，加载速度快，也能轻松与其他技术栈集成。

如果你喜欢纯粹的 Web 技术和更小的打包体积，Lit 是一个非常棒的选择。而 Vue.js 和 React.js 虽然功能强大，但它们各自有自己的生态系统和复杂性，可能不适合那些希望保持简单和标准化的场景。

总之，如果你的目标是尽可能接近原生浏览器性能，同时保持代码简洁，Lit 可能就是你要找的那个小宝贝！


## 动手
```sh
bun x @open-wc/create
```

```sh
✔ What would you like to do today? › Scaffold a new project
✔ What would you like to scaffold? › Web Component
✔ What would you like to add? ›
✔ Would you like to use typescript? › Yes
✔ What is the tag name of your web component? … my-component
```

## Increment 自增组件
~~在 src/MyComponent.ts 文件中，你会看到这样一段代码：~~

```ts
// out of date
/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
```
~~这段注释是为了 `custom-elements-manifest` 提供信息，帮助生成一个 `custom-elements.json` 文件。
这个文件描述了组件的 API 和其他信息，Eleventy 将利用它生成组件的静态文档。~~

- 接着是组件的定义部分：

```ts
// out of date
@customElement('my-element')
export class MyElement extends LitElement {
  // Implementation
}
// new
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class MyComponent extends LitElement {}
```
~~`@customElement('my-element')` 装饰器将 MyElement 类定义为一个自定义元素，名字叫 my-element。这个类继承自 LitElement，使用 Lit 提供的功能来构建组件。~~

- 在样式部分：
```ts
static styles = css`
  :host {
    display: block;
    padding: 25px;
    color: var(--my-component-text-color, #000);
  }
`;
```
这里使用 static styles 属性定义了组件的样式。你还可以使用共享样式、继承、CSS 属性或者创建样式表来进行样式的定义和主题化。

- 对于属性的定义：
```ts
// out of date
@property()
name = 'World';
// new
@property({ type: String }) header = 'Hey there';
@property({ type: Number }) counter = 5;
```
~~`@property()` 装饰器用于定义一个名为 name 的响应式属性。当属性值变化时，组件会重新渲染。这个属性的初始值是 'World'。~~


- 组件的渲染函数如下：

```ts
// out of date
override render() {
  return html`
    <h1>${this.sayHello(this.name)}!</h1>
    <button @click=${this._onClick} part="button">
      Click Count: ${this.count}
    </button>
    <slot></slot>
  `;
}
// new
render() {
  return html`
    <h2>${this.header} Nr. ${this.counter}!</h2>
    <button @click=${this.__increment}>increment</button>
  `;
}
```
render() 函数负责返回组件的模板，它会在每次组件需要更新时被调用。这里使用了 HTML 标签模板字面量来定义组件的结构。@click 事件绑定到 __increment 方法，点击按钮时会触发这个方法。

- 事件处理方法如下：
```ts
// out of date
private _onClick() {
  this.count++;
  this.dispatchEvent(new CustomEvent('count-changed'));
}
// new
__increment() {
  this.counter += 1;
}
```
`__increment` 方法更新了 `counter` 属性，~~并派发了一个 `count-changed` 事件。这让外部可以监听到 `count` 的变化，从而进行相应的处理。~~

~~- 最后，类型声明部分：~~
```ts
// out of date
declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
```
~~这段代码为 TypeScript 提供了 `my-element` 元素的类型定义，使得在 TypeScript 中使用时能够得到正确的类型检查和代码补全。~~


~~在 `dev/index.html` 文件中，创建 `my-element`的实例如下：~~
在 `demo/index.html` 文件中，创建 `my-element` 的实例如下：
// out of date
```html
<script type="module">
  import { html, render } from 'lit';
  import '../dist/src/my-component.js';

  const header = 'Hello owc World!';
  render(
    html`
      <my-component .header=${header}>
        some light-dom
      </my-component>
    `,
    document.querySelector('#demo')
  );
</script>
```

如果需要给 `header` 属性传值，可以这样做：
```html
<script>
const header = 'Hello owc World!';
<my-component .header=${header}>
  some light-dom
</my-component>
</script>
```

这样，`<my-component>` 标签内的内容会被插入到组件模板中的 `<slot>` 标签位置。也就是说，`<h2>` 标签中的内容会显示在组件的 `<slot>` 位置。


## 修改打包配置
~~默认的模板配置将所有打包生成的文件输出到与源代码相同的文件夹，这可能会麻烦。为了打包后输出到 `dist` 文件夹，需要修改 `.eleventy.cjs` 文件。
重新打包后，以下文件将输出到 `dist` 文件夹。~~
默认的所有打包后生成的文件都会输出到 `package` 定义的文件夹中。 

- `.gitignore`
- `dev/index.html`
- `rollup.config.js`
- `tsconfig.json`
- `web-test-runner.config.js`
- `package.json`

```json
"main": "dist/src/index.js",
"module": "dist/src/index.js",
"exports": {
  ".": "./dist/src/index.js",
  "./my-component.js": "./dist/src/my-component.js"
}
```

~~## 重命名组件~~

~~接下来，重命名 `my-component` 组件。请按照以下步骤操作：~~

~~1. **更新代码引用**~~
~~- 将所有代码中的 `MyElement` 修改为 `MediumFeed`。~~
~~- 将模板中的 `my-component` 修改为 `medium-feed`。~~

~~2. **重命名文件**~~
~~- 将 `my-component.ts` 修改为 `medium-card.ts`。~~
~~- 将 `my-component_test.ts` 修改为 `medium-feed_test.ts`。~~

~~你可以通过查看 `diff` 对比来检查更改是否正确。~~

## 需求分析
1. 允许用户指定一个 url，用于 Medium RSS 源的 URL。
2. 使用这个 RSS 源的 URL 来获取 XML 格式的文章集合，并将其转换为 JSON 格式。
3. 将每篇文章映射到一个包含缩略图、标题、正文和页脚的 HTML 卡片中。

```ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * Displays a collection of Medium article cards.
 *
 * @property url - The Medium RSS feed URL
 * @property count - The number of preview cards to display
 */
@customElement('medium-feed')
export class MediumFeed extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
    }
    .card {
      cursor: pointer;
      display: flex;
      background-color: var(--medium-card-background-color, white);
      border: var(--medium-card-border, solid 1px lightgray);
      border-radius: var(--medium-card-border-radius, 3px);
      margin-bottom: 16px;
    }
    .thumbnail img {
      height: var(--medium-thumbnail-height, 220px);
      width: var(--medium-thumbnail-width, 330px);
      border-radius: var(--medium-thumbnail-border-radius, 3px);
      object-fit: cover;
    }
    .right {
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-grow: 1;
    }
    .header h2, .header h3 {
      margin: 0;
    }
    .footer {
      color: var(--medium-footer-color, lightgray);
    }
    .body {
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--medium-body-color);
    }
  `;

  @property({ type: String })
  url = '';

  @property({ type: Number })
  count = 10;

  @state()
  private _posts: MediumPost[] = [];

  override connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  override render() {
    return html`
      ${this._posts.slice(0, this.count).map(post => html`
        <div class="card" @click=${() => this.cardClick(post.link)}>
          <div class="thumbnail">
            <img src="${post.thumbnail}" alt="${post.title}">
          </div>
          <div class="right">
            <div class="header">
              <h2>${post.title}</h2>
              <h3>${post.author}</h3>
            </div>
            <div class="body">
              ${this.trimContent(post.content)}...
            </div>
            <div class="footer">
              ${post.categories.join(' ')}
            </div>
          </div>
        </div>
      `)}
    `;
  }

  private cardClick(url: string) {
    window.open(url, "_blank");
  }

  private async fetchData() {
    try {
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${this.url}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const json = await response.json() as MediumResponse;
      this._posts = json.items;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  private trimContent(content: string) {
    return content
      .split("<p>")
      .slice(3)
      .join('')
      .replace(/<\/?[^>]+(>|$)/g, "")
      .split(' ')
      .slice(0, 32)
      .join(' ');
  }
}

interface MediumPost {
  title: string;
  link: string;
  thumbnail: string;
  categories: string[];
  pubDate: Date;
  creator: string;
  author: string;
  content: string;
}

interface MediumResponse {
  items: MediumPost[];
}

declare global {
  interface HTMLElementTagNameMap {
    'medium-feed': MediumFeed;
  }
}
```

代码里添加了一个注释，给组件做了个简单介绍，还用了 `@customElement` 装饰器，给自定义元素挂上了 className。默认样式搞定了，而通过 CSS 变量加的那些主题化样式，让组件有了更多风格选择。

接下来，给 `URL` 和 `count` 这两个属性赋了点任务。用 `connectedCallback` 钩子从 RSS 源拉取数据，RSS 源能把 XML 变成 JSON，数据就放到组件的状态里了。每篇文章都被装进了一个 HTML 卡片里，看起来就是做了个文章列表。

在两个终端里分别运行 `npm run build:watch` 和 `npm run serve`，等构建完成后，打开终端显示的 URL，通常是 [https://localhost:8000](https://localhost:8000)。

这样，就能看到修改后的成果了。




接下来继续拆分这个组件，提取出缩略图、标题、正文和页脚部分，创建一个通用的卡片组件，然后在 `medium-feed` 组件中使用它。

首先，在 `src` 目录下创建一个名为 `card` 的文件夹。在这个文件夹中，创建一个名为 `medium-card-thumbnail.ts` 的文件，并粘贴以下内容：

```ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Medium card header sub-component
 * @property src - url to use for the thumbnail image
 */
@customElement('medium-card-thumbnail')
export class MediumCardThumbnailElement extends LitElement {
    static override styles = css`
     :host {
        display: flex;
     }
     img {
        height: var(--medium-thumbnail-height, 220px);
        width: var(--medium-thumbnail-width, 330px);
        border-top-left-radius: var(--medium-thumbnail-border-left-radius);
        border-bottom-left-radius: var(--medium-thumbnail-border-left-radius);
        border-top-right-radius: var(--medium-thumbnail-border-right-radius);
        border-bottom-right-radius: var(--medium-thumbnail-border-right-radius);
        object-fit: cover;
     }
     `;

    @property()
    src = '';

    override render() {
        return html`<img src="${this.src}">`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'medium-card-thumbnail': MediumCardThumbnailElement;
    }
}
```

`medium-card-thumbnail` 元素允许使用者指定 `src` 属性的值，这个值会在模板中用来渲染图像。
用 `:host` 选择器来为包含该元素的组件添加样式，并设置 `display: flex`。
`img` 样式中还包含了一些 CSS 属性，
这些属性将用于后续允许使用者覆盖默认样式，从而控制图像角落的圆角和调整缩略图的大小。

在 card 文件夹中，咱们还需要创建一个 medium-card-header.ts 文件。
```ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Medium card header sub-component
 * @property header - larger header
 * @property subheader - smaller header
 */
@customElement('medium-card-header')
export class MediumCardHeaderElement extends LitElement {
    static override styles = css`
        :host {
            flex-grow: 1;
            color: var(--medium-header-color);
        }
        h2, h3 {
            margin: 0;
        }
    `;

    @property()
    header = '';

    @property()
    subheader = '';

    override render() {
        return html`
            <h2>${this.header}</h2>
            <h3>${this.subheader}</h3>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'medium-card-header': MediumCardHeaderElement;
    }
}
```

`medium-card-header` 元素的颜色可以通过 `--medium-header-color` 变量由使用者来设置。`header` 和 `subheader` 属性的值分别会被渲染在 `<h2>` 和 `<h3>` 标签中。

接下来，我们可以创建一个 `medium-card-body` 元素，用来在卡片中显示一段文本。
```ts
 import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
 
 /**
  * Medium card body sub-component
  * @property body - card body text
  */
 @customElement('medium-card-body')
 export class MediumCardBodyElement extends LitElement {
    static override styles = css`
        :host {
            flex-grow: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--medium-body-color);
        }
    `;

     @property()
     body = '';
 
     override render() {
         return html`${this.body}`;
     }
 }
 
 declare global {
     interface HTMLElementTagNameMap {
         'medium-card-body': MediumCardBodyElement;
     }
 }
```

`body` 属性允许用户设置组件的主体内容。`overflow: hidden` 和 `text-overflow: ellipsis` 目前还有些理想化。这些样式还没能做到在 `body` 元素底部截断文本。我们就留给读者自己解决这个问题吧——如果你找到用 CSS 规则控制溢出的办法，请在评论中告诉我们！

接下来，将卡片的最后一个子组件添加到一个新的 `medium-card-footer.ts` 文件中。
```ts
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Medium card footer sub-component
 * @property text - card footer text
 */
@customElement('medium-card-footer')
export class MediumCardFooterElement extends LitElement {

    static override styles = css`
        :host {
            color: var(--medium-footer-color, lightgray);
        }
    `;

    @property()
    footer = '';

    override render() {
        return html`${this.footer}`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'medium-card-footer': MediumCardFooterElement;
    }
}
```

`medium-card-footer` 的内容通过 `footer` 属性设置。和其他子组件一样，`footer` 也接受 `--medium-footer-color` 变量，以便用户可以为其设置主题。组件的其他部分则是之前见过的常规内容。

接下来，我们可以将这些部分组织成一个新的 `medium-card` 组件。
```ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import "./medium-card-header";
import "./medium-card-thumbnail";
import "./medium-card-body";
import "./medium-card-footer";

/**
 * A web component for generic link preview cards
 * @property thumbnail - card's thumbnail image url
 * @property header - larger header to use at the top of the card
 * @property author - smaller header to use at the top of the card
 * @property body - card's body content
 * @property footer - card's footer content
 */
@customElement('medium-card')
export class MediumCardElement extends LitElement {
    static override styles = css`
     :host {
       display: flex;
       background-color: var(--medium-card-background-color, white);
       border: var(--medium-card-border, solid 1px lightgray);
       border-radius: var(--medium-card-border-radius, 3px);
     }
    .right {
        padding: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    medium-card-thumbnail {
        --medium-thumbnail-height: var(--medium-card-height);
        --medium-thumbnail-border-left-radius: var(--medium-card-border-radius);
    }
    medium-card-header {
        --medium-header-color: var(--medium-card-header-color);
    }
    medium-card-body {
        --medium-body-color: var(--medium-card-body-color);
    }
    medium-card-footer {
        --medium-footer-color: var(--medium-card-footer-color);
    }
    `;

    @property()
    thumbnail = '';

    @property()
    header = '';

    @property()
    subheader = '';

    @property()
    body = '';

    @property()
    footer = '';

    override render() {

        return html`
            <div class="left">
                <medium-card-thumbnail .src=${this.thumbnail}></medium-card-thumbnail>
            </div>
            <div class="right">
                <medium-card-header .header="${this.header}" .subheader="${this.subheader}"></medium-card-header>
                <medium-card-body .body="${this.body}"></medium-card-body>
                <medium-card-footer .footer="${this.footer}"></medium-card-footer>
            </div>
     `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'medium-card': MediumCardElement;
    }
}
```

上面的代码片段开始变得有趣了。

我们为组件定义了多个样式和属性。这个组件还接受传递给子组件的多个 CSS 变量值。如果使用者想要为 `medium-card` 实例添加样式，可以通过设置 `--medium-card-header-color`、`--medium-card-body-color`、`--medium-card-footer-color` 等变量的值来实现。这些 CSS 变量的值会传递给子组件，让使用者可以将卡片的主题统一起来。我们的设计还允许使用者组合他们自己的卡片版本，利用可以主题化的子组件作为构建块。

下面是一个示例，展示了使用者如何组合自己的卡片，例如创建一个省略了缩略图的新卡片：
```ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import "./medium-card-header";
import "./medium-card-thumbnail";
import "./medium-card-body";
import "./medium-card-footer";

/**
 * A web component for generic link preview cards
 * @property header - larger header to use at the top of the card
 * @property author - smaller header to use at the top of the card
 * @property body - card's body content
 * @property footer - card's footer content
 */
@customElement('medium-card-no-thumbnail')
export class MediumCardNoThumbnailElement extends LitElement {
    static override styles = css`
    :host {
        display: flex;
        flex-direction: column;
        gap: 1em;
        background-color: var(--medium-card-background-color, white);
        border: var(--medium-card-border, solid 1px lightgray);
        border-radius: var(--medium-card-border-radius, 3px);
        padding: 1em;
    }
    medium-card-header {
        --medium-header-color: var(--medium-card-header-color);
    }
    medium-card-body {
        --medium-body-color: var(--medium-card-body-color);
    }
    medium-card-footer {
        --medium-footer-color: var(--medium-card-footer-color);
    }
    `;

    @property()
    header = '';

    @property()
    subheader = '';

    @property()
    body = '';

    @property()
    footer = '';

    override render() {

        return html`
            <medium-card-header .header="${this.header}" .subheader="${this.subheader}"></medium-card-header>
            <medium-card-body .body="${this.body}"></medium-card-body>
            <medium-card-footer .footer="${this.footer}"></medium-card-footer>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'medium-card-no-thumbnail': MediumCardNoThumbnailElement;
    }
}
```

最后，我们可以重构 `medium-feed` 组件，以利用我们新创建的 `medium-card` 组件。
```ts
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import "../card/medium-card";
import { MediumPost } from './medium-post';

/**
 * Displays a collection of Medium article cards.
 *
 * @property url - The Medium RSS feed url
 * @property count - The number of preview cards to display
 */
@customElement('medium-feed')
export class MediumFeedElement extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }
    medium-card {
      cursor: pointer;
      --medium-card-height: var(--medium-feed-card-height);
      --medium-card-border: var(--medium-feed-card-border);
      --medium-card-border-radius: var(--medium-feed-card-border-radius);
      --medium-card-background-color: var(--medium-feed-card-background-color);
      --medium-card-header-color: var(--medium-feed-card-header-color);
      --medium-card-body-color: var(--medium-feed-card-body-color);
      --medium-card-footer-color: var(--medium-feed-card-footer-color);
    }
  `;

  @property()
  url = '';

  @property({ type: Number })
  count = 10;

  @state()
  private _state: { posts: MediumPost[] } = { posts: [] };

  override connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  override render() {
    return html`${this._state.posts
      .slice(0, this.count)
      .map(post => {
        const header = post.title;
        const subheader = post.author;
        const thumbnail = post.thumbnail;
        const body = `${this.trimContent(post.content)}...`;
        const footer = post.categories.join(' ');
        return html`
          <medium-card 
            .thumbnail="${thumbnail}"
            .header="${header}"
            .subheader="${subheader}"
            .body="${body}"
            .footer="${footer}"
            @click=${() => this.cardClick(post.link)}
          ></medium-card>
          <br>
        `;
      })
    }`;
  }

  private cardClick(url: string) {
    window.open(url, "_blank");
  }

  private async fetchData() {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${this.url}`;
    const response = await fetch(url);
    const json = (await response.json()) as MediumResponse;
    const posts = json.items;

    this._state = { posts };
  }

  private trimContent(content: string) {
    return content
      .split("<p>")
      .splice(3)
      .join('')
      .replace(/<\/?[^>]+(>|$)/g, "")
      .split(' ')
      .slice(0, 32)
      .join(' ');
  }
}

interface MediumResponse {
  items: MediumPost[];
}

declare global {
  interface HTMLElementTagNameMap {
    'medium-feed': MediumFeedElement;
  }
}
```

现在，我们有了一个更简洁的实现，易于理解。再次，我们将多个 CSS 变量传递给子组件，以便进行组件主题化。`connectedCallback` 生命周期钩子用于获取 Medium RSS 源的 XML 并将其转换为 JSON。

内部的 `_state.posts` 属性是一个 `MediumPosts` 数组，我们将每篇文章映射到一个 `medium-card`。使用 `trimContent` 方法来移除文章正文中的所有 HTML 标签，并将内容截断为 32 个单词。卡片正文的开头是从文章的第三段生成的，因为在测试中这个方法效果最好。

不过，上述 `trimContent` 代码段中潜伏着一个 bug，因为并不是所有文章都有三段内容。如果你发现了这个 bug，干得不错！我们将这个问题留给你来修复。

你已经成功构建了一个自定义的、可重用的 Web 组件，可以获取一组 Medium 文章并将它们显示为预览卡片——做得很好！在下一部分，我们将制定测试 Web 组件的策略，并学习一些技巧，帮助我们与其他开发者一起构建更复杂的 Web 组件。


## 测试
测试 Web 组件可能会有点棘手，写出有效的测试需要良好的设计和巧妙的思考。
编写测试是记录功能如何工作的好方法，这样未来的开发者可以更快、更有效地进行迭代。
写得好的测试可以防止回归问题，同时避免重复其他测试中已做的工作。在 Lit Elements 教程的最后一部分，我们将讨论测试策略，回顾 medium-feed 示例中的测试，并深入探讨细节
。
### 基本测试
在上一篇文章中，我们从一个巨大的 Web 组件开始，然后将其拆分成更小的子组件。把这个庞大的组件拆分成小块，帮助我们更好地组织项目。此外，小而封装良好的组件更容易进行测试和理解。作为一个经验法则，如果某个部分难以测试，它可能需要拆分成更小的部分和/或简化一下。

让我们从测试我们的子组件开始。最简单的组件测试是 `medium-card-body`。
```ts
import { MediumCardBodyElement } from '../src';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('medium-card-body', () => {
  test('is defined', () => {
    const el = document.createElement('medium-card-body');
    assert.instanceOf(el, MediumCardBodyElement);
  });

  test('renders with card body with body content', async () => {
    const body = '🧍';
    const el = await fixture(html`<medium-card-body .body="${body}"></medium-card-body>`);
    assert.shadowDom.equal(
      el,
      body
    );
  });

  test('renders card with color from css variable', async () => {
    const color = 'rgb(0, 128, 0)';
    const style = `--medium-body-color: ${color}`;
    const el = (await fixture(html`<medium-card-body style="${style}"></medium-card-body>`)) as MediumCardBodyElement;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).color, color);
  });
});
```
第一个测试创建了一个 `medium-card-body` 组件，并断言它是 `MediumCardBodyElement` 的一个实例。接着，我们设置了 `body` 属性的值，并检查 Shadow DOM 确保 `body` 属性被正确渲染。最后，我们还添加了一个测试，确保如果设置了 `--medium-body-color` CSS 变量，组件的颜色会随之变化。

我们使用 `medium-card-body` 组件的 `style` 属性来注入 CSS 变量的值。为了检查 CSS 变量是否正确连接，我们使用 `getComputedStyle` 函数获取 `color` 属性，并断言它等于通过 `styles` 属性注入的值。

稍微复杂一点的测试策略可以在 `medium-card-header` 的测试中看到。
```ts
import { MediumCardHeaderElement } from '../src';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('medium-card-header', () => {
  test('is defined', () => {
    const el = document.createElement('medium-card-header');
    assert.instanceOf(el, MediumCardHeaderElement);
  });

  test('renders header in h2 tag', async () => {
    const header = '👶';
    const el = await fixture(html`<medium-card-header .header="${header}"></medium-card-header>`);
    assert.shadowDom.equal(
      el,
      `<h2>${header}</h2>
      <h3></h3>
      `
    );
  });

  test('renders subheader in h3 tag', async () => {
    const subheader = '👶';
    const el = await fixture(html`<medium-card-header .subheader="${subheader}"></medium-card-header>`);
    assert.shadowDom.equal(
      el,
      `<h2></h2>
      <h3>${subheader}</h3>
      `
    );
  });

  test('renders header with color from css variable', async () => {
    const color = 'rgb(0, 255, 0)';
    const style = `--medium-header-color: ${color}`;
    const el = (await fixture(html`<medium-card-header style="${style}"></medium-card-header>`)) as MediumCardHeaderElement;
    await el.updateComplete;
    assert.equal(getComputedStyle(el.shadowRoot?.querySelector('h2')!).color, color);
    assert.equal(getComputedStyle(el.shadowRoot?.querySelector('h3')!).color, color);
  });
});
```
在 `medium-card-header` 的测试中，我们检查了组件是否正确地将 `header` 和 `subheader` 的值分别渲染到 `h2` 和 `h3` 标签中。
使用 `querySelector` 函数来获取感兴趣的元素，以便对其属性进行断言。
我们用可选链操作符 `?` 和非空断言操作符 `!` 来告诉 TypeScript 编译器，我们接受对象可能为 `undefined` 的情况。
一旦获取到 `h2` 和 `h3` 元素的引用，我们就可以断言它们的颜色是否与我们通过 `--medium-header-color` 指定的值一致。

### 高级测试
到目前为止，我们已经测试了子组件的属性值是否正确渲染，以及 CSS 变量是否能覆盖组件样式。由于子组件用于构建 `medium-card` 组件，我们需要重点测试这些组件的集成，确保值从父组件正确传递到子组件。

最开始，可能会觉得测试完整渲染的组件树并验证传递给子组件的值是否正确是个好主意。然而，测试渲染的子组件可能会变得复杂，并且我们测试逻辑的很多部分会在父组件和子组件的测试中重复出现。

幸运的是，借助 TypeScript，我们可以避免重复代码，并安全地测试父组件和子组件之间的边界。
```ts
test('renders card with header and subheader', async () => {
  const header = '🧑';
  const subheader = '👶';
  const el = await fixture(html`<medium-card .header="${header}" .subheader="${subheader}"></medium-card>`);
  const headerElement = el.shadowRoot?.querySelector('medium-card-header') as MediumCardHeaderElement;
  assert.equal(headerElement?.header, header);
  assert.equal(headerElement?.subheader, subheader);
});
```

在上面的代码片段中，我们把一个大的测试拆成了两个更小、更有针对性的测试。与其测试完全渲染的 `medium-card` 组件，不如测试到 `medium-card` 及其子元素的边界。这种做法有效，因为我们已经对子组件的实现进行了测试，从而避免了测试之间的逻辑重复。

将一个庞大的集成测试拆解成小的单元测试，达到了防止未来开发者在重命名子组件属性时忘记更新父组件中引用的目标。这种做法确保了当更改子组件的属性名时，会有警告或错误提示，提醒你更新父组件中的引用。

一个具体的测试到 `medium-card` 组件边界的例子可以在 `medium-card-header` 的测试中看到。我们测试了 `medium-card-header` 上的 `header` 属性是否正确设置，并可以确保它们会正确渲染，因为我们已经在单独的测试中验证了 `medium-card-header` 的渲染。

需要注意的是，测试到边界只有在能够利用编译器确保类型安全时才有效。当你在子组件中更改属性名时，需要有一些警告或错误提示，促使你更新父组件中的任何引用。为了确保测试中的类型安全，我们可以使用 `as` 关键字对 `querySelecto


由于 `querySelector` 的结果已正确类型化，更改 `medium-card-header` 中的 `header` 属性为 `title` 会导致编译错误。此外，在 VS Code 中，你可以使用“重命名符号”功能来安全地将所有 `header` 的引用更新为 `title`，从而完全避免这个问题！

现在我们已经彻底测试了 `medium-card` 组件，接下来看看我们的 `medium-feed` 组件吧。


## Spies

我们的 `medium-feed` 组件会通过网络请求从 Medium RSS 源获取数据并填充组件。这个网络请求是通过 `fetch` 进行的，而 `fetch` 是一个异步操作。为了避免测试时进行“真实”的网络请求，因为这样会很慢，而且数据可能会发生变化。

为了不进行真正的网络调用，可以使用 Sinon 的 spy（也就是 stub）来模拟网络请求，并返回伪造的数据。

```ts
import { MediumFeedElement } from '../src/feed/medium-feed.js';
import { assert, fixture, html, waitUntil } from '@open-wc/testing';
import { article } from './article';
import sinon from 'sinon';

suite('medium-feed', () => {
  const url = '🔗';
  const cards = 3;
  let stubbedFetch: sinon.SinonStub;

  setup(() => {
    const response = createFakeResponse(cards);
    stubbedFetch = sinon.stub(globalThis, 'fetch');
    stubbedFetch.returns(Promise.resolve(response));
  });

  teardown(() => {
    stubbedFetch.restore();
  });

  test('gets articles from rss feed', async () => {
    const el = await fixture(html`<medium-feed .url="${url}"></medium-feed>`) as MediumFeedElement;
    await el.updateComplete;
    assert.isTrue(stubbedFetch.calledWith(`https://api.rss2json.com/v1/api.json?rss_url=${url}`));
  });
  
  function createFakeResponse(cards: number) {
    const items = Array.from(Array(cards)).map(() => article);
    return new Response(
      JSON.stringify({
        items
      })
    );
  }
});
```

我们通过导入 `article.ts` 中的文章数据来创建一个假的响应。`fetch` 的实现被替换成了一个 stub，而 `returns` 函数则指示我们的 stub 返回伪造的响应。
这个 stub 还允许通过 `calledWith` 来对调用 `fetch` 时使用的参数进行断言。
测试的生命周期钩子 `setup` 和 `teardown` 被用来在每个测试后创建和销毁 stub，以防止一个测试中对 stub 的修改影响到其他测试。
请注意，根据你使用的测试框架，`setup` 和 `teardown` 可能分别被命名为 `beforeEach` 和 `afterEach`。


## Waiting 异步等待
我们的 `medium-feed` 组件会发起一个异步的网络请求来填充组件的内容，我们必须等到请求完成后才能进行断言。

确保组件在执行断言前是有效的最简单方法是使用 `waitUntil`。

```ts
test('sets all card properties', async () => {
  const el = await fixture(html`<medium-feed .url="${url}"></medium-feed>`) as MediumFeedElement;
  await el.updateComplete;
  await waitUntil(
    () => el.shadowRoot?.querySelectorAll('medium-card').length === cards,
    'Element did not render children',
  );
  const firstCard = el.shadowRoot?.querySelector('medium-card') as MediumCardElement;
  assert.equal(firstCard?.thumbnail, article.thumbnail);
  assert.equal(firstCard?.header, article.title);
  assert.equal(firstCard?.subheader, article.author);
  assert.isNotEmpty(firstCard?.body);
  assert.isNotEmpty(firstCard?.footer);
});
```

`waitUntil` 函数接受一个函数参数，这个函数会持续运行，直到内部条件返回 `true`（也就是一个谓词）。此外，传递给 `waitUntil` 的第二个参数是一个超时消息，如果谓词在超时前没有返回 `true`，就会显示这个消息。在这个示例中，我们使用一个谓词，当渲染的 `medium-card` 数量等于预期的卡片数量时，它会返回 `true`。一旦测试等待了卡片渲染完成，就可以安全地对 fixture 进行断言了。
