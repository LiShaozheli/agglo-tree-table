import React, { useState, useEffect, useRef, useImperativeHandle, useMemo, forwardRef, memo } from 'react';
import { useImmer } from 'use-immer';
import ResizeObserver from 'rc-resize-observer';
import { CaretRightOutlined, PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import type { TableTheme } from './themes';
import type { ReactNode } from 'react';
import TableList from './tableList';
import TableHeader from './tableHeader';
import { predefinedThemes } from './themes';
import './index.css';

/**
 * Configuration for expandable rows
 * 可展开行配置
 */
export interface ExpandableProps {
  /** Default expanded row keys */
  /** 默认展开的行键 */
  defaultExpandedRowKeys?: string[];
  /** Children column name in data */
  /** 数据中子项列的名称 */
  childrenColumnName?: string;
  /** Data index for expand column */
  /** 展开列的数据索引 */
  expandDataIndex?: string;
  /** Whether to expand row by clicking anywhere */
  /** 是否通过点击任意位置展开行 */
  expandRowByClick?: boolean;
  /** Indent size for each level */
  /** 每级的缩进大小 */
  indentSize?: number;
  /** Width of expand column */
  /** 展开列的宽度 */
  expandColumnWidth?: number;
  /** Title of expand column */
  /** 展开列的标题 */
  expandColumnTitle?: ReactNode;
  /** Custom expand icon renderer */
  /** 自定义展开图标渲染器 */
  expandIcon?: (isExpend: boolean, value: ReactNode, record: Record<string, any>) => ReactNode;
  /** Whether to show expand all/collapse all buttons */
  /** 是否显示全部展开/收起按钮 */
  showExpandAll?: boolean;
  /** Callback when expand all is triggered */
  /** 全部展开时的回调函数 */
  onExpandAll?: () => void;
  /** Callback when collapse all is triggered */
  /** 全部收起时的回调函数 */
  onCollapseAll?: () => void;
}

/**
 * Props for the VirtualTable component
 * VirtualTable 组件的 Props
 */
export interface VirtualTableProps {
  /** Unique row key */
  /** 唯一行键 */
  rowKey: string;
  /** Table columns configuration */
  /** 表格列配置 */
  columns?: any[];
  /** Table data source */
  /** 表格数据源 */
  dataSource?: Array<Record<string, any>>;
  /** Height of each row */
  /** 每行的高度 */
  rowHeight?: number;
  /** Height of header row */
  /** 表头行的高度 */
  headerRowHeight?: number;
  /** Row event handler */
  /** 行事件处理器 */
  onRow?: (record: any, index: any) => Record<string, any>;
  /** Columns to display (show only these) */
  /** 要显示的列（仅显示这些列） */
  displayColumns?: string[];
  /** Loading state */
  /** 加载状态 */
  loading?: boolean;
  /** Expandable configuration */
  /** 可展开配置 */
  expandable?: ExpandableProps;
  /** Table theme */
  /** 表格主题 */
  theme?: 'default' | 'antd' | 'agGrid' | TableTheme;
  /** Whether column resizing is enabled */
  /** 是否启用列宽调整功能 */
  resizable?: boolean;
  /** Whether to enable sticky header */
  /** 是否启用粘性表头 */
  sticky?: boolean;
}

// 添加VirtualTable的公开方法接口
export interface VirtualTableHandles {
  /** Expand all rows */
  /** 展开所有行 */
  expandAll: () => void;
  /** Collapse all rows */
  /** 收起所有行 */
  collapseAll: () => void;
}

/**
 * A virtualized table component for efficiently rendering large datasets.
 * 一个用于高效渲染大型数据集的虚拟化表格组件。
 * 
 * This component uses virtualization to render only visible rows, improving performance
 * with large datasets. It also supports expandable rows and sticky headers.
 * 该组件使用虚拟化技术仅渲染可见行，从而提高大型数据集的性能。它还支持可展开行和粘性表头。
 * 
 * @example
 * ```tsx
 * <VirtualTable
 *   columns={columns}
 *   dataSource={data}
 *   rowKey="id"
 * />
 * ```
 */
const VirtualTable = forwardRef<VirtualTableHandles, VirtualTableProps>((props, ref) => {
  const {
    rowKey,
    columns = [],
    dataSource = [],
    rowHeight = 40,
    headerRowHeight = 40,
    onRow,
    displayColumns,
    loading = false,
    expandable: {
      indentSize = 15,
      expandRowByClick = false,
      defaultExpandedRowKeys,
      expandDataIndex = 'expand',
      childrenColumnName = 'children',
      expandIcon,
      expandColumnWidth = 150,
      expandColumnTitle,
      showExpandAll = false,
      onExpandAll,
      onCollapseAll,
    } = {},
    theme = 'default',
    resizable = true, // 默认启用列宽调整功能
    sticky
  } = props;

  const [expandedRowKeys, setExpandedRowKeys] = useState(defaultExpandedRowKeys || []);
  const [originalColumns, setOriginalColumns] = useImmer<any[]>([]);
  const [newColumn, setNewColumn] = useState<any[]>([]);
  const [tableWidth, setTableWidth] = useState(0);

  const tableRef = useRef<HTMLDivElement>(null);

  // 处理列宽变化
  const handleColumnWidthChange = (dataIndex: string, newWidth: number) => {
    // 使用 Immer 更新 originalColumns 中对应列的宽度
    setOriginalColumns(draft => {
      const updateColumnWidth = (cols: any[]) => {
        cols.forEach(column => {
          if (column.children?.length > 0) {
            // 递归处理子列
            updateColumnWidth(column.children);
          } else if (column.dataIndex === dataIndex) {
            // 更新匹配的列宽
            column.width = newWidth;
          }
        });
      };

      updateColumnWidth(draft);
    });
  };

  // 处理主题配置
  const tableTheme: TableTheme = typeof theme === 'string' ? predefinedThemes[theme] : { ...predefinedThemes.default, ...theme };

  const isOrNotExpend = (key: string, expendArray: string[]) => {
    if (expendArray.includes(key)) {
      const newExpendArray = expendArray.filter(item => item !== key);
      setExpandedRowKeys(newExpendArray);
      return;
    }
    const newExpendArray = [...expendArray];
    newExpendArray.push(key);
    setExpandedRowKeys(newExpendArray);
  };

  // 通用函数：递归获取所有可展开的行键值
  const getAllRowKeys = (data: any[], keys: string[] = []): string[] => {
    data.forEach(item => {
      const children = item[childrenColumnName as keyof typeof item];
      if (children && Array.isArray(children) && children.length > 0) {
        keys.push(item[rowKey]);
        getAllRowKeys(children, keys);
      }
    });
    return keys;
  };

  // 使用 useMemo 缓存所有可展开行的键值，仅在 dataSource 变化时重新计算
  const allRowKeys = useMemo(() => {
    return getAllRowKeys(dataSource);
  }, [dataSource, childrenColumnName, rowKey]);

  // 全部展开
  const expandAll = () => {
    setExpandedRowKeys(allRowKeys);
    // 调用外部传入的回调函数
    onExpandAll?.();
  };

  // 全部收起
  const collapseAll = () => {
    setExpandedRowKeys([]);
    // 调用外部传入的回调函数
    onCollapseAll?.();
  };

  // 使用useImperativeHandle暴露方法给父组件调用
  useImperativeHandle(ref, () => ({
    expandAll,
    collapseAll,
  }));

  const expandColum = useMemo(() => ({
    width: expandColumnWidth,
    title:
      <>
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: 1, textAlign: 'center' }}>{expandColumnTitle}</div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          {showExpandAll && expandedRowKeys.length === 0 && <PlusSquareOutlined
            style={{
              color: tableTheme.primaryColor || '#1890ff',
              fontSize: '16px',
              cursor: 'pointer',
            }}
            onClick={expandAll}
          />}
          {showExpandAll && expandedRowKeys.length > 0 && <MinusSquareOutlined
            style={{
              color: tableTheme.primaryColor || '#1890ff',
              fontSize: '16px',
              cursor: 'pointer',
            }}
            onClick={collapseAll}
          />}
        </div>
      </>,
    dataIndex: expandDataIndex,
    headerStyle: {
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    },
    style: { cursor: 'pointer' },
    align: 'left',
    onCellClick: (record: any, index: number, expanded: string[]) => isOrNotExpend(record[rowKey], expanded),
    render: (value: any, record: any, index: number, expanded: string[], Layer: number) => {
      const isExpend = expanded.includes(record[rowKey]);
      const getChiild = (data: any) => {
        if (!data.children) return null;
        if (expandIcon) return expandIcon(isExpend, data[expandDataIndex], data);

        return (
          <>
            <CaretRightOutlined
              style={{
                transform: isExpend ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
                verticalAlign: 'middle',
                transformOrigin: 'center center',
                marginRight: '8px',
                marginLeft: `${Layer * indentSize}px`,
              }}
            />
            {`${data[expandDataIndex]}(${data.length || data.children.length})`}
          </>
        );
      };
      return getChiild(record);
    },
  }), [expandColumnWidth, expandedRowKeys, showExpandAll, expandColumnTitle, expandDataIndex, tableTheme.primaryColor, indentSize, expandIcon, rowKey, expandRowByClick]);

  const getColumns = (cols: any[], displayCols?: string[]): any[] => {
    // 如果没有指定 displayColumns，则显示所有列
    if (!displayCols) {
      return cols;
    }

    const newColumns: any[] = [];
    cols.forEach(column => {
      if (column.children?.length > 0) {
        const children = getColumns(column.children, displayCols);
        if (children.length > 0) {
          newColumns.push({
            ...column,
            children,
          });
        }
      } else if (displayCols.includes(column.dataIndex)) {
        newColumns.push(column);
      }
    });
    return newColumns;
  };

  /**
   * 处理列结构，保持原始嵌套结构并直接设置列宽到列属性中
   * @param columns 原始列数组
   * @returns 处理后的列数组，保持原始结构
   */
  const processColumnsWithWidth = (columns: any[]) => {
    // 先计算总宽度和未设置宽度的列
    let totalWidth = 0;
    const colsNoWidth: Record<string, boolean> = {};

    const calculateWidth = (cols: any[]) => {
      cols.forEach(column => {
        if (column.children?.length > 0) {
          calculateWidth(column.children);
        } else {
          if (!column.width) {
            colsNoWidth[column.dataIndex] = true;
          }
          totalWidth += column.width || 0;
        }
      });
    };

    calculateWidth(columns);

    // 计算需要分配的宽度，考虑边框的影响
    // 表格有竖向边框时，每个列间会有1px的边框，总共需要 (列数-1) 像素的边框宽度
    const flatColumns = columns.flatMap(col => col.children || col);
    const borderWidth = flatColumns.length > 0 ? (flatColumns.length - 1) : 0;
    let extraWidthPerCol = 0;

    // 如果总宽度小于表格宽度且存在未设置宽度的列，则平均分配剩余空间
    if (totalWidth < (tableWidth - borderWidth) && Object.keys(colsNoWidth).length > 0) {
      extraWidthPerCol = Math.floor(((tableWidth - borderWidth) - totalWidth) / Object.keys(colsNoWidth).length);
    }

    // 如果所有列都设置了宽度但总宽度小于表格宽度，则需要按比例调整
    let proportion = 1;
    if (totalWidth < (tableWidth - borderWidth) && Object.keys(colsNoWidth).length === 0 && totalWidth > 0) {
      proportion = (tableWidth - borderWidth) / totalWidth;
    }

    // 如果有未设置宽度的列，同时总宽度（包括分配给未设置宽度列的宽度）仍小于表格宽度，
    // 则所有列都需要按比例调整
    const totalWidthWithExtra = totalWidth + extraWidthPerCol * Object.keys(colsNoWidth).length;
    if (Object.keys(colsNoWidth).length > 0 && totalWidthWithExtra < (tableWidth - borderWidth) && totalWidthWithExtra > 0) {
      proportion = (tableWidth - borderWidth) / totalWidthWithExtra;
    }

    // 创建新的列结构并设置宽度
    const assignWidth = (cols: any[]): any[] => {
      return cols.map(column => {
        if (column.children?.length > 0) {
          // 递归处理子列
          return {
            ...column,
            children: assignWidth(column.children)
          };
        } else {
          // 处理叶子节点列
          let finalWidth = column.width || 0;

          // 如果该列未设置宽度
          if (!column.width) {
            // 如果总宽度已经超过表格宽度，或者无法分配额外宽度，则设置默认宽度100px
            if (totalWidth >= (tableWidth - borderWidth) || extraWidthPerCol <= 0) {
              finalWidth = 100;
            } else {
              // 平均分配额外宽度给未设置宽度的列
              finalWidth = extraWidthPerCol;
            }
          }
          // 如果该列已设置宽度且需要按比例调整
          else if (column.width && proportion !== 1) {
            // 按比例调整已设置宽度的列
            finalWidth = Math.floor(column.width * proportion);
          }

          // 如果该列未设置宽度且需要按比例调整（在分配了默认宽度或额外宽度后）
          if (!column.width && proportion !== 1) {
            finalWidth = Math.floor(finalWidth * proportion);
          }

          return {
            ...column,
            width: finalWidth
          };
        }
      });
    };

    return assignWidth(columns);
  };

  useEffect(() => {
    const filteredColumns = getColumns(columns, displayColumns);
    // 只有当启用expandRowByClick时才添加expandColum
    const expandedColumns = expandRowByClick ? [expandColum, ...filteredColumns] : filteredColumns;
    const processedColumns = processColumnsWithWidth(expandedColumns);
    setOriginalColumns(processedColumns);
  }, [columns, displayColumns, expandRowByClick, expandColum, tableWidth]);

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <div className="virtual-table-container" ref={tableRef}>
        <div className="virtual-table-min-width">
          <TableHeader
            columns={originalColumns}
            headerRowHeight={headerRowHeight}
            containerRef={tableRef} // 传递容器引用
            theme={tableTheme}
            onColumnWidthChange={handleColumnWidthChange}
            resizable={resizable}
            sticky={sticky} // 传递sticky属性
          />
          {loading ? (
            <div className="virtual-table-loading">Loading...</div>
          ) : (
            <TableList
              rowKey={rowKey}
              dataSource={dataSource}
              columns={originalColumns}
              expandedRowKeys={expandedRowKeys}
              rowHeight={rowHeight}
              childrenColumnName={childrenColumnName}
              onRow={onRow}
              theme={tableTheme}
            />
          )}
        </div>
      </div>
    </ResizeObserver>
  );
});

export default memo(VirtualTable);