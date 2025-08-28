---
nav:
  title: 组件总览
  path: /components
group:
  title: 表格组件
  path: /components/table
hero:
  title: agglo-tree-table
  description: 一个功能强大的 React 表格组件库，支持虚拟滚动、树形数据展示和数据聚合功能
  actions:
    - text: 快速开始
      link: /agglo-tree-table
features:
  - title: 虚拟滚动
    emoji: 🚀
    description: 基于 rc-virtual-list 实现，高效渲染大量数据
  - title: 树形展示
    emoji: 🌲
    description: 支持多级数据分组和展开/收起功能
  - title: 数据聚合
    emoji: 📊
    description: 支持多种数据聚合方式，适用于金融数据分析
  - title: 列管理
    emoji: 🎛️
    description: 内置列管理功能，支持显示/隐藏和拖拽排序
  - title: 主题定制
    emoji: 🎨
    description: 支持多种预定义主题和自定义主题
  - title: 粘滞表头
    emoji: 📌
    description: 支持表头粘滞效果，提升大数据浏览体验
---

## 组件列表

- [AggloTreeTable](./agglo-tree-table) - 聚合树形表格组件，支持数据分组和聚合功能
- [VirtualTable](./virtual-table) - 虚拟表格组件，用于高效渲染大量数据
- [StickyContainer](./sticky-container) - 粘滞容器组件，可用于实现表头粘滞等效果
- [ColumnManager](./column-manager) - 列管理组件，用于控制列的显示/隐藏和排序

## 简介

agglo-tree-table 是一个功能强大的 React 表格组件库，专注于处理大量复杂数据的展示和分析。该库包含多个组件，可以单独使用或组合使用，以满足不同的业务需求。

## 核心特性

### 1. 高性能渲染
- 基于虚拟滚动技术，支持高效渲染大量数据
- 优化的渲染性能，确保流畅的用户体验

### 2. 数据处理能力
- 强大的树形数据分组和聚合功能
- 支持多种数据聚合方式，包括简单加法和高精度计算

### 3. 灵活的定制性
- 多种预定义主题和自定义主题支持
- 可扩展的组件架构，便于按需定制

### 4. 用户友好
- 内置列管理功能，用户可以动态控制列的显示和排序
- 直观的交互设计，提升用户操作体验

## 安装

```
npm install agglo-tree-table
```

或

```
yarn add agglo-tree-table
```

或

```
pnpm add agglo-tree-table
```

## 快速开始

```tsx
import React from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

const App = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: 100,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: 200,
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
  ];

  return (
    <AggloTreeTable
      columns={columns}
      dataSource={data}
      groupKeys={['name']}
    />
  );
};

export default App;
```

# AggloTreeTable - 聚合树形表格

AggloTreeTable 是一个功能强大的 React 表格组件，专为金融数据设计。它支持树形数据展示、数据聚合、虚拟滚动、列管理等功能，适用于处理大量复杂数据的场景。

## 代码演示

### 基础用法

最基本的 AggloTreeTable 使用方式，展示如何配置列和数据源。

```tsx
import React, { useState } from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

// 示例数据
const sampleData = [
  {
    positionId: '1',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    'MTE:pv': 10000,
    'MTE:delta': 500,
    'MTE:deltaCash': 25000,
    remainingLot: 100,
    remainingNotional: 50000,
  },
  {
    positionId: '2',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    'MTE:pv': 15000,
    'MTE:delta': 750,
    'MTE:deltaCash': 37500,
    remainingLot: 150,
    remainingNotional: 75000,
  },
  {
    positionId: '3',
    instrumentName: 'Microsoft Corp.',
    contractCode: 'MSFT',
    'MTE:pv': 20000,
    'MTE:delta': 1000,
    'MTE:deltaCash': 50000,
    remainingLot: 200,
    remainingNotional: 100000,
  }
];

// 表格列定义
const tableColumns = [
  {
    title: 'Instrument',
    dataIndex: 'instrumentName',
    width: 150,
  },
  {
    title: 'Contract',
    dataIndex: 'contractCode',
    width: 100,
  },
  {
    title: 'PV',
    dataIndex: 'MTE:pv',
    width: 120,
  },
  {
    title: 'Delta',
    dataIndex: 'MTE:delta',
    width: 120,
  },
  {
    title: 'Delta Cash',
    dataIndex: 'MTE:deltaCash',
    width: 120,
  },
  {
    title: 'Remaining Lot',
    dataIndex: 'remainingLot',
    width: 120,
  },
  {
    title: 'Remaining Notional',
    dataIndex: 'remainingNotional',
    width: 150,
  },
];

export default () => {
  return (
    <AggloTreeTable
      columns={tableColumns}
      dataSource={sampleData}
      groupKeys={['instrumentName']}
      rowKey={'positionId'}
      expandable={{
        expandDataIndex: 'expand',
        expandColumnWidth: 200,
        expandColumnTitle: 'Group',
      }}
      AggregateKeys={{
        equalKeys: ['instrumentName'],
        addBNkeys: [
          'MTE:pv',
          'MTE:delta',
          'MTE:deltaCash',
          'remainingLot',
          'remainingNotional',
        ],
      }}
    />
  );
};
```

### 嵌套表头

支持复杂的嵌套表头结构，更好地组织和展示数据。

```tsx
import React from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

// 带有层次结构的示例数据
const sampleData = [
  {
    positionId: '1',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    'MTE:pv': 10000,
    'MTE:delta': 500,
    'MTE:deltaCash': 25000,
    'MTE:gamma': 25,
    'MTE:vega': 100,
    remainingLot: 100,
    remainingNotional: 50000,
  },
  {
    positionId: '2',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    'MTE:pv': 15000,
    'MTE:delta': 750,
    'MTE:deltaCash': 37500,
    'MTE:gamma': 37.5,
    'MTE:vega': 150,
    remainingLot: 150,
    remainingNotional: 75000,
  }
];

// 带嵌套表头的表格列定义
const tableColumns = [
  {
    title: 'Basic Information',
    children: [
      {
        title: 'Instrument',
        dataIndex: 'instrumentName',
        width: 150,
      },
      {
        title: 'Contract',
        dataIndex: 'contractCode',
        width: 100,
      },
    ],
  },
  {
    title: 'Risk Metrics',
    children: [
      {
        title: 'PV',
        dataIndex: 'MTE:pv',
        width: 120,
      },
      {
        title: 'Greeks',
        children: [
          {
            title: 'Delta',
            dataIndex: 'MTE:delta',
            width: 120,
          },
          {
            title: 'Delta Cash',
            dataIndex: 'MTE:deltaCash',
            width: 120,
          },
          {
            title: 'Gamma',
            dataIndex: 'MTE:gamma',
            width: 120,
          },
          {
            title: 'Vega',
            dataIndex: 'MTE:vega',
            width: 120,
          },
        ],
      },
    ],
  },
  {
    title: 'Position Info',
    children: [
      {
        title: 'Remaining Lot',
        dataIndex: 'remainingLot',
        width: 120,
      },
      {
        title: 'Remaining Notional',
        dataIndex: 'remainingNotional',
        width: 150,
      },
    ],
  },
];

export default () => {
  return (
    <AggloTreeTable
      columns={tableColumns}
      dataSource={sampleData}
      groupKeys={['instrumentName']}
      rowKey={'positionId'}
      expandable={{
        expandDataIndex: 'expand',
        expandColumnWidth: 200,
        expandColumnTitle: 'Group',
      }}
      AggregateKeys={{
        equalKeys: ['instrumentName'],
        addBNkeys: [
          'MTE:pv',
          'MTE:delta',
          'MTE:deltaCash',
          'MTE:gamma',
          'MTE:vega',
          'remainingLot',
          'remainingNotional',
        ],
      }}
    />
  );
};
```

### 列管理

通过内置的列管理功能，用户可以动态控制列的显示/隐藏和顺序。

```tsx
import React, { useState } from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

// 示例数据
const sampleData = [
  {
    positionId: '1',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    'MTE:pv': 10000,
    'MTE:delta': 500,
    'MTE:deltaCash': 25000,
    remainingLot: 100,
    remainingNotional: 50000,
  },
  {
    positionId: '2',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    'MTE:pv': 15000,
    'MTE:delta': 750,
    'MTE:deltaCash': 37500,
    remainingLot: 150,
    remainingNotional: 75000,
  }
];

// 表格列定义
const tableColumns = [
  {
    title: 'Instrument',
    dataIndex: 'instrumentName',
    width: 150,
  },
  {
    title: 'Contract',
    dataIndex: 'contractCode',
    width: 100,
  },
  {
    title: 'PV',
    dataIndex: 'MTE:pv',
    width: 120,
  },
  {
    title: 'Delta',
    dataIndex: 'MTE:delta',
    width: 120,
  },
  {
    title: 'Delta Cash',
    dataIndex: 'MTE:deltaCash',
    width: 120,
  },
  {
    title: 'Remaining Lot',
    dataIndex: 'remainingLot',
    width: 120,
  },
  {
    title: 'Remaining Notional',
    dataIndex: 'remainingNotional',
    width: 150,
  },
];

export default () => {
  const [showColumnManagement, setShowColumnManagement] = useState(true);
  
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input 
            type="checkbox" 
            checked={showColumnManagement}
            onChange={(e) => setShowColumnManagement(e.target.checked)}
          />
          显示列管理
        </label>
      </div>
      
      <AggloTreeTable
        columns={tableColumns}
        dataSource={sampleData}
        groupKeys={['instrumentName']}
        rowKey={'positionId'}
        showColumnManagement={showColumnManagement}
        columnManagerPosition="right"
        expandable={{
          expandDataIndex: 'expand',
          expandColumnWidth: 200,
          expandColumnTitle: 'Group',
        }}
        AggregateKeys={{
          equalKeys: ['instrumentName'],
          addBNkeys: [
            'MTE:pv',
            'MTE:delta',
            'MTE:deltaCash',
            'remainingLot',
            'remainingNotional',
          ],
        }}
      />
    </>
  );
};
```

### 主题定制

支持多种预定义主题和自定义主题。

```tsx
import React, { useState } from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

// 示例数据
const sampleData = [
  {
    positionId: '1',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    'MTE:pv': 10000,
    'MTE:delta': 500,
    'MTE:deltaCash': 25000,
    remainingLot: 100,
    remainingNotional: 50000,
  }
];

// 表格列定义
const tableColumns = [
  {
    title: 'Instrument',
    dataIndex: 'instrumentName',
    width: 150,
  },
  {
    title: 'Contract',
    dataIndex: 'contractCode',
    width: 100,
  },
  {
    title: 'PV',
    dataIndex: 'MTE:pv',
    width: 120,
  },
  {
    title: 'Delta',
    dataIndex: 'MTE:delta',
    width: 120,
  }
];

export default () => {
  const [theme, setTheme] = useState('light');
  
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">明亮模式</option>
          <option value="dark">暗黑模式</option>
          <option value="antd">Ant Design 风格</option>
          <option value="agGrid">AG Grid 风格</option>
        </select>
      </div>
      
      <AggloTreeTable
        columns={tableColumns}
        dataSource={sampleData}
        groupKeys={['instrumentName']}
        rowKey={'positionId'}
        theme={theme}
        expandable={{
          expandDataIndex: 'expand',
          expandColumnWidth: 200,
          expandColumnTitle: 'Group',
        }}
        AggregateKeys={{
          equalKeys: ['instrumentName'],
          addBNkeys: ['MTE:pv', 'MTE:delta'],
        }}
      />
    </>
  );
};
```

## API

### AggloTreeTableProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| groupKeys | 用于分组的键，按层级顺序排列 | `string[]` | `[]` |
| columns | 表格列配置 | [ColumnType](#ColumnType)[] | `[]` |
| dataSource | 表格数据源 | `Array<Record<string, any>>` | `[]` |
| AggregateKeys | 数据聚合配置 | [AggregateKeysType](#AggregateKeysType) | - |
| resizable | 表格容器是否可调整大小 | `boolean` | `false` |
| sort | 树节点排序函数 | `(a: any, b: any) => number` | - |
| showColumnManagement | 是否显示列管理组件 | `boolean` | `false` |
| columnManagerPosition | 列管理组件的位置 | `'left' \| 'right'` | `'right'` |
| width | 表格容器的宽度 | `number \| string` | `'100%'` |
| height | 表格容器的高度 | `number \| string` | - |
| rowKey | 唯一行键 | `string` | - |
| expandable | 可展开配置 | [ExpandableProps](#ExpandableProps) | - |
| theme | 表格主题 | `'default' \| 'antd' \| 'agGrid' \| 'light' \| 'dark' \| TableTheme` | `'light'` |
| sticky | 是否启用粘性表头 | `boolean` | `true` |

除了以上属性外，还支持所有 [VirtualTableProps](#VirtualTableProps) 属性。

### ColumnType

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 列标题 | `string` | - |
| dataIndex | 列数据字段 | `string` | - |
| width | 列宽度 | `number \| string` | - |
| visible | 列是否可见 | `boolean` | `true` |
| children | 子列 | [ColumnType](#ColumnType)[] | - |
| [key: string] | 其他属性 | `any` | - |

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
| childrenColumnName | 数据中子项列的名称 | `string` | `'children'` |
| expandDataIndex | 展开列的数据索引 | `string` | `'expand'` |
| expandRowByClick | 是否通过点击任意位置展开行 | `boolean` | `false` |
| indentSize | 每级的缩进大小 | `number` | `15` |
| expandColumnWidth | 展开列的宽度 | `number` | `150` |
| expandColumnTitle | 展开列的标题 | `ReactNode` | - |
| expandIcon | 自定义展开图标渲染器 | `(isExpend: boolean, value: ReactNode, record: Record<string, any>) => ReactNode` | - |
| showExpandAll | 是否显示全部展开/收起按钮 | `boolean` | `false` |
| onExpandAll | 全部展开时的回调函数 | `() => void` | - |
| onCollapseAll | 全部收起时的回调函数 | `() => void` | - |

### AggloTreeTableHandles

通过 ref 可以调用组件的公共方法：

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| expandAll | 展开所有行 | `() => void` |
| collapseAll | 收起所有行 | `() => void` |

## 功能特性

### 1. 树形数据展示
- 支持多级数据分组
- 可自定义分组键
- 展开/收起动画效果

### 2. 数据聚合
- 支持多种聚合方式：
  - 简单加法求和
  - BigNumber 精确计算求和
  - 相等值显示
- 自动计算聚合值并显示在父级节点

### 3. 虚拟滚动
- 高效渲染大量数据
- 仅渲染可见行，提升性能
- 支持自定义行高

### 4. 列管理
- 动态显示/隐藏列
- 拖拽调整列顺序
- 支持嵌套列结构管理
- 可置于表格左侧或右侧

### 5. 主题定制
- 多种预定义主题（默认、Ant Design、AG Grid、明亮、暗黑）
- 支持自定义主题配置
- 易于扩展的主题系统

### 6. 嵌套表头
- 支持复杂的多层表头结构
- 自动计算子列宽度
- 美观的表头展示

### 7. 粘性表头
- 滚动时表头固定在顶部
- 支持水平滚动同步
- 可自定义样式

## 使用场景

### 金融数据分析
适用于展示和分析复杂的金融数据，如投资组合、风险敞口等，支持数据聚合和分组展示。

### 企业管理系统
适合用于企业资源规划(ERP)、客户关系管理(CRM)等系统中的数据表格展示。

### 大数据展示
通过虚拟滚动技术，可以高效展示大量数据，适用于日志分析、监控数据等场景。

## 注意事项

1. **数据结构**：确保数据结构符合要求，特别是分组键和唯一行键的设置
2. **性能优化**：对于超大数据集，建议合理设置行高和容器高度以优化渲染性能
3. **主题定制**：自定义主题时，确保所有必要的样式属性都被正确设置
4. **列管理**：使用列管理功能时，确保列定义中包含必要的 dataIndex 属性