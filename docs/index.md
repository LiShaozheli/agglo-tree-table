---
title: 首页
---

# AggloTreeTable

一个功能强大的 React 树形表格组件，具有数据聚合功能，适用于金融数据展示。

## 特性

- **虚拟化渲染** - 高效渲染大型数据集
- **树形分组** - 支持多级数据分组展示
- **数据聚合** - 支持 BigNumber 精确计算的数据聚合
- **可展开行** - 支持展开/折叠操作
- **粘性表头** - 滚动时保持表头可见
- **高度可定制** - 支持丰富的配置选项

## 安装

```bash
npm install agglo-tree-table
```

或

```bash
yarn add agglo-tree-table
```

## 快速开始

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