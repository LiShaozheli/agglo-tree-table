---
nav:
  title: 组件
  path: /components
---

# VirtualTable

VirtualTable 是一个用于高效渲染大型数据集的虚拟化表格组件。该组件使用虚拟化技术仅渲染可见行，从而提高大型数据集的性能。它还支持可展开行和粘性表头。

## 代码演示

### 基础用法

VirtualTable 可以独立使用，用于展示大量数据的场景。

```tsx
import React from 'react';
import { VirtualTable } from 'agglo-tree-table';

export default () => {
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
    },
  ];

  const data = Array.from({ length: 10000 }).map((_, index) => ({
    key: index,
    name: `Name ${index}`,
    age: Math.floor(Math.random() * 100),
    address: `Address ${index}`,
  }));

  return (
    <VirtualTable
      columns={columns}
      dataSource={data}
      rowKey="key"
    />
  );
};
```

### 使用全部展开/收起功能

通过 [showExpandAll](file:///d:/work/agglo-tree-table/src/components/VirtualTable/index.tsx#L36-L36) 属性启用全部展开/收起功能，并通过 ref 调用相关方法。

```tsx
import React, { useRef } from 'react';
import { VirtualTable, VirtualTableHandles } from 'agglo-tree-table';

export default () => {
  const columns = [
    {
      title: '部门',
      dataIndex: 'department',
      width: 150,
    },
    {
      title: '组别',
      dataIndex: 'group',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
    }
  ];

  const data = [
    {
      id: '1',
      department: '技术部',
      children: [
        {
          id: '1-1',
          group: '前端组',
          children: [
            { id: '1-1-1', name: '张三', age: 25 },
            { id: '1-1-2', name: '李四', age: 28 }
          ]
        },
        {
          id: '1-2',
          group: '后端组',
          children: [
            { id: '1-2-1', name: '王五', age: 30 },
            { id: '1-2-2', name: '赵六', age: 32 }
          ]
        }
      ]
    },
    {
      id: '2',
      department: '产品部',
      children: [
        {
          id: '2-1',
          group: '产品组',
          children: [
            { id: '2-1-1', name: '钱七', age: 27 },
            { id: '2-1-2', name: '孙八', age: 29 }
          ]
        }
      ]
    }
  ];
  
  const tableRef = useRef<VirtualTableHandles>(null);

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => tableRef.current?.expandAll()}>全部展开</button>
        <button onClick={() => tableRef.current?.collapseAll()} style={{ marginLeft: '10px' }}>全部收起</button>
      </div>
      <VirtualTable
        ref={tableRef}
        columns={columns}
        dataSource={data}
        rowKey="id"
        expandable={{
          expandRowByClick: true,
          expandDataIndex: 'department',
          showExpandAll: true,
        }}
      />
    </div>
  );
};
```

## API

### VirtualTableProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rowKey | 唯一行键 | `string` | - |
| columns | 表格列配置 | `any[]` | `[]` |
| dataSource | 表格数据源 | `Array<Record<string, any>>` | `[]` |
| rowHeight | 每行的高度 | `number` | `40` |
| headerRowHeight | 表头行的高度 | `number` | `40` |
| onRow | 行事件处理器 | `(record: any, index: any) => Record<string, any>` | - |
| displayColumns | 要显示的列（仅显示这些列） | `string[]` | `[]` |
| loading | 加载状态 | `boolean` | `false` |
| expandable | 可展开配置 | `ExpandableProps` | - |

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

### VirtualTableHandles

通过 ref 可以访问以下方法：

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| expandAll | 展开所有行 | `() => void` |
| collapseAll | 收起所有行 | `() => void` |

## 使用场景

### 大数据展示

VirtualTable 适用于需要展示大量数据的场景，通过虚拟化技术优化渲染性能：

```tsx
import React from 'react';
import { VirtualTable } from 'agglo-tree-table';

const largeDataset = Array.from({ length: 10000 }).map((_, index) => ({
  id: index,
  name: `Name ${index}`,
  value: Math.floor(Math.random() * 1000)
}));

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    width: 100,
  }
];

export default () => (
  <VirtualTable
    columns={columns}
    dataSource={largeDataset}
    rowKey="id"
    rowHeight={35}
  />
);
```

### 可展开表格

支持展开行显示详细信息：

```tsx
import React from 'react';
import { VirtualTable } from 'agglo-tree-table';

const data = [
  {
    id: '1',
    name: '技术部',
    children: [
      { id: '1-1', name: '张三', value: 100 },
      { id: '1-2', name: '李四', value: 200 }
    ]
  },
  {
    id: '2',
    name: '产品部',
    children: [
      { id: '2-1', name: '王五', value: 150 },
      { id: '2-2', name: '赵六', value: 250 }
    ]
  }
];

const columns = [
  {
    title: '部门',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '员工',
    dataIndex: 'value',
    width: 100,
  }
];

export default () => (
  <VirtualTable
    columns={columns}
    dataSource={data}
    rowKey="id"
    expandable={{
      expandRowByClick: true,
      expandDataIndex: 'name',
      showExpandAll: true,
    }}
  />
);
```