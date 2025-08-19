import React, { FC, memo, useMemo, useState } from 'react';
import type { TableTheme } from './themes';
import StickyContainer from '../StickyContainer';
import './tableHeader.css';
import './index.css';

/**
 * Props for the TableHeader component
 * TableHeader 组件的 Props
 */
export interface TableHeaderProps {
  /** Table columns */
  /** 表格列 */
  columns: Record<string, any>[];
  /** Header row height */
  /** 表头行高度 */
  headerRowHeight?: number;
  /** Table container reference */
  /** 表格容器引用 */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Table theme */
  /** 表格主题 */
  theme?: TableTheme;
  /** Callback when column width changes */
  /** 列宽度变化时的回调 */
  onColumnWidthChange?: (dataIndex: string, newWidth: number) => void;
  /** Whether column resizing is enabled */
  /** 是否启用列宽调整功能 */
  resizable?: boolean;
  /** Whether to enable sticky header */
  /** 是否启用粘性表头 */
  sticky?: boolean;
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
    containerRef,
    theme,
    onColumnWidthChange,
    resizable = true, // 默认启用列宽调整功能
    sticky = true, // 默认启用粘性表头
  } = props;

  const [headerLayer, setHeaderLayer] = useState(0);

  // 预处理列宽信息，提高查找性能
  const columnWidthMap = useMemo(() => {
    const map: Record<string, number> = {};

    const processColumns = (cols: any[]) => {
      cols.forEach(column => {
        if (column.dataIndex && column.width) {
          map[column.dataIndex] = column.width;
        }
        if (column.children?.length > 0) {
          processColumns(column.children);
        }
      });
    };

    processColumns(columns);
    return map;
  }, [columns]);

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

  const renderHeader = (oldColumns: Record<string, any>, layer = 0, number?: number) => {
    if (layer > headerLayer) setHeaderLayer(layer);

    // 列宽调整处理函数 - 只更新当前表格中的列
    const handleResizeStart = (dataIndex: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startWidth = columnWidthMap[dataIndex] || 100;
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
          // 只在最外层添加底部边框，避免嵌套表头出现多条横向分割线
          borderBottom: layer === 0 ? getHeaderRowBorderStyle() : 'none',
          borderRadius: mergedTheme.borderRadius,
        }}
        key={`header-layer-${layer}-${number}`}
      >
        {oldColumns.map((column: any, index: number) => (
          <div
            key={column.key || column.dataIndex || index}
            style={{
              // 为非最后一个子元素添加右边框，避免重复边框线
              borderRight: index < oldColumns.length - 1 ? getHeaderColumnBorderStyle() : 'none',
              position: 'relative',
              width: column.width,
            }}
            data-dataindex={column.dataIndex}
          >
            <div style={{
              width: '100%',
              textAlign: column.align || 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0, // 关键：允许 flex item 收缩以触发文本省略
              padding: '0px 12px', // 添加默认padding
              boxSizing: 'border-box',
              height:
                column.children?.length > 0
                  ? headerRowHeight
                  : (headerLayer - layer + 1) * headerRowHeight,
              lineHeight: column.children?.length > 0
                ? headerRowHeight + 'px'
                : (headerLayer - layer + 1) * headerRowHeight + 'px',
              alignItems: 'center',
              ...(column.headerStyle || {}), // 将用户自定义样式移到内层
            }}>
              {column.title}
            </div>
            {/* 列宽调整手柄 - 仅在启用时渲染 */}
            {resizable && (!column.children || column.children?.length === 0) && (
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
            {column.children?.length > 0 && renderHeader(column.children, layer + 1, index)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <StickyContainer containerRef={containerRef} sticky={sticky}>  {/* 使用新的 StickyContainer 组件 */}
      {renderHeader(columns)}
    </StickyContainer>
  );
};

export default memo(TableHeader);