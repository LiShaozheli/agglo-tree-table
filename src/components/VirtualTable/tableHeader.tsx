import React, { FC, memo, useMemo, useState } from 'react';
import { predefinedThemes, type TableTheme } from './themes';
import type { VirtualTableColumn } from './types';
import StickyContainer from '../StickyContainer';
import './index.css';

/**
 * Props for the TableHeader component
 * TableHeader 组件的 Props
 */
export interface TableHeaderProps {
  /** Table columns */
  /** 表格列 */
  columns: VirtualTableColumn[];
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
  /** Additional styles */
  /** 额外的样式 */
  style?: React.CSSProperties;
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
    theme = predefinedThemes.light, // 默认使用明亮模式
    onColumnWidthChange,
    resizable = true, // 默认启用列宽调整功能
    sticky = true, // 默认启用粘性表头
    style,
  } = props;

  const [headerLayer, setHeaderLayer] = useState(0);

  // 预处理列宽信息，提高查找性能
  const columnWidthMap = useMemo(() => {
    const map: Record<string, number> = {};

    const processColumns = (cols: VirtualTableColumn[]) => {
      cols.forEach(column => {
        if (column.dataIndex && column.width) {
          map[column.dataIndex] = typeof column.width === 'string' ? parseInt(column.width, 10) : column.width;
        }
        if (column.children && column.children.length > 0) {
          processColumns(column.children);
        }
      });
    };

    processColumns(columns);
    return map;
  }, [columns]);

  // 获取表头行边框样式
  const getHeaderRowBorderStyle = () => {
    // 表头始终显示行分割线，除非明确设置为不显示
    if (theme.showHeaderRowBorder === false) return 'none';

    if (theme.headerRowBorderStyle) {
      return theme.headerRowBorderStyle;
    }

    if (theme.rowBorderStyle) {
      return theme.rowBorderStyle;
    }

    const color = theme.rowBorderColor || theme.borderColor || '#ccc';
    return `1px solid ${color}`;
  };

  // 获取表头列边框样式
  const getHeaderColumnBorderStyle = () => {
    if (!theme.showColumnBorders) return 'none';

    if (theme.headerColumnBorderStyle) {
      return theme.headerColumnBorderStyle;
    }

    if (theme.columnBorderStyle) {
      return theme.columnBorderStyle;
    }

    const color = theme.borderColor || '#ccc';
    return `1px solid ${color}`;
  };

  const renderHeader = (oldColumns: VirtualTableColumn[], layer = 0, number?: number) => {
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
          backgroundColor: theme.headerBgColor,
          color: theme.headerTextColor,
          fontSize: theme.fontSize,
          fontWeight: theme.headerFontWeight || 'normal',
          // 只在最外层添加底部边框，避免嵌套表头出现多条横向分割线
          borderBottom: layer === 0 ? getHeaderRowBorderStyle() : 'none',
          borderRadius: theme.borderRadius,
        }}
        key={`header-layer-${layer}-${number}`}
      >
        {oldColumns.map((column, index) => {
          const borderWidth = getHeaderRowBorderStyle() === 'none' ? 0 : 1;
          // 计算子列总宽度（包含border）
          const calculateChildrenWidth = (col: VirtualTableColumn): number => {
            if (!col.children || col.children.length === 0) {
              return (typeof col.width === 'string' ? parseInt(col.width, 10) : col.width || 0) + borderWidth;
            }
            // 递归计算子列宽度
            const childrenWidth = col.children.reduce((sum, child) => sum + calculateChildrenWidth(child), 0);
            return childrenWidth;
          };

          // 对有子列和无子列的表头进行彻底区分渲染
          if (column.children && column.children.length > 0) {
            // 有子列的表头
            const computedWidth = calculateChildrenWidth(column) - borderWidth;

            return (
              <div
                key={column.dataIndex || index}
                style={{
                  width: computedWidth,
                  borderRight: index < oldColumns.length - 1 ? getHeaderColumnBorderStyle() : 'none',
                }}
                data-dataindex={column.dataIndex}
              >
                <div className="agglo-tree-table-header-cell-inner"
                  style={{
                    textAlign: column.align || 'center',
                    height: headerRowHeight,
                    lineHeight: headerRowHeight + 'px',
                    ...(column.headerStyle || {}), // 将用户自定义样式移到内层
                  }}>
                  {column.title}
                </div>
                {/* 列宽调整手柄 - 有子列的表头不显示调整手柄 */}
                {column.children && column.children.length > 0 && renderHeader(column.children, layer + 1, index)}
              </div>
            );
          } else {
            // 无子列的表头
            return (
              <div
                key={column.dataIndex || index}
                style={{
                  width: column.width,
                  borderRight: index < oldColumns.length - 1 ? getHeaderColumnBorderStyle() : 'none',
                  position: 'relative',
                }}
                data-dataindex={column.dataIndex}
              >
                <div className="agglo-tree-table-header-cell-inner"
                  style={{
                    textAlign: column.align || 'center',
                    height: (headerLayer - layer + 1) * headerRowHeight,
                    lineHeight: (headerLayer - layer + 1) * headerRowHeight + 'px',
                    ...(column.headerStyle || {}), // 将用户自定义样式移到内层
                  }}>
                  {column.title}
                </div>
                {/* 列宽调整手柄 - 仅在启用时渲染 */}
                {resizable && (
                  <div
                    onMouseDown={(e) => handleResizeStart(column.dataIndex || '', e)}
                    className="virtual-table-column-resizer"
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primaryColor || '#1890ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  />
                )}
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <StickyContainer containerRef={containerRef} sticky={sticky} style={style}>  {/* 使用新的 StickyContainer 组件 */}
      {renderHeader(columns)}
    </StickyContainer>
  );
};

export default memo(TableHeader);