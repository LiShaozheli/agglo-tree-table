---
nav:
  title: GroupManager
  path: /components
group:
  title: 表格组件
  path: /components/table
---

# GroupManager - 分组管理器

GroupManager 是一个用于管理 AggloTreeTable 表格分组和聚合配置的组件。它提供了直观的用户界面，让用户可以动态地添加或删除分组字段和聚合字段，实现灵活的数据分析。

## 代码演示

### 基础用法

GroupManager 通常作为 AggloTreeTable 的内置组件使用，通过 `showGroupManagement` 属性启用。

```tsx
import React, { useState } from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

// 示例数据
const sampleData = [
  {
    positionId: '1',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    department: 'Technology',
    region: 'North America',
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
    department: 'Technology',
    region: 'North America',
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
    department: 'Technology',
    region: 'North America',
    'MTE:pv': 20000,
    'MTE:delta': 1000,
    'MTE:deltaCash': 50000,
    remainingLot: 200,
    remainingNotional: 100000,
  },
  {
    positionId: '4',
    instrumentName: 'Tesla Inc.',
    contractCode: 'TSLA',
    department: 'Automotive',
    region: 'Europe',
    'MTE:pv': 30000,
    'MTE:delta': 1500,
    'MTE:deltaCash': 75000,
    remainingLot: 300,
    remainingNotional: 150000,
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
    title: 'Department',
    dataIndex: 'department',
    width: 120,
  },
  {
    title: 'Region',
    dataIndex: 'region',
    width: 120,
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
  const [showGroupManagement, setShowGroupManagement] = useState(true);
  const [position, setPosition] = useState('top');
  
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input 
            type="checkbox" 
            checked={showGroupManagement}
            onChange={(e) => setShowGroupManagement(e.target.checked)}
          />
          显示分组管理
        </label>
        <label style={{ marginLeft: 16 }}>
          位置：
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="top">顶部</option>
            <option value="bottom">底部</option>
          </select>
        </label>
      </div>
      <AggloTreeTable
        columns={tableColumns}
        dataSource={sampleData}
        rowKey="positionId"
        showGroupManagement={showGroupManagement}
        groupManagerPosition={position}
        height={400}
        availableFields={[
          'instrumentName',
          'contractCode',
          'department',
          'region',
          'MTE:pv',
          'MTE:delta',
          'MTE:deltaCash',
          'remainingLot',
          'remainingNotional'
        ]}
      />
    </>
  );
};
```

## API

### AggloTreeTable 属性

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| showGroupManagement | 是否显示分组管理器 | boolean | false |
| groupManagerPosition | 分组管理器位置 | `top` \| `bottom` | top |
| availableFields | 可用于分组和聚合的字段列表 | string[] | 所有列字段 |

### GroupManager 配置

GroupManager 允许用户配置以下内容：

1. **分组字段 (Group Keys)** - 用于数据分组的字段，支持多级分组
2. **聚合字段 (Aggregate Keys)** - 用于数据聚合计算的字段，包括：
   - 普通求和字段 (addkeys) - 使用普通加法进行求和
   - 高精度求和字段 (addBNkeys) - 使用 BigNumber 进行高精度计算求和
   - 相等字段 (equalKeys) - 仅当所有子项值相等时才显示的字段

## 使用说明

GroupManager 为用户提供了动态配置表格分组和聚合功能的能力，使得数据分析更加灵活：

1. **分组管理** - 用户可以动态添加或删除分组字段，实现不同的数据分组方式
2. **聚合配置** - 用户可以配置不同类型的聚合字段，满足各种计算需求
3. **可视化操作** - 提供直观的界面，通过标签形式展示已配置的字段，支持添加和删除操作
4. **位置灵活** - 支持将分组管理器放置在表格的顶部或底部，适应不同的布局需求

通过 GroupManager，用户无需修改代码即可动态调整表格的分组和聚合配置，大大提高了组件的灵活性和实用性。