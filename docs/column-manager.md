---
nav:
  title: ColumnManager
  path: /components
group:
  title: 表格组件
  path: /components/table
---

# ColumnManager - 列管理器

ColumnManager 是一个用于管理表格列显示/隐藏和排序的组件，通常与 AggloTreeTable 配合使用。它提供了直观的用户界面，让用户可以轻松控制表格列的可见性和顺序。

## 代码演示

### 基础用法

ColumnManager 通常作为 AggloTreeTable 的内置组件使用，无需单独引入。

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
  const [position, setPosition] = useState('right');
  
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
        <label style={{ marginLeft: 16 }}>
          位置:
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="left">左侧</option>
            <option value="right">右侧</option>
          </select>
        </label>
      </div>
      
      <AggloTreeTable
        height={400}
        columns={tableColumns}
        dataSource={sampleData}
        groupKeys={['instrumentName']}
        rowKey={'positionId'}
        showColumnManagement={showColumnManagement}
        columnManagerPosition={position}
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

### 嵌套列管理

支持管理具有嵌套结构的列。

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
    'MTE:gamma': 25,
    'MTE:vega': 100,
    remainingLot: 100,
    remainingNotional: 50000,
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
        height={400}
        columns={tableColumns}
        dataSource={sampleData}
        groupKeys={['instrumentName']}
        rowKey={'positionId'}
        showColumnManagement={showColumnManagement}
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
    </>
  );
};
```

## API

ColumnManager 作为 AggloTreeTable 的内置组件，通过以下属性进行配置：

### AggloTreeTable 相关属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| showColumnManagement | 是否显示列管理组件 | `boolean` | `false` |
| columnManagerPosition | 列管理组件的位置 | `'left' \| 'right'` | `'right'` |

## 功能特性

### 1. 列可见性控制
- 支持单个列的显示/隐藏
- 支持全选/取消全选
- 支持嵌套列的批量控制

### 2. 列排序
- 支持通过拖拽调整列顺序
- 使用 [dnd-kit](https://docs.dndkit.com/) 实现拖拽功能
- 直观的拖拽手柄

### 3. 嵌套列支持
- 支持多层嵌套列结构
- 树形展示列结构
- 支持展开/收起列组

### 4. 位置灵活
- 可置于表格左侧或右侧
- 自动适应表格主题
- 响应式设计

## 使用场景

### 复杂表格列管理
适用于列数较多、结构复杂的表格，让用户可以自定义需要关注的列。

### 用户个性化设置
允许用户根据自己的需求调整表格列的显示和顺序，提升用户体验。

### 数据分析场景
在数据分析场景中，用户可能只关注部分关键指标，可以通过列管理功能隐藏无关列。

## 注意事项

1. **配合使用**：ColumnManager 通常作为 AggloTreeTable 的内置组件使用，不建议单独使用
2. **列定义要求**：需要为列定义提供 dataIndex 属性以便正确识别和控制
3. **嵌套列支持**：支持任意层级的嵌套列结构
4. **主题适配**：会自动适配表格的主题设置