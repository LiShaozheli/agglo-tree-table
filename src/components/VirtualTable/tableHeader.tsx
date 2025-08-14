import React, { FC, memo, useEffect, useRef, useState } from 'react';

/**
 * Props for the TableHeader component
 * TableHeader 组件的 Props
 */
export interface TableHeaderProps {
  /** Table columns */
  /** 表格列 */
  columns: Record<string, any>;
  /** Header row height */
  /** 表头行高度 */
  headerRowHeight?: number;
  /** Fixed table height */
  /** 固定表格高度 */
  tableFixedHeight?: number;
  /** Table reference */
  /** 表格引用 */
  tableRef: React.RefObject<HTMLDivElement>;
  /** Column widths */
  /** 列宽度 */
  columnWidth: Record<string, number>;
  /** Table container reference */
  /** 表格容器引用 */
  containerRef?: React.RefObject<HTMLDivElement>;
}

/**
 * A table header component with sticky functionality.
 * 一个具有粘性功能的表头组件。
 * 
 * This component renders table headers and makes them sticky when scrolling.
 * 该组件渲染表格头部，并在滚动时使其粘性固定。
 */
const TableHeader: FC<TableHeaderProps> = props => {
  const { columns, headerRowHeight = 40, tableFixedHeight = 48, tableRef, columnWidth, containerRef } = props;
  const [headerLayer, setHeaderLayer] = useState(0);
  const [sticky, setSticky] = useState(false);
  const [tableHeaderHeight, setTableHeaderHeight] = useState(0);
  const [tableSize, setTableSize] = useState<Record<string, any>>({});
  const [scrollLeft, setScrollLeft] = useState(0);
  const [stickyOffset, setStickyOffset] = useState(0);

  const tableHeaderRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);
  const tableBottomRef = useRef<HTMLDivElement>(null);

  // 设置表头高度
  // Set table header height
  useEffect(() => {
    const tableHeaderSize = tableHeaderRef?.current?.getBoundingClientRect();
    setTableHeaderHeight(tableHeaderSize?.height || 0);
  }, [tableHeaderRef, sticky]);

  // 计算粘滞偏移量（考虑页面上其他粘滞元素）
  // Calculate sticky offset (considering other sticky elements on the page)
  const calculateStickyOffset = () => {
    // 查找页面上所有粘滞元素并计算它们的总高度
    // Find all sticky elements on the page and calculate their total height
    const stickyElements = document.querySelectorAll('[style*="position: sticky"], [style*="position: fixed"]');
    let offset = 0;
    
    stickyElements.forEach(element => {
      const elementStyle = window.getComputedStyle(element);
      const isSticky = elementStyle.position === 'sticky' || elementStyle.position === 'fixed';
      const isTopSticky = elementStyle.top === '0px' || elementStyle.top === '0';
      
      if (isSticky && isTopSticky) {
        const rect = element.getBoundingClientRect();
        offset += rect.height;
      }
    });
    
    return offset;
  };

  // 设置表头是否为粘滞状态
  // Set whether the header is sticky
  const bindHandleScroll = () => {
    const positionTypes = positionRef?.current?.getBoundingClientRect();
    const containerTypes = containerRef?.current?.getBoundingClientRect();
    const currentStickyOffset = calculateStickyOffset();
    setStickyOffset(currentStickyOffset);

    // 当表头滚动到视口顶部（考虑其他粘滞元素）时，激活粘滞状态
    // Activate sticky state when the header scrolls to the top of the viewport (considering other sticky elements)
    if (positionTypes?.top !== undefined && positionTypes?.top < currentStickyOffset && !sticky) {
      // 同时检查表格容器底部是否还在视口内，避免表格已经滚出视口的情况
      // Also check if the table container bottom is still in the viewport to avoid the case where the table has scrolled out of the viewport
      if (containerTypes?.bottom !== undefined && containerTypes?.bottom > currentStickyOffset) {
        setSticky(true);
      }
    } 
    // 当表头重新回到原来位置时，取消粘滞状态
    // Cancel sticky state when the header returns to its original position
    else if (positionTypes?.top !== undefined && positionTypes?.top >= currentStickyOffset && sticky) {
      setSticky(false);
    }
    // 当表格容器底部滚动到视口顶部以上时，取消粘滞状态
    // Cancel sticky state when the table container bottom scrolls above the top of the viewport
    else if (containerTypes?.bottom !== undefined && containerTypes?.bottom < currentStickyOffset && sticky) {
      setSticky(false);
    }
  };

  // 设置表头粘滞状态的左右滚动
  // Set left/right scrolling for sticky header
  const HandleScrollLeft = () => {
    const positionTypes = positionRef?.current?.getBoundingClientRect();
    setScrollLeft(positionTypes?.left || 0);
  };

  useEffect(() => {
    if (sticky) {
      tableRef?.current?.addEventListener('scroll', HandleScrollLeft);
    } else {
      tableRef?.current?.removeEventListener('scroll', HandleScrollLeft);
    }
    window.addEventListener('scroll', bindHandleScroll);

    return () => {
      tableRef?.current?.removeEventListener('scroll', HandleScrollLeft);
      window.removeEventListener('scroll', bindHandleScroll);
    };
  }, [positionRef, sticky, tableRef]);

  // 设置表头宽度及左右滚动起始位置
  // Set header width and scroll start position
  const bindWindowResize = () => {
    const tablesize = tableRef?.current?.getBoundingClientRect();
    if (tablesize) {
      setTableSize(tablesize);
    }
  };

  useEffect(() => {
    bindWindowResize();
    HandleScrollLeft();
    window.addEventListener('resize', bindWindowResize);
    
    return () => {
      window.removeEventListener('resize', bindWindowResize);
    };
  }, [sticky, tableRef]);

  const renderHeader = (oldColumns: Record<string, any>, layer = 0) => {
    if (layer > headerLayer) setHeaderLayer(layer);
    return (
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f0f0f0',
          color: '#333',
        }}
      >
        {oldColumns.map((column: any) => (
          <div
            key={column.key || column.dataIndex}
            style={{
              borderRight: column.children?.length > 0 ? '1px solid #ccc' : '0px',
            }}
          >
            <div
              style={{
                width: columnWidth[column.dataIndex] || column.width,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height:
                  column.children?.length > 0
                    ? headerRowHeight
                    : (headerLayer - layer + 1) * headerRowHeight,
                ...(column.headerStyle || {}),
              }}
            >
              {column.title}
            </div>
            {column.children?.length > 0 && renderHeader(column.children, layer + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        ref={positionRef}
        style={
          sticky
            ? { height: tableHeaderHeight, backgroundColor: '#f0f0f0' }
            : { backgroundColor: '#f0f0f0' }
        }
      />
      {/* 添加一个隐藏的div用于检测表格底部位置 */}
      {/* Add a hidden div to detect the table bottom position */}
      <div
        ref={tableBottomRef}
        style={{
          position: 'absolute',
          bottom: 0,
          height: 1,
          width: '100%',
          visibility: 'hidden',
        }}
      />
      <div
        style={
          sticky
            ? {
                position: 'fixed',
                top: stickyOffset,
                left: tableSize.left,
                width: tableSize.width,
                zIndex: 10,
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }
            : {}
        }
      >
        <div
          ref={tableHeaderRef}
          style={
            sticky
              ? {
                  position: 'relative',
                  left: scrollLeft - (tableSize.left || 0),
                  minWidth: 'max-content',
                }
              : {}
          }
        >
          {renderHeader(columns)}
        </div>
      </div>
    </>
  );
};

export default memo(TableHeader);