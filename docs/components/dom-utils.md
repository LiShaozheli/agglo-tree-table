# DOM 工具函数

DOM 工具函数提供了一些处理页面 DOM 元素的实用方法。

## calculateFixedElementsHeight

计算页面顶部固定元素的总高度。这个函数用于确定粘性表头应该固定的偏移量，以避免被页面上其他固定元素遮挡。

### 函数签名

```typescript
export declare function calculateFixedElementsHeight(): number;
```

### 功能说明

此函数会遍历页面上的所有元素，找出具有以下特征的元素：
1. 具有 `position: fixed` 或 `position: sticky` 样式
2. 位于页面顶部（`top: 0` 或接近 0 的位置）
3. 按照 z-index 层级顺序排列

然后计算这些元素的总高度，用于确定粘性元素的偏移位置。

### 使用示例

```typescript
import { calculateFixedElementsHeight } from 'agglo-tree-table';

// 获取页面顶部固定元素的总高度
const fixedHeight = calculateFixedElementsHeight();
console.log(`页面顶部固定元素总高度: ${fixedHeight}px`);
```

### 在 StickyContainer 中的使用

StickyContainer 组件内部使用此函数来计算粘性表头的偏移量：

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
      <div ref={containerRef} style={{ overflow: 'auto' }}>
        <div style={{ padding: '20px' }}>
          {Array.from({ length: 40 }).map((_, index) => (
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

StickyContainer 会自动调用 [calculateFixedElementsHeight](file://d:\work\agglo-tree-table\src\utils\domUtils.ts#L15-L54) 函数来确定合适的偏移量，确保表头不会被页面上其他固定元素遮挡。

### 注意事项

1. 该函数会遍历页面上的所有元素，因此在大型页面上可能会有一定的性能开销
2. 函数只考虑 `position: fixed` 和 `position: sticky` 的元素
3. 只有 `top` 值为 0 或接近 0（≤1px）的元素才会被计算在内
4. 元素按照 z-index 值进行排序，以确保正确的层级计算