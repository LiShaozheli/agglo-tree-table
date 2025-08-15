---
title: 动态列显示和聚合
---

# 动态列显示和聚合

AggloTreeTable 支持动态控制表格列的显示和数据聚合功能。通过 [displayColumns](file://d:\work\agglo-tree-table\src\components\VirtualTable\index.tsx#L67-L67) 和 [groupKeys](file:///d:/work/agglo-tree-table/src/AggloTreeTable/AggloTreeTable.tsx#L27-L29) 属性，您可以灵活地控制表格的展示内容和聚合方式。

## 动态列显示

[displayColumns](file://d:\work\agglo-tree-table\src\components\VirtualTable\index.tsx#L67-L67) 属性允许您控制哪些列在表格中显示。它接受一个字符串数组，数组中的每个字符串对应列定义中的 [dataIndex](file:///d:/work/agglo-tree-table/node_modules/%40types/react/ts5.0/global.d.ts#L91-L91)。

### 基础用法

```tsx
import React, { useState } from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

const data = [
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
  // ... 更多数据
];

const columns = [
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
  // 控制显示哪些列
  const [visibleColumns, setVisibleColumns] = useState([
    'instrumentName',
    'contractCode',
    'MTE:pv',
    'MTE:delta',
    'MTE:deltaCash'
  ]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.includes('instrumentName')}
            onChange={e => {
              if (e.target.checked) {
                setVisibleColumns(prev => [...prev, 'instrumentName']);
              } else {
                setVisibleColumns(prev => prev.filter(col => col !== 'instrumentName'));
              }
            }}
          />
          显示 Instrument 列
        </label>
        {/* 其他列的控制选项 */}
      </div>
      
      <AggloTreeTable
        columns={columns}
        dataSource={data}
        groupKeys={['instrumentName']}
        rowKey="positionId"
        displayColumns={visibleColumns} // 动态控制显示的列
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
    </div>
  );
};
```

## 动态聚合分组

[groupKeys](file:///d:/work/agglo-tree-table/src/AggloTreeTable/AggloTreeTable.tsx#L27-L29) 属性允许您动态控制数据的分组方式。通过更改 [groupKeys](file:///d:/work/agglo-tree-table/src/AggloTreeTable/AggloTreeTable.tsx#L27-L29) 数组，您可以控制按哪些字段对数据进行分组聚合。

### 基础用法

```tsx
import React, { useState } from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

const data = [
  {
    positionId: '1',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    exchange: 'NASDAQ',
    'MTE:pv': 10000,
    'MTE:delta': 500,
    'MTE:deltaCash': 25000,
  },
  // ... 更多数据
];

const columns = [
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
    title: 'Exchange',
    dataIndex: 'exchange',
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
];

export default () => {
  // 控制按哪些键进行分组
  const [groupingKeys, setGroupingKeys] = useState(['instrumentName']);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={groupingKeys.includes('instrumentName')}
            onChange={e => {
              if (e.target.checked) {
                setGroupingKeys(prev => [...prev, 'instrumentName']);
              } else {
                setGroupingKeys(prev => prev.filter(key => key !== 'instrumentName'));
              }
            }}
          />
          按 Instrument 分组
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={groupingKeys.includes('exchange')}
            onChange={e => {
              if (e.target.checked) {
                setGroupingKeys(prev => [...prev, 'exchange']);
              } else {
                setGroupingKeys(prev => prev.filter(key => key !== 'exchange'));
              }
            }}
          />
          按 Exchange 分组
        </label>
      </div>
      
      <AggloTreeTable
        columns={columns}
        dataSource={data}
        groupKeys={groupingKeys} // 动态控制分组键
        rowKey="positionId"
        expandable={{
          expandDataIndex: 'expand',
          expandColumnWidth: 200,
          expandColumnTitle: 'Group',
        }}
        AggregateKeys={{
          equalKeys: groupingKeys,
          addBNkeys: ['MTE:pv', 'MTE:delta', 'MTE:deltaCash'],
        }}
      />
    </div>
  );
};
```

## 完整示例

以下是一个结合了动态列显示和动态聚合分组的完整示例：

```tsx
import React, { useState } from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

// 示例数据
const sampleData = [
  {
    positionId: '1',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    exchange: 'NASDAQ',
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
    exchange: 'NASDAQ',
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
    exchange: 'NASDAQ',
    'MTE:pv': 20000,
    'MTE:delta': 1000,
    'MTE:deltaCash': 50000,
    remainingLot: 200,
    remainingNotional: 100000,
  },
  {
    positionId: '4',
    instrumentName: 'Microsoft Corp.',
    contractCode: 'MSFT',
    exchange: 'NASDAQ',
    'MTE:pv': 25000,
    'MTE:delta': 1250,
    'MTE:deltaCash': 62500,
    remainingLot: 250,
    remainingNotional: 125000,
  },
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
    title: 'Exchange',
    dataIndex: 'exchange',
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
  // 控制显示的列
  const [displayColumns, setDisplayColumns] = useState([
    'instrumentName',
    'contractCode',
    'MTE:pv',
    'MTE:delta',
    'MTE:deltaCash'
  ]);
  
  // 控制分组键
  const [groupKeys, setGroupKeys] = useState(['instrumentName']);

  return (
    <div style={{ padding: '20px' }}>
      <h1>动态列显示和聚合示例</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>列显示控制</h2>
        <div>
          {tableColumns.map(column => (
            <label key={column.dataIndex} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={displayColumns.includes(column.dataIndex)}
                onChange={e => {
                  if (e.target.checked) {
                    setDisplayColumns(prev => [...prev, column.dataIndex]);
                  } else {
                    setDisplayColumns(prev => prev.filter(col => col !== column.dataIndex));
                  }
                }}
              />
              {column.title}
            </label>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>分组控制</h2>
        <div>
          <label style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={groupKeys.includes('instrumentName')}
              onChange={e => {
                if (e.target.checked) {
                  setGroupKeys(prev => [...prev, 'instrumentName']);
                } else {
                  setGroupKeys(prev => prev.filter(key => key !== 'instrumentName'));
                }
              }}
            />
            按 Instrument 分组
          </label>
          
          <label style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={groupKeys.includes('exchange')}
              onChange={e => {
                if (e.target.checked) {
                  setGroupKeys(prev => [...prev, 'exchange']);
                } else {
                  setGroupKeys(prev => prev.filter(key => key !== 'exchange'));
                }
              }}
            />
            按 Exchange 分组
          </label>
        </div>
      </div>
      
      <AggloTreeTable
        columns={tableColumns}
        dataSource={sampleData}
        groupKeys={groupKeys}
        rowKey="positionId"
        displayColumns={displayColumns}
        expandable={{
          expandDataIndex: 'expand',
          expandColumnWidth: 200,
          expandColumnTitle: 'Group',
        }}
        AggregateKeys={
          groupKeys.length > 0 ? {
            equalKeys: groupKeys,
            addBNkeys: [
              'MTE:pv',
              'MTE:delta',
              'MTE:deltaCash',
              'remainingLot',
              'remainingNotional',
            ],
          } : undefined
        }
      />
    </div>
  );
};
```

## 属性说明

### displayColumns

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| [displayColumns](file://d:\work\agglo-tree-table\src\components\VirtualTable\index.tsx#L67-L67) | string[] | 指定需要显示的列，值为列定义中的 [dataIndex](file:///d:/work/agglo-tree-table/node_modules/%40types/react/ts5.0/global.d.ts#L91-L91) |

### groupKeys

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| [groupKeys](file:///d:/work/agglo-tree-table/src/AggloTreeTable/AggloTreeTable.tsx#L27-L29) | string[] | 指定用于分组的键，按层级顺序排列 |

### AggregateKeys

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| equalKeys | string[] | 用于分组的键，通常与 [groupKeys](file:///d:/work/agglo-tree-table/src/AggloTreeTable/AggloTreeTable.tsx#L27-L29) 相同 |
| addBNkeys | string[] | 需要进行聚合计算的键 |

通过这些功能，您可以创建高度灵活的表格，满足不同的数据展示和分析需求。