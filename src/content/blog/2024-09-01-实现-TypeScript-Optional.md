---
title: 实现 TypeScript Optional
pubDatetime: 2024-09-01
tags:
  - TypeScript
---

## 前言

假设我们目前有一个 Article 实体类：

```ts
interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  readCount: number;
}
```

```ts
function createArticle(options: Article) {}
```

在这里，我们需要一个创建文章的操作，可是我们创建文章的实体字段并不需要这么多，可能只需要 `title`, `content`, `author` 这三个属性，而 `date`, `readCount` 则是通过 后端 ORM 或着 Redis 去更新：那么，我们可能会将代码修改为下：

```ts
interface Article {
  id?: string;
  title: string;
  content: string;
  author: string;
  date?: Date;
  readCount?: nummber;
}
```

这样子的做法很不规范，因为这里的类型本身就是用来约束实体类，一个 Article 里存在必须存在着这些信息，我们的需求只是在创建文章这里传的某些字段是可选的。于是，想要到在 `Nest.js` 开发中，每个增删改查都要有对应的 DTO，所以也可以在前端创建一个 DTO：

```ts
interface CreateArticleDto {
  title: string;
  content: string;
}
```

这种方式当然可以，但是就会造成重复代码，带来维护上的困难。如果说那一天实体的字段名改变了，或着说实体的字段增加了，都会导致 DTO 对象也跟着维护，一旦忘记了，那么就埋下了隐患。

## 解决方案

我们可以通过一种类似自定义Optional来解决，它接收两个泛型。由于 TypeScript 没有内建 Optional，所以需要我们自己去自定义：

```ts
type CreateArticleDto = Optional<
  Article,
  "author" | "date" | "readCount" | "id"
>;
```

```ts
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

- Omit<T, K> 移出传过来的字段，保留没有传过来的字段

```ts
{
  title: string;
  content: string;
}
```

- Pick<T, K> 则是组成所有可选的字段

```ts
{
  id: string
  author: string
  date: Date
  ...
}
```

- Partial 将 Pick 结果的所有字段转为可选

## 再来一个例子

```ts
interface Todo {
  id: string;
  title: string;
  desc: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

```ts
type CreateTodoDto = Optional<Todo, "id" | "createdAt" | "updatedAt">;
```

```ts
async function createTodo(todo: CreateTodoDto): Promise<Todo[]> {
  return [];
}
```

![](https://s2.loli.net/2024/09/01/cV2LTymMrCZS6d4.png)

## 参考资料

- [TypeScript 高级类型速查表]()
