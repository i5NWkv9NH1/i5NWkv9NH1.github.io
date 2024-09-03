---
title: TypeScript 高级类型速查表
pubDatetime: 2023-01-21
tags:
  - TypeScript
---

## 交叉类型（Intersection Type）

交叉类型是将多个类型合并为一个的一种方式。这意味着可以合并给定的类型 A 与类型 B 或更多，并得到一个具有所有属性的单一类型。

```ts
type LeftType = {
  id: number;
  left: string;
};

type RightType = {
  id: number;
  right: string;
};

type IntersectionType = LeftType & RightType;

function showType(args: IntersectionType) {
  console.log(args);
}

showType({ id: 1, left: "test", right: "test" });
// 输出：{id: 1, left: "test", right: "test"}
```

如例子所示，IntersectionType 合并了两个类型 - LeftType 和 RightType，并使用 & 符号构建交叉类型。

## 联合类型（Union Type）

联合类型允许在给定变量内部具有不同的类型注释。

```ts
type UnionType = string | number;

function showType(arg: UnionType) {
  console.log(arg);
}

showType("test");
// Output: test

showType(7);
// Output: 7
```

## 泛型（Generic Type）

泛型类型是重用给定类型的一种方式。它能够帮助提示作为参数传递的类型T。

```ts
function showType<T>(args: T) {
  console.log(args);
}

showType("test");
showType<string>("test");
// 输出："test"

showType(1);
showType<number>(1);
// 输出：1
```

现在有一个示例，其中有一个接口GenericType，它接收一个泛型类型T。由于它是可重用的，我们可以先使用字符串调用它，然后再使用数字。

```ts
interface GenericType<T> {
  id: number;
  name: T;
}

function showType(args: GenericType<string>) {
  console.log(args);
}

showType({ id: 1, name: "test" });
// 输出：{id: 1, name: "test"}

function showTypeTwo(args: GenericType<number>) {
  console.log(args);
}

showTypeTwo({ id: 1, name: 4 });
// 输出：{id: 1, name: 4}
```

泛型类型可以接收多个参数。在这里，我们传递了两个参数：T 和 U，然后将它们用作属性的类型注释。也就是说，我们现在可以使用这个接口并提供不同的类型作为参数。

## 工具类型（Utility Type）

TypeScript提供了方便的内置工具类型。若要使用它们，需要将想要转换的类型传入 `<>`​ 内。

- ### Partial<T>

`Partial`​ 允许将类型 `T`​ 的所有属性都变成可选的。它会在每个字段旁边加上一个 ? 号。

```ts
interface PartialType {
  id: number;
  name: string;
}

function showType(args: Partial<PartialType>) {
  console.log(args);
}

showType({ id: 1 });
// 输出: {id: 1}

showType({ name: "sora" });
// 输出: { name: "sora" }
```

如例子所示，将一个 `PartialType`​ 接口用作函数 `showType()`​ 接收的参数的类型注释。为了使属性变为可选，我们必须使用 `Partial`​ 关键字并将类型 `PartialType`​ 作为参数传递。也就是说，现在所有字段都变成了可选的。

- ### Required<T>

与 `Partial`​ 不同，`Required`​ 实用程序会使类型 `T`​ 的所有属性都成为必需的。

```ts
interface RequiredType {
  id: number;
  name?: string;
}

function showType(args: Required<RequiredType>) {
  console.log(args);
}

showType({ id: 1, name: "sora" });
// 输出: { id: 1, name: "sora" }
showType({ id: 1 });
// 错误: 类型 '{ id: number }' 缺少类型 'Required<RequiredType>' 的以下属性: name
```

`Required`​ 类型将使所有属性成为必需的，即使在使用 `required`​ 之前将它们设为 Optional。如果省略属性，TypeScript 将会报错。

- ### Readonly<T>

将转换类型 `T`​ 的所有属性，使它们为**只读**，不能用新值重新分配。

```ts
interface ReadonlyType {
  id: number;
  name: string;
}

function showType(args: Readonly<ReadonlyType>) {
  args.id = 4;
  console.log(args);
}

showType({ id: 1, name: "sora" });
// 错误: 不能分配给 'id'，因为它是只读属性。
```

在这里，我们使用 `Readonly`​ 使 `ReadonlyType`​ 的属性不可重新分配。也就是说，如果为这些字段赋予新值，TypeScript 将会报错。

此外，还可以在属性前面使用关键字 `readonly`​ 使其不可重新分配。

```ts
interface ReadonlyType {
  readonly id: number;
  name: string;
}
```

- ### Pick<T, K>

`Pick`​ 类型能够从现有接口类型中选择其中的某些属性来创建新的类型

```ts
interface PickType {
  id: number;
  name: string;
  age: number;
}

function showType(args: Pick<PickType, "name" | "age">) {
  console.log(args);
}

showType({ name: "sora", age: "24" });
// 输出: {name: "sora", age: 24 }

showType({ id: 3 });
// 错误: 对象字面量只能指定已知属性，而 'id' 在类型 'Pick<PickType, "name">' 中不存在
```

`Pick`​ 与前面的其他工具类型有点不同。它可以传两个参数 - `T`​ 是从中选择元素的类型，`K`​ 是想选择的属性。还可以使用管道符（`|`​）将多个字段选中。

- ### Omit<T, K>

`Omit`​ 与 `Pick`​ 相反，不是选择某个属性的类型，而是从类型 `T`​ 中移除属性 `K`​。

```ts
interface PickType {
  id: number;
  name: string;
  age: number;
}

function showType(args: Omit<PickType, "name" | "age">) {
  console.log(args);
}

showType({ id: 7 });
// 输出: {id: 7}

showType({ name: "sora" });
// 错误: 对象字面量只能指定已知属性，而 'name' 在类型 'Pick<PickType, "id">' 中不存在
```

- ### Extract<T, U>

`Extract`​ 能够通过挑选对两个不同类型都存在的属性来构造一个类型。这一工具类型将从 `T`​ 中提取所有可赋值给 `U`​ 的属性。

```ts
interface FirstType {
  id: number;
  name: string;
  age: number;
}

interface SecondType {
  id: number;
  address: string;
  city: string;
}

type ExtractType = Extract<keyof FirstType, keyof SecondType>;
// 输出: "id"
```

在这里，我们有两种类型，它们都有属性 id。因此，通过使用 `Extract`​ 关键字，我们得到了字段 id，因为它在两个接口中都存在。如果你有多个 shared 字段，Extract 将提取所有相似的属性。

- ### Exclude

与 `Extract`​ 不同，`Exclude`​ 工具类型将通过在两种不同类型中排除已经存在的属性来构造一种类型。它从 `T`​ 中排除所有可赋值给 `U`​ 的字段。

```ts
interface FirstType {
  id: number;
  name: string;
  age: number;
}

interface SecondType {
  id: number;
  address: string;
  city: string;
}

type ExcludeType = Exclude<keyof FirstType, keyof SecondType>;
// 输出: "name" | "age"
```

如例子所示，属性 `name`​ 和 `age`​ 可以分配给 `SecondType`​ 类型，因为 `SecondType`​ 中不存在。通过使用 `Exclude`​ 关键字，我们得到了预期的这些字段。

- ### Record<K, T>

该工具类型能够用给定类型 `T`​ 的一组属性 `K`​ 构建一个类型。在将一个类型的属性映射到另一个类型时，Record在构建对象类型时非常方便。

```ts
interface PersonType {
  id: number;
  name: string;
  age: number;
}

let persons: Record<number, PersonType> = {
  0: { id: 1, name: "sora", age: 24 },
  1: { id: 2, name: "sora_2", age: 25 },
  2: { id: 3, name: "sora_3", age: 26 },
};

// 0: { id: 1, name: "sora", age: 24 },
// 1: { id: 2, name: "sora_2", age: 25 },
// 2: { id: 3, name: "sora_3", age: 26 }
```

在这里，它期望一个数字作为对象的 `key`​ 值，这就是为什么我们在 persons 变量的 `key`​ 值中有 0、1 和 2 的原因。如果使用字符串作为 `key`​ 值，将引发错误。接下来，属性的值由 `PersonType`​ 给出，因此对象具有字段 id、name 和 age。

- ### NonNullable<T>

`NonNullable`​ 允许从类型 `T`​ 中移除 `null`​ 和 `undefined`​。

```ts
type NonNullableType = string | number | null | undefined;

function showType(args: NonNullable<NonNullableType>) {
  console.log(args);
}

showType("test");
// 输出: "test"

showType(1);
// 输出: 1

showType(null);
// 错误: 类型 'null' 的参数不能赋值给类型 'string | number'

showType(undefined);
// 错误: 类型 'undefined' 的参数不能赋值给类型 'string | number'
```

在这里，我们将类型 `NonNullableType`​ 作为参数传递给 `NonNullable`​ ，它从该类型中排除 null 和 undefined 来构造一个新类型。也就是说，如果传递一个 `null`​ 值，TypeScript 将会报错。

> 如果在 tsconfig 文件中添加 --strictNullChecks ，TypeScript 将应用非空规则。

## Mapped Types

`Mapped types`​ 能够将一个现有的类型中将其每个属性转换为新类型。

```ts
type StringMap<T> = {
  [P in keyof T]: string;
};

function showType(arg: StringMap<{ id: number; name: string }>) {
  console.log(arg);
}

showType({ id: 1, name: "sora" });
// 错误: 类型 'number' 不能赋值给类型 'string'。

showType({ id: "testId", name: "This is sora" });
// 输出: {id: "testId", name: "This is sora"}
```

`StringMap<>`​ 将传入的任何类型转换为字符串。也就是说，如果我们在函数 `showType()`​ 中使用它，接收的参数必须是字符串，否则 TypeScript 将会报错。

## Typeof

```ts
function showType(x: number | string) {
  if (typeof x === "number") {
    return `结果为：${x + x}`;
  }
  throw new Error(`数学运算符号不能用于类型： ${typeof x}`);
}

showType("这是个字符串");
// 错误: 数学运算符号不能用于类型：string

showType(7);
// 输出: 结果为： 14
```

如例子所示，有一个普通的 JavaScript 条件语句，它使用 `typeof`​ 检查参数的类型。有了这个条件，很方便地可以用来保护参数类型。

## Instance of

```ts
class Foo {
  bar() {
    return "Hello World";
  }
}

class Bar {
  baz = "123";
}

function showType(arg: Foo | Bar) {
  if (arg instanceof Foo) {
    console.log(arg.bar());
    return arg.bar();
  }

  throw new Error("The type is not supported");
}

showType(new Foo());
// 输出: Hello World

showType(new Bar());
// 错误: 此类型不受支持
```

像之前的例子一样，这也是一个类型保护，它检查参数是否是 Foo 类的一部分，并作对应的处理。

## In

```ts
interface FirstType {
  x: number;
}
interface SecondType {
  y: string;
}

function showType(arg: FirstType | SecondType) {
  if ("x" in arg) {
    console.log(`属性 ${arg.x} 存在`);
    return `属性 ${arg.x} 存在`;
  }
  throw new Error("不应出现此类型");
}

showType({ x: 7 });
// 输出: 属性 7 存在

showType({ y: "ccc" });
// 错误: 不应出现此类型
```

`in`​ 运算符能够检查接传入的对象上是否存在属性 `x`​。

## Conditional Types

`Conditional Types`​ 能够检测两种类型并根据该测试的结果选择其中一种。

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

`NonNullable`​ 工具类型的此示例检查类型是否为 null，并根据此情况处理它。如例子所示，使用到了 JavaScript 三元运算符。

‍
