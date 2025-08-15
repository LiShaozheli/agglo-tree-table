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

### 使用列管理功能

通过 `showColumnManagement` 属性启用列管理功能，用户可以通过界面控制列的显示与隐藏。

<code src="../../../examples/column-management-example.tsx" title="列管理示例" description="展示如何使用内置的列管理功能控制列的显示与隐藏"></code>

### 使用全部展开/收起功能

通过 [showExpandAll](file:///d:/work/agglo-tree-table/src/components/VirtualTable/index.tsx#L36-L36) 属性启用全部展开/收起功能，并通过 ref 调用相关方法。

```tsx
import React, { useRef } from 'react';
import { AggloTreeTable, AggloTreeTableHandles } from 'agglo-tree-table';

export default () => {
  const columns = [
    {
      title: '资产类别',
      dataIndex: 'assetClass',
      width: 150,
    },
    {
      title: '行业',
      dataIndex: 'sector',
      width: 150,
    },
    {
      title: ' instrument',
      dataIndex: 'instrument',
      width: 150,
    },
    {
      title: '名义金额',
      dataIndex: 'notional',
      width: 120,
    },
    {
      title: '现值',
      dataIndex: 'pv',
      width: 100,
    }
  ];

  const data = [
    {
      id: '1',
      assetClass: '股票',
      sector: '科技',
      instrument: 'AAPL',
      notional: 1000000,
      pv: 10000,
    },
    {
      id: '2',
      assetClass: '股票',
      sector: '科技',
      instrument: 'GOOGL',
      notional: 2000000,
      pv: 25000,
    },
    {
      id: '3',
      assetClass: '股票',
      sector: '金融',
      instrument: 'JPM',
      notional: 1500000,
      pv: 15000,
    },
    {
      id: '4',
      assetClass: '债券',
      sector: '政府',
      instrument: 'T-Bond',
      notional: 3000000,
      pv: 5000,
    },
    {
      id: '5',
      assetClass: '债券',
      sector: '企业',
      instrument: 'Corp Bond',
      notional: 2500000,
      pv: 7500,
    }
  ];
  
  const tableRef = useRef<AggloTreeTableHandles>(null);

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => tableRef.current?.expandAll()}>全部展开</button>
        <button onClick={() => tableRef.current?.collapseAll()} style={{ marginLeft: '10px' }}>全部收起</button>
      </div>
      <AggloTreeTable
        ref={tableRef}
        columns={columns}
        dataSource={data}
        groupKeys={['assetClass', 'sector']}
        rowKey="id"
        expandable={{
          showExpandAll: true,
        }}
      />
    </div>
  );
};
```

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
| displayColumns | 要显示的列（仅显示这些列） | `string[]` | `[]` |
| showColumnManagement | 是否显示列管理组件 | `boolean` | `false` |
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
| showExpandAll | 是否显示全部展开/收起按钮 | `boolean` | `false` |
| onExpandAll | 全部展开时的回调函数 | `() => void` | - |
| onCollapseAll | 全部收起时的回调函数 | `() => void` | - |

### AggloTreeTableHandles

通过 ref 可以访问以下方法：

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| expandAll | 展开所有行 | `() => void` |
| collapseAll | 收起所有行 | `() => void` |

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
    expandable={{
      showExpandAll: true
    }}
  />
);
```

### 多维度数据展示

支持按多个维度进行数据分组，便于查看不同层级的数据汇总信息。