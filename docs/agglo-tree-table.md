---
nav:
  title: AggloTreeTable
  path: /components
group:
  title: 表格组件
  path: /components/table
---

# AggloTreeTable - 聚合树形表格

AggloTreeTable 是一个功能强大的 React 组件，它通过树形数据分组和聚合功能扩展了虚拟化表格。它特别适用于需要在多个维度上对数据进行分组和汇总的金融应用。

## 代码演示

### 基础用法

通过 `groupKeys` 属性指定分组字段，组件会自动将数据按照指定字段进行分组。

<code src="../examples/basic-example.tsx" title="基础示例" description="最基本的 AggloTreeTable 用法，展示数据分组和聚合功能"></code>

### 使用列管理功能

通过 `showColumnManagement` 属性启用列管理功能，用户可以通过界面控制列的显示与隐藏。

<code src="../examples/column-management-example.tsx" title="列管理示例" description="展示如何使用内置的列管理功能控制列的显示与隐藏"></code>

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

  const ref = useRef<AggloTreeTableHandles>(null);

  return (
    <div>
      <button onClick={() => ref.current?.expandAll()}>全部展开</button>
      <button onClick={() => ref.current?.collapseAll()}>全部收起</button>
      <AggloTreeTable
        ref={ref}
        columns={columns}
        dataSource={data}
        groupKeys={['assetClass', 'sector']}
        rowKey="id"
        showExpandAll
      />
    </div>
  );
};
```

### 嵌套表头示例

AggloTreeTable 支持嵌套表头，可以创建复杂的表头结构来更好地组织和展示数据。

<code src="../examples/nested-header-example.tsx" title="嵌套表头示例" description="展示如何使用嵌套表头来组织复杂的表格结构"></code>

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

### 完整功能演示

以下示例展示了 AggloTreeTable 的所有核心功能，包括大数据量渲染、多级分组、自定义聚合等，并且所有功能都支持动态控制：

```tsx
import React, { useRef, useState } from 'react';
import { AggloTreeTable, AggloTreeTableHandles } from 'agglo-tree-table';

// 生成大量测试数据
const generateData = (count: number) => {
  const departments = ['技术部', '产品部', '设计部', '市场部', '运营部'];
  const teams = ['前端组', '后端组', '移动端', '测试组', '运维组'];
  const levels = ['P5', 'P6', 'P7', 'P8'];
  const data = [];
  
  for (let i = 0; i < count; i++) {
    data.push({
      id: `emp_${i}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      team: teams[Math.floor(Math.random() * teams.length)],
      name: `员工${i}`,
      level: levels[Math.floor(Math.random() * levels.length)],
      salary: Math.floor(Math.random() * 50000) + 50000, // 5万到10万的随机薪资
      bonus: Math.floor(Math.random() * 20000) + 10000,  // 1万到3万的随机奖金
      performance: (Math.random() * 3 + 2).toFixed(1),   // 2.0到5.0的随机绩效
      entryDate: `202${Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    });
  }
  
  return data;
};

export default () => {
  const tableRef = useRef<AggloTreeTableHandles>(null);
  const [data] = useState(() => generateData(10000)); // 生成1万条数据
  const [showColumnManagement, setShowColumnManagement] = useState(true);
  const [columnManagerPosition, setColumnManagerPosition] = useState<'left' | 'right'>('right');
  const [groupKeys, setGroupKeys] = useState<string[]>(['department', 'team']);
  const [showExpandAll, setShowExpandAll] = useState(true);
  const [height, setHeight] = useState(600);
  const [enableAggregation, setEnableAggregation] = useState(true);
  
  const columns = [
    {
      title: '组织架构',
      children: [
        {
          title: '部门',
          dataIndex: 'department',
          width: 120,
        },
        {
          title: '团队',
          dataIndex: 'team',
          width: 120,
        }
      ]
    },
    {
      title: '员工信息',
      children: [
        {
          title: '姓名',
          dataIndex: 'name',
          width: 120,
        },
        {
          title: '职级',
          dataIndex: 'level',
          width: 80,
        },
        {
          title: '入职日期',
          dataIndex: 'entryDate',
          width: 120,
        }
      ]
    },
    {
      title: '薪酬信息',
      children: [
        {
          title: '基本工资',
          dataIndex: 'salary',
          width: 120,
        },
        {
          title: '年度奖金',
          dataIndex: 'bonus',
          width: 120,
        }
      ]
    },
    {
      title: '绩效评估',
      children: [
        {
          title: '年度绩效',
          dataIndex: 'performance',
          width: 100,
        }
      ]
    }
  ];

  return (
    <div>
      <div style={{ 
        marginBottom: 16, 
        display: 'flex', 
        gap: 16, 
        flexWrap: 'wrap',
        padding: 16,
        border: '1px solid #f0f0f0',
        borderRadius: 4
      }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>基础功能</h4>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <label>
              <input 
                type="checkbox" 
                checked={showColumnManagement}
                onChange={(e) => setShowColumnManagement(e.target.checked)}
              />
              列管理
            </label>
            
            <label>
              <input 
                type="checkbox" 
                checked={showExpandAll}
                onChange={(e) => setShowExpandAll(e.target.checked)}
              />
              全部展开/收起按钮
            </label>
            
            <label>
              <input 
                type="checkbox" 
                checked={enableAggregation}
                onChange={(e) => setEnableAggregation(e.target.checked)}
              />
              数据聚合
            </label>
          </div>
        </div>
        
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>分组设置</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <label>
              <input 
                type="checkbox" 
                checked={groupKeys.includes('department')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setGroupKeys(prev => [...prev, 'department']);
                  } else {
                    setGroupKeys(prev => prev.filter(key => key !== 'department'));
                  }
                }}
              />
              按部门分组
            </label>
            
            <label>
              <input 
                type="checkbox" 
                checked={groupKeys.includes('team')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setGroupKeys(prev => [...prev, 'team']);
                  } else {
                    setGroupKeys(prev => prev.filter(key => key !== 'team'));
                  }
                }}
              />
              按团队分组
            </label>
          </div>
        </div>
        
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>列管理位置</h4>
          <div style={{ display: 'flex', gap: 8 }}>
            <label>
              <input 
                type="radio" 
                name="columnManagerPosition" 
                value="left"
                checked={columnManagerPosition === 'left'}
                onChange={(e) => setColumnManagerPosition(e.target.value as 'left' | 'right')}
              />
              左侧
            </label>
            <label>
              <input 
                type="radio" 
                name="columnManagerPosition" 
                value="right"
                checked={columnManagerPosition === 'right'}
                onChange={(e) => setColumnManagerPosition(e.target.value as 'left' | 'right')}
              />
              右侧
            </label>
          </div>
        </div>
        
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>表格高度</h4>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input 
              type="range" 
              min="300" 
              max="800" 
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              style={{ width: 100 }}
            />
            <span>{height}px</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => tableRef.current?.expandAll()}>全部展开</button>
          <button onClick={() => tableRef.current?.collapseAll()}>全部收起</button>
        </div>
      </div>
      
      <AggloTreeTable
        ref={tableRef}
        columns={columns}
        dataSource={data}
        groupKeys={groupKeys}
        rowKey="id"
        showColumnManagement={showColumnManagement}
        columnManagerPosition={columnManagerPosition}
        height={height}
        AggregateKeys={enableAggregation ? {
          equalKeys: ['level'],
          addBNkeys: ['salary', 'bonus'],
        } : undefined}
        expandable={{
          showExpandAll: showExpandAll,
          expandColumnTitle: '组织架构',
        }}
      />
    </div>
  );
};
```
