# TreeClass 工具类

TreeClass 是一个用于处理树形数据操作的工具类，提供了从平面数据创建树形结构、按键分组数据以及跨树节点聚合值的方法。

## 基础使用

```typescript
import { TreeClass } from 'agglo-tree-table';

// 创建 TreeClass 实例
const treeClass = new TreeClass();

// 使用 creatTreeData 方法从平面数据创建树形结构
treeClass.creatTreeData(dataSource, groupKeys, rowKey, expandDataIndex);
```

## API 说明

### TreeClass 构造函数

创建一个新的 TreeClass 实例。

```typescript
const treeClass = new TreeClass();
```

### 属性

#### treeData

存储生成的树形数据结构。

- 类型: `DataTreeType[]`

### 方法

#### creatTreeData

从平面数据源创建树形数据。

```typescript
creatTreeData(
  dataSource: Array<Record<string, any>>,
  keys: string[],
  rowKey: string,
  expandDataIndex: string
): void
```

**参数说明：**
- `dataSource`: 平面数据数组
- `keys`: 用于分组的键数组，按层级顺序排列
- `rowKey`: 唯一行键字段名
- `expandDataIndex`: 展开数据索引字段名

#### addTree

添加带聚合的树形数据。

```typescript
addTree(
  aggregateKeys: {
    addkeys?: string[];
    addBNkeys?: string[];
    equalKeys?: string[];
  },
  sort: (a: any, b: any) => number = () => 1
): DataTreeType | DataTreeType[]
```

**参数说明：**
- `aggregateKeys`: 聚合键配置对象
  - `addkeys`: 使用简单加法求和的键数组
  - `addBNkeys`: 使用 BigNumber 精确计算求和的键数组
  - `equalKeys`: 仅当所有子项值相等时才显示的键数组
- `sort`: 排序函数，默认为返回1的函数

#### addTreeData

递归聚合树形数据的核心方法。

```typescript
addTreeData(
  tree: DataTreeType[],
  aggregateKeys: { addkeys?: string[]; addBNkeys?: string[]; equalKeys?: string[] },
  treeItem?: DataTreeType,
  sort: (a: any, b: any) => number = () => 1
): DataTreeType | DataTreeType[]
```

**参数说明：**
- `tree`: 树形数据数组
- `aggregateKeys`: 聚合键配置对象
- `treeItem`: 树项（可选）
- `sort`: 排序函数

## 使用示例

### 基本用法

```typescript
import { TreeClass } from 'agglo-tree-table';

// 示例数据
const dataSource = [
  { id: 1, category: '电子产品', brand: '苹果', product: 'iPhone', price: 8000 },
  { id: 2, category: '电子产品', brand: '苹果', product: 'iPad', price: 5000 },
  { id: 3, category: '电子产品', brand: '华为', product: '手机', price: 4000 },
  { id: 4, category: '服装', brand: '耐克', product: '运动鞋', price: 800 },
];

// 创建 TreeClass 实例
const treeClass = new TreeClass();

// 按 category 和 brand 分组创建树形结构
treeClass.creatTreeData(dataSource, ['category', 'brand'], 'id', 'expand');

// 聚合数据
const aggregatedTree = treeClass.addTree({
  addkeys: ['price'], // 使用简单加法聚合 price 字段
});

console.log(aggregatedTree);
```

### 使用 BigNumber 精确计算

```typescript
import { TreeClass } from 'agglo-tree-table';

const treeClass = new TreeClass();
treeClass.creatTreeData(dataSource, ['category'], 'id', 'expand');

// 使用 BigNumber 精确计算聚合
const aggregatedTree = treeClass.addTree({
  addBNkeys: ['price'], // 使用 BigNumber 精确计算 price 字段
});

console.log(aggregatedTree);
```

### 使用 equalKeys

```typescript
import { TreeClass } from 'agglo-tree-table';

const treeClass = new TreeClass();
treeClass.creatTreeData(dataSource, ['category'], 'id', 'expand');

// 仅当所有子项的 currency 字段值相等时才显示该值
const aggregatedTree = treeClass.addTree({
  equalKeys: ['currency'], // 仅当所有子项 currency 相等时才显示
  addkeys: ['price'],
});

console.log(aggregatedTree);
```

## 类型定义

### DataTreeType

树形数据结构的类型定义。

```typescript
interface DataTreeType extends Record<string, any> {
  expandDataIndex?: string | number; // 展开数据索引
  children?: DataTreeType[];         // 子节点
}
```

## 在 AggloTreeTable 中的使用

TreeClass 主要在 AggloTreeTable 组件内部使用，用于处理数据分组和聚合：

```tsx
import React from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

const MyComponent = () => {
  const dataSource = [
    // ... 数据
  ];
  
  const columns = [
    // ... 列定义
  ];

  return (
    <AggloTreeTable
      columns={columns}
      dataSource={dataSource}
      groupKeys={['category', 'brand']} // 分组键
      rowKey="id"
      AggregateKeys={{
        addkeys: ['quantity'],      // 简单加法聚合
        addBNkeys: ['price'],       // BigNumber 精确计算聚合
        equalKeys: ['currency'],    // 相等值显示
      }}
    />
  );
};

export default MyComponent;
```

TreeClass 会自动处理数据转换，将平面数据转换为树形结构，并根据 AggregateKeys 配置进行相应的聚合计算。