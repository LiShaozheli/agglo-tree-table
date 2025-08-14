---
nav:
  title: 组件
  path: /components
---

# AggloTreeTable

AggloTreeTable 是一个功能强大的 React 组件，它通过树形数据分组和聚合功能扩展了虚拟化表格。它特别适用于需要在多个维度上对数据进行分组和汇总的金融应用。

## 代码演示

### 基础用法

通过 `groupKeys` 属性指定分组字段，组件会自动将数据按照指定字段进行分组。

<code src="../../../examples/basic-example.tsx" title="基础示例" description="最基本的 AggloTreeTable 用法，展示数据分组和聚合功能"></code>

## API

### AggloTreeTableProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| groupKeys | 用于分组的键，按层级顺序排列 | `string[]` | - |
| AggregateKeys | 数据聚合配置 | `AggregateKeysType` | - |
| sort | 树节点排序函数 | `(a: any, b: any) => number` | `() => 1` |
| columns | 表格列配置 | `any[]` | - |
| dataSource | 表格数据源 | `Array<Record<string, any>>` | - |
| rowKey | 唯一行键 | `string` | - |
| tableFixedHeight | 固定表格高度 | `number` | - |
| filterColumns | 要过滤的列（仅显示这些列） | `string[]` | `[]` |
| displayColumns | 要显示的列（仅显示这些列） | `string[]` | `[]` |
| loading | 加载状态 | `boolean` | `false` |
| expandable | 可展开配置 | `ExpandableProps` | - |

### AggregateKeysType

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| addkeys | 应使用简单加法求和的键 | `string[]` | - |
| addBNkeys | 应使用 BigNumber 精确计算求和的键 | `string[]` | - |
| equalKeys | 仅当所有子项值相等时才显示的键 | `string[]` | - |

### ExpandableProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultExpandedRowKeys | 默认展开的行键 | `string[]` | - |
| childrenColumnName | 数据中子项列的名称 | `string` | `children` |
| expandDataIndex | 展开列的数据索引 | `string` | `expand` |
| expandRowByClick | 是否通过点击任意位置展开行 | `boolean` | `false` |
| indentSize | 每级的缩进大小 | `number` | `15` |
| expandColumnWidth | 展开列的宽度 | `number` | `150` |
| expandColumnTitle | 展开列的标题 | `ReactNode` | - |
| expandIcon | 自定义展开图标渲染器 | `(isExpend: boolean, value: ReactNode, record: Record<string, any>) => ReactNode` | - |

## 使用场景

### 金融数据分析

AggloTreeTable 特别适用于金融领域，可以对大量交易数据进行分组和聚合分析：

```tsx
import React from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

const financialData = [
  {
    id: '1',
    assetClass: 'Equity',
    sector: 'Technology',
    instrument: 'AAPL',
    currency: 'USD',
    notional: 1000000,
    pv: 10000,
    delta: 500,
    gamma: 0.2,
    vega: 100,
    theta: -5
  }
];

const columns = [
  {
    title: 'Instrument',
    dataIndex: 'instrument',
    width: 150,
  },
  {
    title: 'Notional',
    dataIndex: 'notional',
    width: 120,
  },
  {
    title: 'PV',
    dataIndex: 'pv',
    width: 100,
  },
  {
    title: 'Delta',
    dataIndex: 'delta',
    width: 100,
  }
];

export default () => (
  <AggloTreeTable
    columns={columns}
    dataSource={financialData}
    groupKeys={['assetClass', 'sector', 'instrument']}
    rowKey="id"
    AggregateKeys={{
      equalKeys: ['currency'],
      addBNkeys: ['notional', 'pv', 'delta', 'gamma', 'vega', 'theta']
    }}
  />
);
```

### 多维度数据展示

支持按多个维度进行数据分组，便于查看不同层级的数据汇总信息。