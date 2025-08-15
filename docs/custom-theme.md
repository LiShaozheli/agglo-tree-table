---
title: 自定义样式和主题
---

# 自定义样式和主题

AggloTreeTable 支持多种主题样式，并允许用户完全自定义组件的外观。我们提供了预定义的主题，同时也支持创建自定义主题。

## 预定义主题

目前我们提供了三种预定义主题：

- `default` - 默认主题
- `antd` - 类似 Ant Design 风格
- `agGrid` - 类似 AG Grid 风格

### 使用预定义主题

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
    theme="default" // 使用默认主题
  />
);
```

### Ant Design 风格示例

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
    theme="antd"
  />
);
```

### AG Grid 风格示例

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
    theme="agGrid" // 使用 AG Grid 风格
  />
);
```

## 自定义主题

如果预定义的主题不满足你的需求，你可以创建自定义主题。

### 主题配置选项

```typescript
interface TableTheme {
  /** 主色调 */
  primaryColor?: string;
  /** 表头背景色 */
  headerBgColor?: string;
  /** 表头文字颜色 */
  headerTextColor?: string;
  /** 表格主体背景色 */
  bodyBgColor?: string;
  /** 表格主体文字颜色 */
  bodyTextColor?: string;
  /** 边框颜色 */
  borderColor?: string;
  /** 行悬停背景色 */
  rowHoverBgColor?: string;
  /** 交替行背景色 */
  alternatingRowBgColor?: string;
  /** 字体大小 */
  fontSize?: number;
  /** 边框圆角 */
  borderRadius?: number;
  /** 表头字体粗细 */
  headerFontWeight?: number | string;
  /** 是否显示列分割线 */
  showColumnBorders?: boolean;
  /** 是否显示行分割线 */
  showRowBorders?: boolean;
  /** 是否显示表头行分割线 */
  showHeaderRowBorder?: boolean;
  /** 行分割线颜色 */
  rowBorderColor?: string;
  /** 列分割线样式 */
  columnBorderStyle?: string;
  /** 行分割线样式 */
  rowBorderStyle?: string;
  /** 表头列分割线样式 */
  headerColumnBorderStyle?: string;
  /** 表头行分割线样式 */
  headerRowBorderStyle?: string;
}
```

### 自定义主题示例

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
    theme={{
      primaryColor: '#007bff',
      headerBgColor: '#f8f9fa',
      headerTextColor: '#212529',
      bodyBgColor: '#ffffff',
      bodyTextColor: '#212529',
      borderColor: '#dee2e6',
      rowHoverBgColor: '#e9ecef',
      alternatingRowBgColor: '#f8f9fa',
      fontSize: 13,
      borderRadius: 0,
      headerFontWeight: 600,
      showColumnBorders: true,
      showRowBorders: false,
      showHeaderRowBorder: true,
      headerRowBorderStyle: '1px solid #dee2e6',
    }}
  />
);
```

### 深色主题示例

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
    theme={{
      primaryColor: '#007bff',
      headerBgColor: '#212529',
      headerTextColor: '#ffffff',
      bodyBgColor: '#343a40',
      bodyTextColor: '#ffffff',
      borderColor: '#495057',
      rowHoverBgColor: '#495057',
      alternatingRowBgColor: '#343a40',
      fontSize: 14,
      borderRadius: 4,
      showColumnBorders: true,
      showRowBorders: true,
      showHeaderRowBorder: true,
      rowBorderColor: '#495057',
      headerRowBorderStyle: '1px solid #495057',
    }}
  />
);
```

## 局部样式自定义

除了整体主题配置外，你还可以对特定列或元素进行样式自定义。

### 列样式自定义

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
    // 自定义表头样式
    headerStyle: {
      backgroundColor: '#1890ff',
      color: '#ffffff',
      fontWeight: 'bold',
    },
    // 自定义单元格样式
    style: {
      backgroundColor: '#f0f8ff',
      color: '#333',
    }
  },
  {
    title: 'Contract',
    dataIndex: 'contract',
    width: 100,
    headerStyle: {
      backgroundColor: '#fafafa',
      color: '#000000d9',
    },
    style: {
      backgroundColor: '#ffffff',
      fontWeight: 'bold',
    }
  },
  {
    title: 'PV',
    dataIndex: 'pv',
    width: 120,
    headerStyle: {
      backgroundColor: '#52c41a',
      color: '#ffffff',
      textAlign: 'right',
    },
    style: {
      backgroundColor: '#f6ffed',
      color: '#52c41a',
      textAlign: 'right',
    }
  },
  {
    title: 'Delta',
    dataIndex: 'delta',
    width: 120,
    headerStyle: {
      backgroundColor: '#722ed1',
      color: '#ffffff',
      textAlign: 'right',
    },
    style: {
      backgroundColor: '#f9f0ff',
      color: '#722ed1',
      textAlign: 'right',
    }
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

通过这些方式，你可以完全控制 AggloTreeTable 的外观，以适应你的应用设计风格。