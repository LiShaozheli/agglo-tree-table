# AggloTreeTable Component

[![NPM version](https://img.shields.io/npm/v/agglo-tree-table.svg?style=flat)](https://npmjs.org/package/agglo-tree-table)
[![NPM downloads](http://img.shields.io/npm/dm/agglo-tree-table.svg?style=flat)](https://npmjs.org/package/agglo-tree-table)

一个支持金融数据聚合功能的 React 树形表格组件，支持虚拟化渲染和大规模数据展示。

## 特性

- 🚀 虚拟化渲染：支持万级数据渲染
- 🌲 树形结构：支持多级数据分组
- 💰 数据聚合：支持 BigNumber 精确计算
- ➕ 可展开行：支持树节点展开/折叠
- 📌 粘性表头：滚动时保持表头可见
- 🎨 高度可定制：支持多种配置选项

## 安装

```
npm install agglo-tree-table --save
```

```bash
yarn add agglo-tree-table
```

```bash
pnpm add agglo-tree-table
```

## 功能示例

以下示例展示了组件的主要功能特性，包括树形分组、数据聚合和可展开行：

```tsx
import React, { useRef } from 'react';
import { AggloTreeTable, AggloTreeTableHandles } from 'agglo-tree-table';
import 'agglo-tree-table/dist/style.css';

const DemoComponent = () => {
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
      // 自定义单元格样式
      onCell: () => ({ style: { textAlign: 'center' } }),
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      width: 120,
      // 使用 BigNumber 进行精确计算的聚合字段
      onCell: () => ({ style: { textAlign: 'right' } }),
    },
    {
      title: '绩效',
      dataIndex: 'performance',
      width: 100,
      // 只有当所有子项值相等时才显示的字段
      onCell: () => ({ style: { textAlign: 'center' } }),
    }
  ];

  const data = [
    {
      id: '1',
      department: '技术部',
      group: '前端组',
      name: '张三',
      age: 25,
      salary: '15000.00',
      performance: 'A',
    },
    {
      id: '2',
      department: '技术部',
      group: '前端组',
      name: '李四',
      age: 28,
      salary: '18000.00',
      performance: 'A',
    },
    {
      id: '3',
      department: '技术部',
      group: '后端组',
      name: '王五',
      age: 30,
      salary: '19000.00',
      performance: 'B',
    },
    {
      id: '4',
      department: '产品部',
      group: '产品组',
      name: '赵六',
      age: 32,
      salary: '20000.00',
      performance: 'A',
    },
    {
      id: '5',
      department: '产品部',
      group: '设计组',
      name: '钱七',
      age: 27,
      salary: '17000.00',
      performance: 'B',
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
        // 按部门和组别进行多级分组
        groupKeys={['department', 'group']}
        // 配置数据聚合
        AggregateKeys={{
          // 使用简单加法求和的字段
          addkeys: ['age'],
          // 使用 BigNumber 精确计算的字段
          addBNkeys: ['salary'],
          // 仅当所有子项值相等时才显示的字段
          equalKeys: ['performance']
        }}
        // 配置行键
        rowKey="id"
        // 配置可展开功能
        expandable={{
          // 显示全部展开/收起按钮
          showExpandAll: true,
          // 自定义展开图标
          expandIcon: (isExpand, value, record) => 
            isExpand ? '▼' : '▶',
          // 自定义展开列宽度
          expandColumnWidth: 200,
          // 自定义展开列标题
          expandColumnTitle: '成员详情'
        }}
        // 自定义排序函数
        sort={(a, b) => a.age - b.age}
      />
    </div>
  );
};

export default DemoComponent;
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

## 开发

```
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建库
pnpm build

# 构建文档
pnpm docs:build

# 启动文档开发服务器
pnpm docs:dev
```

## LICENSE

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

```
npm install tree-table-component
```

or
或者

```
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