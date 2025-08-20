---
title: 自定义样式和主题
---

# 自定义样式和主题

AggloTreeTable 支持多种主题样式，并允许用户完全自定义组件的外观。我们提供了预定义的主题，同时也支持创建自定义主题。

## 预定义主题

目前我们提供了五种预定义主题：

- `default` - 默认主题（已弃用，建议使用 light）
- `antd` - 类似 Ant Design 风格
- `agGrid` - 类似 AG Grid 风格
- `light` - 明亮模式主题（默认）
- `dark` - 暗黑模式主题

### 使用预定义主题

```tsx
import React from 'react';
import { VirtualTable } from 'agglo-tree-table';

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
    sorter: true,
  },
  {
    title: 'Contract',
    dataIndex: 'contract',
    width: 150,
    sorter: true,
  },
  {
    title: 'PV',
    dataIndex: 'pv',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
  {
    title: 'Delta',
    dataIndex: 'delta',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
];

export default () => (
  <>
    <h3>明亮模式 (默认)</h3>
    <VirtualTable
      columns={columns}
      dataSource={data}
      rowKey="id"
      theme="light"
    />
    
    <h3 style={{ marginTop: 32 }}>暗黑模式</h3>
    <div style={{ background: '#141414', padding: 20, borderRadius: 4 }}>
      <VirtualTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        theme="dark"
      />
    </div>
  </>
);
```

### 明亮模式与暗黑模式对比

明亮模式和暗黑模式是专门为现代用户界面设计的两种主题：

#### 明亮模式 (light)
- 背景色：白色/浅灰色背景
- 文字色：深色文字
- 适合在光线充足的环境中使用
- 默认启用

#### 暗黑模式 (dark)
- 背景色：深灰色/黑色背景
- 文字色：白色/浅色文字
- 减少眼部疲劳，尤其在低光环境下
- 行悬停背景色使用 `#262626`，避免过于明亮
- 更适合夜间或低光环境使用

```tsx
import React, { useState } from 'react';
import { VirtualTable } from 'agglo-tree-table';

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
    sorter: true,
  },
  {
    title: 'Contract',
    dataIndex: 'contract',
    width: 150,
    sorter: true,
  },
  {
    title: 'PV',
    dataIndex: 'pv',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
  {
    title: 'Delta',
    dataIndex: 'delta',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
];

export default () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button 
          type="button"
          onClick={() => setTheme('light')}
          style={{ 
            marginRight: 8,
            padding: '4px 12px',
            backgroundColor: theme === 'light' ? '#1890ff' : '#f0f0f0',
            color: theme === 'light' ? '#fff' : '#000',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          明亮模式
        </button>
        <button 
          type="button"
          onClick={() => setTheme('dark')}
          style={{ 
            padding: '4px 12px',
            backgroundColor: theme === 'dark' ? '#177ddc' : '#f0f0f0',
            color: theme === 'dark' ? '#fff' : '#000',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          暗黑模式
        </button>
      </div>
      
      <div style={theme === 'dark' ? { background: '#141414', padding: '20px', borderRadius: '4px' } : {}}>
        <VirtualTable
          columns={columns}
          dataSource={data}
          rowKey="id"
          theme={theme}
        />
      </div>
    </div>
  );
};
```

## 自定义主题

除了使用预定义主题，您还可以通过传递一个对象来自定义主题样式。

### 主题配置项

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| primaryColor | string | 主色调 |
| headerBgColor | string | 表头背景色 |
| headerTextColor | string | 表头文字颜色 |
| bodyBgColor | string | 表格主体背景色 |
| bodyTextColor | string | 表格主体文字颜色 |
| borderColor | string | 边框颜色 |
| rowHoverBgColor | string | 行悬停背景色 |
| alternatingRowBgColor | string | 交替行背景色 |
| fontSize | number | 字体大小 |
| borderRadius | number | 边框圆角 |
| headerFontWeight | number \| string | 表头字体粗细 |
| showColumnBorders | boolean | 是否显示列分割线 |
| showRowBorders | boolean | 是否显示行分割线 |
| showHeaderRowBorder | boolean | 是否显示表头行分割线 |
| columnBorderColor | string | 列分割线颜色 |
| rowBorderColor | string | 行分割线颜色 |
| columnBorderStyle | string | 列分割线样式 |
| rowBorderStyle | string | 行分割线样式 |
| headerColumnBorderStyle | string | 表头列分割线样式 |
| headerRowBorderStyle | string | 表头行分割线样式 |

### 创建自定义主题

```tsx
import React from 'react';
import { VirtualTable } from 'agglo-tree-table';

const customTheme = {
  primaryColor: '#001529',
  headerBgColor: '#f0f2f5',
  headerTextColor: '#001529',
  bodyBgColor: '#ffffff',
  bodyTextColor: '#001529',
  borderColor: '#d9d9d9',
  rowHoverBgColor: '#e6f7ff',
  alternatingRowBgColor: '#fafafa',
  fontSize: 14,
  borderRadius: 4,
  headerFontWeight: 600,
  showColumnBorders: true,
  showRowBorders: true,
  showHeaderRowBorder: true,
};

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
    sorter: true,
  },
  {
    title: 'Contract',
    dataIndex: 'contract',
    width: 150,
    sorter: true,
  },
  {
    title: 'PV',
    dataIndex: 'pv',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
  {
    title: 'Delta',
    dataIndex: 'delta',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
];

export default () => (
  <VirtualTable
    columns={columns}
    dataSource={data}
    rowKey="id"
    theme={customTheme}
  />
);
```

### 基于预定义主题的自定义

您也可以基于预定义主题进行扩展：

```tsx
import React from 'react';
import { VirtualTable, predefinedThemes } from 'agglo-tree-table';

// 基于暗黑模式创建自定义主题
const customDarkTheme = {
  ...predefinedThemes.dark,
  primaryColor: '#722ed1', // 使用紫色作为主色调
  rowHoverBgColor: '#303030', // 调整悬停背景色
};

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
    sorter: true,
  },
  {
    title: 'Contract',
    dataIndex: 'contract',
    width: 150,
    sorter: true,
  },
  {
    title: 'PV',
    dataIndex: 'pv',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
  {
    title: 'Delta',
    dataIndex: 'delta',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
];

export default () => (
  <div style={{ background: '#141414', padding: 20, borderRadius: 4 }}>
    <VirtualTable
      columns={columns}
      dataSource={data}
      rowKey="id"
      theme={customDarkTheme}
    />
  </div>
);
```

## 主题切换最佳实践

在实际应用中，您可能需要根据用户的偏好或系统设置来动态切换主题。

### 响应系统主题偏好

```tsx
import React, { useState, useEffect } from 'react';
import { VirtualTable } from 'agglo-tree-table';

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
    sorter: true,
  },
  {
    title: 'Contract',
    dataIndex: 'contract',
    width: 150,
    sorter: true,
  },
  {
    title: 'PV',
    dataIndex: 'pv',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
  {
    title: 'Delta',
    dataIndex: 'delta',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
];

export default () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 检查系统主题偏好
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // 监听系统主题变化
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div style={theme === 'dark' ? { background: '#141414', padding: '20px', borderRadius: '4px' } : {}}>
      <VirtualTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        theme={theme}
      />
    </div>
  );
};
```

### 手动切换主题

```tsx
import React, { useState } from 'react';
import { VirtualTable } from 'agglo-tree-table';

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
    sorter: true,
  },
  {
    title: 'Contract',
    dataIndex: 'contract',
    width: 150,
    sorter: true,
  },
  {
    title: 'PV',
    dataIndex: 'pv',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
  {
    title: 'Delta',
    dataIndex: 'delta',
    width: 150,
    sorter: true,
    render: (value) => value.toLocaleString(),
  },
];

export default () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 16 }}>
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={() => setTheme('light')}
          />
          明亮模式
        </label>
        <label>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={() => setTheme('dark')}
          />
          暗黑模式
        </label>
      </div>
      
      <div style={theme === 'dark' ? { background: '#141414', padding: '20px', borderRadius: '4px' } : {}}>
        <VirtualTable
          columns={columns}
          dataSource={data}
          rowKey="id"
          theme={theme}
        />
      </div>
    </div>
  );
};
```

## 主题设计原则

### 暗黑模式设计要点

1. **悬停背景色优化**：
   - 使用 `#262626` 作为暗黑模式的行悬停背景色
   - 避免使用过于明亮的颜色，减少眼部疲劳

2. **对比度考虑**：
   - 确保文字与背景有足够的对比度
   - 链接和交互元素应清晰可见

3. **一致性**：
   - 保持明亮模式和暗黑模式的布局一致
   - 只改变颜色方案，不改变结构

### 可访问性

1. **颜色对比**：
   - 确保所有文本与其背景的对比度至少为 4.5:1
   - 对于大号文本，对比度至少为 3:1

2. **焦点指示器**：
   - 确保键盘焦点在所有主题下都清晰可见
   - 使用高对比度的颜色或明显的边框

通过以上方式，您可以轻松地在 AggloTreeTable 中使用和自定义主题，为用户提供更好的视觉体验。