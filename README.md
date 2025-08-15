# AggloTreeTable Component

[![NPM version](https://img.shields.io/npm/v/agglo-tree-table.svg?style=flat)](https://npmjs.org/package/agglo-tree-table)
[![NPM downloads](http://img.shields.io/npm/dm/agglo-tree-table.svg?style=flat)](https://npmjs.org/package/agglo-tree-table)

A React tree table component with aggregation capabilities for financial data | 一个支持金融数据聚合功能的 React 树形表格组件

## 🏗 安装

```bash
# 使用 npm
npm install agglo-tree-table

# 使用 yarn
yarn add agglo-tree-table

# 使用 pnpm
pnpm install agglo-tree-table
```

## 🔨 快速开始

```tsx
import React from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

const data = [
  {
    id: '1',
    name: 'Apple Inc.',
    contract: 'AAPL',
    pv: 10000,
    delta: 500,
  },
  {
    id: '2',
    name: 'Apple Inc.',
    contract: 'AAPL',
    pv: 15000,
    delta: 750,
  },
  {
    id: '3',
    name: 'Microsoft Corp.',
    contract: 'MSFT',
    pv: 20000,
    delta: 1000,
  },
];

const columns = [
  {
    title: 'Instrument',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'Contract',
    dataIndex: 'contract',
    width: 100,
  },
  {
    title: 'PV',
    dataIndex: 'pv',
    width: 120,
  },
  {
    title: 'Delta',
    dataIndex: 'delta',
    width: 120,
  },
];

export default () => (
  <AggloTreeTable
    columns={columns}
    dataSource={data}
    groupKeys={['name']}
    rowKey="id"
    tableFixedHeight={300}
  />
);
```

## 📚 组件文档

项目使用 dumi 生成组件文档，可以通过以下命令启动文档站点：

```bash
# 启动文档开发服务器
yarn docs:dev

# 构建文档站点
yarn docs:build
```

## 📦 特性

- **虚拟化渲染**: 基于 `rc-virtual-list` 实现，轻松渲染万级数据
- **树形结构**: 支持多级数据分组和树形展示
- **数据聚合**: 支持 BigNumber 精确计算的数据聚合功能
- **可展开行**: 支持展开/折叠操作
- **粘性表头**: 滚动时保持表头可见
- **高度可定制化**: 支持丰富的配置选项

## 🧩 依赖

- React (v16.8+)
- bignumber.js (v9.0.0)
- rc-resize-observer (v1.0.0)
- rc-virtual-list (v3.0.0)

## 🧪 开发

```bash
# 安装依赖
yarn install

# 构建组件库
yarn build

# 启动开发模式
yarn dev

# 运行测试
yarn test

# 生成文档
yarn docs
```

## 📖 API

### AggloTreeTable

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| groupKeys | 用于分组的键，按层级顺序排列 | `string[]` | - |
| AggregateKeys | 数据聚合配置 | `AggregateKeysType` | - |
| sort | 树节点排序函数 | `(a: any, b: any) => number` | `() => 1` |

### VirtualTable

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rowKey | 唯一行键 | `string` | - |
| columns | 表格列配置 | `any[]` | `[]` |
| dataSource | 表格数据源 | `Array<Record<string, any>>` | `[]` |
| tableFixedHeight | 固定表格高度 | `number` | `48` |

## 🏗️ 构建工具

本项目现在使用 Vite 作为构建工具，替代了原来的 Rollup。

### 开发

```bash
# 启动开发服务器
yarn dev

# 构建生产版本
yarn build

# 预览构建结果
yarn preview
```

## 📄 License

MIT
# TreeTable Component

# TreeTable 组件

A React tree table component with aggregation capabilities for financial data.
一个支持金融数据聚合功能的 React 树形表格组件。

## Overview
## 概述

TreeTable is a powerful React component that extends virtualized tables with tree-like data grouping and aggregation features. It's particularly useful for financial applications where data needs to be grouped and summarized across multiple dimensions.
TreeTable 是一个功能强大的 React 组件，它通过树形数据分组和聚合功能扩展了虚拟化表格。它特别适用于需要在多个维度上对数据进行分组和汇总的金融应用。

## Features
## 功能特性

- **Virtualized Rendering**: Efficiently renders large datasets using virtualization
- **虚拟化渲染**: 使用虚拟化技术高效渲染大型数据集
- **Tree Grouping**: Groups data hierarchically based on specified keys
- **树形分组**: 根据指定的键层次化分组数据
- **Data Aggregation**: Supports multiple aggregation methods including BigNumber for precision
- **数据聚合**: 支持多种聚合方法，包括用于精确计算的 BigNumber
- **Expandable Rows**: Allows expanding/collapsing of tree nodes
- **可展开行**: 允许展开/折叠树节点
- **Sticky Headers**: Headers remain visible when scrolling
- **粘性表头**: 滚动时表头保持可见
- **Customizable**: Highly configurable with extensive options
- **可定制**: 具有广泛选项的高度可配置性

## Installation
## 安装

```bash
npm install tree-table-component
```

or
或者

```bash
yarn add tree-table-component
```

## Usage
## 使用方法

``tsx
import React from 'react';
import { TreeTable } from 'tree-table-component';

const MyComponent = () => {
  const columns = [
    {
      title: 'Name',
      title: '名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Value',
      title: '值',
      dataIndex: 'value',
      width: 100,
    },
  ];

  const data = [
    { name: 'Item 1', value: 100, category: 'A', subcategory: 'A1' },
    { name: 'Item 2', value: 200, category: 'A', subcategory: 'A2' },
    { name: 'Item 3', value: 300, category: 'B', subcategory: 'B1' },
  ];

  return (
    <TreeTable
      columns={columns}
      dataSource={data}
      groupKeys={['category', 'subcategory']}
      rowKey="name"
      AggregateKeys={{
        equalKeys: ['currency'],
        addBNkeys: ['value']
      }}
    />
  );
};

export default MyComponent;
```

## API

### TreeTable Props
### TreeTable 属性

| Prop | Type | Description |
|------|------|-------------|
| Prop | 类型 | 描述 |
| groupKeys | string[] | Keys to group by, in hierarchical order |
| groupKeys | string[] | 用于分组的键，按层级顺序排列 |
| AggregateKeys | AggregateKeysType | Configuration for data aggregation |
| AggregateKeys | AggregateKeysType | 数据聚合配置 |
| sort | (a, b) => number | Sort function for tree nodes |
| sort | (a, b) => number | 树节点排序函数 |
| ... | ... | All other props from VirtualTable |
| ... | ... | VirtualTable 的所有其他属性 |

### VirtualTable Props
### VirtualTable 属性

| Prop | Type | Description |
|------|------|-------------|
| Prop | 类型 | 描述 |
| rowKey | string | Unique row key |
| rowKey | string | 唯一行键 |
| columns | any[] | Table columns configuration |
| columns | any[] | 表格列配置 |
| dataSource | Array<Record<string, any>> | Table data source |
| dataSource | Array<Record<string, any>> | 表格数据源 |
| rowHeight | number | Height of each row (default: 40) |
| rowHeight | number | 每行的高度（默认：40） |
| headerRowHeight | number | Height of header row (default: 40) |
| headerRowHeight | number | 表头行的高度（默认：40） |
| tableFixedHeight | number | Fixed table height (default: 48) |
| tableFixedHeight | number | 固定表格高度（默认：48） |
| loading | boolean | Loading state |
| loading | boolean | 加载状态 |
| expandable | ExpandableProps | Expandable configuration |
| expandable | ExpandableProps | 可展开配置 |

### AggregateKeysType
### AggregateKeysType 类型

| Prop | Type | Description |
|------|------|-------------|
| Prop | 类型 | 描述 |
| addkeys | string[] | Keys that should be summed using simple addition |
| addkeys | string[] | 应使用简单加法求和的键 |
| addBNkeys | string[] | Keys that should be summed using BigNumber for precision |
| addBNkeys | string[] | 应使用 BigNumber 精确计算求和的键 |
| equalKeys | string[] | Keys that should be displayed only when values are equal across all children |
| equalKeys | string[] | 仅当所有子项值相等时才显示的键 |

## Development
## 开发

1. Clone the repository
2. 克隆仓库
   ```bash
   yarn install
   ```
3. Build the project:
3. 构建项目:
   ```bash
   yarn build
   ```
4. Run tests:
4. 运行测试:
   ```bash
   yarn test
   ```

## License
## 许可证

MIT