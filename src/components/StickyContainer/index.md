---
nav:
  title: 组件
  path: /components
---

# StickyContainer

StickyContainer 是一个通用的粘滞容器组件，可以将任意内容在滚动时固定在页面顶部。该组件会自动检测页面上已存在的固定元素，并将自身定位在这些固定元素的下方，同时支持水平滚动同步。

## 代码演示

### 基础用法

StickyContainer 可以将任意内容在滚动时固定在页面顶部：

```tsx
import React, { useRef } from 'react';
import { StickyContainer } from 'agglo-tree-table';

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <StickyContainer containerRef={containerRef}>
        <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          borderBottom: '1px solid #ccc' 
        }}>
          这是一个粘滞的头部内容
        </div>
      </StickyContainer>
      <div ref={containerRef} style={{ height: 400, overflow: 'auto' }}>
        <div style={{ padding: '20px' }}>
          {Array.from({ length: 100 }).map((_, index) => (
            <div key={index} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              内容行 {index + 1}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
```

### 在表格中使用

StickyContainer 常用于表格表头的粘滞效果：

```tsx
import React, { useRef } from 'react';
import { StickyContainer } from 'agglo-tree-table';

export default () => {
  const tableRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <StickyContainer containerRef={tableRef}>
        <div style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ padding: '10px', border: '1px solid #ccc', width: '33%' }}>姓名</th>
                <th style={{ padding: '10px', border: '1px solid #ccc', width: '33%' }}>年龄</th>
                <th style={{ padding: '10px', border: '1px solid #ccc', width: '34%' }}>地址</th>
              </tr>
            </thead>
          </table>
        </div>
      </StickyContainer>
      <div ref={tableRef} style={{ height: 400, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {Array.from({ length: 100 }).map((_, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ccc', width: '33%' }}>姓名 {index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', width: '33%' }}>{20 + (index % 30)}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', width: '34%' }}>地址 {index + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
```

### 横向滚动示例

StickyContainer 支持横向滚动同步，确保粘滞内容与容器内容保持水平对齐：

```tsx
import React, { useRef } from 'react';
import { StickyContainer } from 'agglo-tree-table';

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <div ref={containerRef}  style={{ overflow: 'auto' }}>
        <StickyContainer containerRef={containerRef}>
          <div style={{ 
            display: 'flex',
            background: '#f0f0f0',
            width: '1200px'  // 设置一个大于容器宽度的最小宽度以启用横向滚动
          }}>
            {Array.from({ length: 10 }).map((_, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '10px', 
                  borderRight: '1px solid #ccc',
                  width: '120px',
                  fontWeight: 'bold'
                }}
              >
                表头列 {index + 1}
              </div>
            ))}
          </div>
        </StickyContainer>
        <div>
          {Array.from({ length: 20 }).map((_, rowIndex) => (
            <div 
              key={rowIndex} 
              style={{
                display: 'flex',
                borderBottom: '1px solid #eee',
                width: '1200px'
              }}
            >
              {Array.from({ length: 10 }).map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  style={{ 
                    padding: '10px', 
                    borderRight: '1px solid #eee',
                    width: '120px'
                  }}
                >
                  数据行 {rowIndex + 1}-列 {colIndex + 1}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
```

### 自定义样式

可以通过 `boxShadow` 和 `zIndex` 属性自定义粘滞状态下的样式：

```tsx
import React, { useRef } from 'react';
import { StickyContainer } from 'agglo-tree-table';

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <StickyContainer 
        containerRef={containerRef}
        boxShadow="0 4px 12px rgba(0,0,0,0.2)"
        zIndex={2000}
      >
        <div style={{ 
          background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', 
          padding: '15px', 
          color: 'white',
          fontWeight: 'bold'
        }}>
          自定义样式的粘滞容器
        </div>
      </StickyContainer>
      <div ref={containerRef} style={{ height: 400, overflow: 'auto' }}>
        <div style={{ padding: '20px' }}>
          {Array.from({ length: 50 }).map((_, index) => (
            <div key={index} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
              内容区域 {index + 1}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
```

## API

### StickyContainerProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| containerRef | 容器引用，用于同步水平滚动和获取容器位置信息 | `React.RefObject<HTMLDivElement>` | - |
| boxShadow | 粘滞状态下组件的阴影样式 | `string` | `'0 2px 8px rgba(0,0,0,0.15)'` |
| zIndex | 粘滞状态下组件的z-index值 | `number` | `1000` |
| children | 需要应用粘滞效果的内容 | `ReactNode` | - |

## 工作原理

StickyContainer 组件通过以下方式实现粘滞效果：

1. **固定元素检测**：组件会自动检测页面上所有固定定位或粘性定位的元素，并计算它们的总高度
2. **粘滞状态管理**：当内容滚动到固定元素下方且容器底部仍在视口内时，激活粘滞状态
3. **水平滚动同步**：监听容器的滚动事件，同步粘滞内容的水平位置
4. **响应式布局**：在窗口大小改变时重新计算位置和尺寸

## 使用场景

### 表格表头

最常见的使用场景是在虚拟表格中实现表头粘滞效果，确保用户在浏览大量数据时始终能看到表头信息。

### 导航栏

在长页面中，可以将导航栏设置为粘滞状态，方便用户随时访问导航功能。

### 筛选器面板

在数据展示页面中，可以将筛选器面板设置为粘滞状态，方便用户随时调整筛选条件。

## 注意事项

1. **容器引用**：必须提供正确的容器引用，组件通过该引用来监听滚动事件和获取位置信息
2. **水平同步**：为了实现水平滚动同步，容器需要有明确的滚动行为
3. **固定元素检测**：组件会自动检测页面上的固定元素，但只检测位于页面顶部的元素
4. **性能考虑**：在复杂的页面布局中，固定元素检测可能会影响性能，建议在必要时进行优化