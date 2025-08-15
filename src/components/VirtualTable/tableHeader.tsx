import React, { FC, memo, ReactNode, useEffect, useRef, useState } from 'react';
import type { TableTheme } from './themes';
import './tableHeader.css';
import './index.css';

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
  /** Table reference */
  /** 表格引用 */
  tableRef: React.RefObject<HTMLDivElement>;
  /** Column widths */
  /** 列宽度 */
  columnWidth: Record<string, number>;
  /** Table container reference */
  /** 表格容器引用 */
  containerRef?: React.RefObject<HTMLDivElement>;
  /** Table theme */
  /** 表格主题 */
  theme?: TableTheme;
  /** Callback when column width changes */
  /** 列宽度变化时的回调 */
  onColumnWidthChange?: (dataIndex: string, newWidth: number) => void;
  /** Whether column resizing is enabled */
  /** 是否启用列宽调整功能 */
  resizable?: boolean;
}

/**
 * A table header component with sticky functionality.
 * 一个具有粘性功能的表头组件。
 * 
 * This component renders table headers and makes them sticky when scrolling.
 * 该组件渲染表格头部，并在滚动时使其粘性固定。
 */
const TableHeader: FC<TableHeaderProps> = props => {
  const { 
    columns, 
    headerRowHeight = 40,
    tableRef, 
    columnWidth, 
    containerRef,
    theme,
    onColumnWidthChange,
    resizable = true // 默认启用列宽调整功能
  } = props;
  
  const [headerLayer, setHeaderLayer] = useState(0);
  const [sticky, setSticky] = useState(false);
  const [tableHeaderHeight, setTableHeaderHeight] = useState(0);
  const [tableSize, setTableSize] = useState<Record<string, any>>({});
  const [scrollLeft, setScrollLeft] = useState(0);
  const [tableFixedHeight, setTableFixedHeight] = useState(0);

  const tableHeaderRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);

  // 默认主题
  const defaultTheme: TableTheme = {
    primaryColor: '#1890ff',
    headerBgColor: '#f0f0f0',
    headerTextColor: '#333',
    bodyBgColor: '#ffffff',
    bodyTextColor: '#333',
    borderColor: '#ccc',
    rowHoverBgColor: '#f5f5f5',
    alternatingRowBgColor: '#f5f5f5',
    fontSize: 14,
    borderRadius: 2,
    showColumnBorders: true,
    showRowBorders: true,
  };

  // 合并主题配置
  const mergedTheme: TableTheme = { ...defaultTheme, ...theme };

  // 获取表头行边框样式
  const getHeaderRowBorderStyle = () => {
    // 表头始终显示行分割线，除非明确设置为不显示
    if (mergedTheme.showHeaderRowBorder === false) return 'none';
    
    if (mergedTheme.headerRowBorderStyle) {
      return mergedTheme.headerRowBorderStyle;
    }
    
    if (mergedTheme.rowBorderStyle) {
      return mergedTheme.rowBorderStyle;
    }
    
    const color = mergedTheme.rowBorderColor || mergedTheme.borderColor || '#ccc';
    return `1px solid ${color}`;
  };

  // 获取表头列边框样式
  const getHeaderColumnBorderStyle = () => {
    if (!mergedTheme.showColumnBorders) return 'none';
    
    if (mergedTheme.headerColumnBorderStyle) {
      return mergedTheme.headerColumnBorderStyle;
    }
    
    if (mergedTheme.columnBorderStyle) {
      return mergedTheme.columnBorderStyle;
    }
    
    const color = mergedTheme.borderColor || '#ccc';
    return `1px solid ${color}`;
  };

  // 计算页面上固定元素的高度
  const calculateFixedHeight = () => {
    // 获取所有可能的固定元素
    const allElements = document.querySelectorAll('body *');
    let fixedElements: HTMLElement[] = [];
    
    // 遍历所有元素，找出固定在顶部的元素
    allElements.forEach(element => {
      if (!(element instanceof HTMLElement)) return;
      
      const style = window.getComputedStyle(element);
      const position = style.position;
      const top = style.top;
      const zIndex = parseInt(style.zIndex || '0');
      
      // 检查是否是固定或粘性定位
      const isFixedOrSticky = position === 'fixed' || position === 'sticky';
      
      // 检查是否在顶部（top 为 0 或接近 0）
      const isAtTop = top === '0px' || top === '0' || (parseFloat(top) <= 1 && parseFloat(top) >= 0);
      
      // 如果元素固定在顶部，添加到列表中
      if (isFixedOrSticky && isAtTop) {
        fixedElements.push(element);
      }
    });
    
    // 按照 z-index 排序，确保按正确的层级顺序计算高度
    fixedElements.sort((a, b) => {
      const aZIndex = parseInt(window.getComputedStyle(a).zIndex || '0');
      const bZIndex = parseInt(window.getComputedStyle(b).zIndex || '0');
      return aZIndex - bZIndex;
    });
    
    // 计算总高度
    let totalHeight = 0;
    fixedElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      totalHeight += rect.height;
    });
    
    return totalHeight;
  };

  // 设置表头高度
  useEffect(() => {
    const tableHeaderSize = tableHeaderRef?.current?.getBoundingClientRect();
    setTableHeaderHeight(tableHeaderSize?.height || 0);
  }, [tableHeaderRef, sticky]);

  // 设置表头是否为粘滞状态
  const bindHandleScroll = () => {
    const positionTypes = positionRef?.current?.getBoundingClientRect();
    const tableTypes = tableRef?.current?.getBoundingClientRect();

    // 当表头滚动到固定元素下方且表格底部仍在视口内时，激活粘滞状态
    if (positionTypes?.top !== undefined && positionTypes?.top < tableFixedHeight && 
        tableTypes?.bottom !== undefined && tableTypes?.bottom > 0 && !sticky) {
      setSticky(true);
    } 
    // 当表头回到原始位置以上或表格完全滚出视口时，取消粘滞状态
    else if (((positionTypes?.top !== undefined && positionTypes?.top >= tableFixedHeight) || 
              (tableTypes?.bottom !== undefined && tableTypes?.bottom <= 0)) && sticky) {
      setSticky(false);
    }
  };

  // 设置表头粘滞状态的左右滚动
  const HandleScrollLeft = () => {
    const positionTypes = positionRef?.current?.getBoundingClientRect();
    setScrollLeft(positionTypes?.left || 0);
  };

  useEffect(() => {
    // 组件挂载时计算固定元素高度
    setTableFixedHeight(calculateFixedHeight());
    
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
    
    // 列宽调整处理函数 - 只更新当前表格中的列
    const handleResizeStart = (dataIndex: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const startX = e.clientX;
      const startWidth = columnWidth[dataIndex] || 100;
      let currentWidth = startWidth;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        // 精确计算新宽度，确保与鼠标位置同步
        const diff = moveEvent.clientX - startX;
        const newWidth = Math.max(50, startWidth + diff); // 最小宽度50px
        
        // 只有当宽度变化时才更新currentWidth变量
        if (newWidth !== currentWidth) {
          currentWidth = newWidth;
          
          // 在拖拽过程中只更新当前表格中的DOM样式，不触发回调更新状态
          // 通过containerRef限制选择范围，确保只选择当前表格中的元素
          if (containerRef?.current) {
            const headerCells = containerRef.current.querySelectorAll(`[data-dataindex="${dataIndex}"]`);
            headerCells.forEach(cell => {
              if (cell instanceof HTMLElement) {
                cell.style.width = `${newWidth}px`;
              }
            });
          }
        }
      };

      const handleMouseUp = () => {
        // 鼠标释放时才触发回调更新状态
        onColumnWidthChange?.(dataIndex, currentWidth);
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    return (
      <div
        style={{
          display: 'flex',
          backgroundColor: mergedTheme.headerBgColor,
          color: mergedTheme.headerTextColor,
          fontSize: mergedTheme.fontSize,
          fontWeight: mergedTheme.headerFontWeight || 'normal',
          // 使用表头专用的行边框配置
          borderBottom: getHeaderRowBorderStyle(),
        }}
      >
        {oldColumns.map((column: any) => (
          <div
            key={column.key || column.dataIndex}
            style={{
              // 使用表头专用的列边框配置
              borderRight: getHeaderColumnBorderStyle(),
              position: 'relative',
              width: columnWidth[column.dataIndex] || column.width,
            }}
            data-dataindex={column.dataIndex}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height:
                  column.children?.length > 0
                    ? headerRowHeight
                    : (headerLayer - layer + 1) * headerRowHeight,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                ...(column.headerStyle || {}),
              }}
            >
              {column.title}
            </div>
            {/* 列宽调整手柄 - 仅在启用时渲染 */}
            {resizable && (
              <div
                onMouseDown={(e) => handleResizeStart(column.dataIndex, e)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: '5px',
                  cursor: 'col-resize',
                  backgroundColor: 'transparent',
                  zIndex: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = mergedTheme.primaryColor || '#1890ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              />
            )}
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
            ? { height: tableHeaderHeight, backgroundColor: mergedTheme.headerBgColor }
            : { backgroundColor: mergedTheme.headerBgColor }
        }
      />
      <div
        style={
          sticky
            ? {
                position: 'fixed',
                top: tableFixedHeight,
                left: tableSize.left,
                width: tableSize.width,
                zIndex: 1000,
                overflow: 'hidden',
                backgroundColor: mergedTheme.headerBgColor,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: mergedTheme.borderRadius,
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