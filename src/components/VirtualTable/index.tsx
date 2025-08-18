import React, { useState, useEffect, useRef, useImperativeHandle, useMemo, forwardRef, memo } from 'react';
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
  const [originalColumns, setOriginalColumns] = useState<any[]>([]);
  const [newColumn, setNewColumn] = useState<any[]>([]);
  const [tableWidth, setTableWidth] = useState(0);
  const [newColumnsWidth, setNewColumnsWidth] = useState<Record<string, number>>({});

  const tableRef = useRef<HTMLDivElement>(null);

  // 处理列宽变化
  const handleColumnWidthChange = (dataIndex: string, newWidth: number) => {
    setNewColumnsWidth(prev => ({
      ...prev,
      [dataIndex]: newWidth
    }));
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

  // 检查是否所有可展开的行都已展开
  const isAllExpanded = useMemo(() => {
    if (!dataSource || dataSource.length === 0) return false;

    return allRowKeys.length > 0 &&
      allRowKeys.every(key => expandedRowKeys.includes(key));
  }, [dataSource, expandedRowKeys, allRowKeys]);

  // 检查是否所有可展开的行都已收起
  const isAllCollapsed = useMemo(() => {
    if (!dataSource || dataSource.length === 0) return true;

    return allRowKeys.length === 0 ||
      !expandedRowKeys.some(key => allRowKeys.includes(key));
  }, [dataSource, expandedRowKeys, allRowKeys]);

  // 使用useImperativeHandle暴露方法给父组件调用
  useImperativeHandle(ref, () => ({
    expandAll,
    collapseAll,
  }));

  const expandColum = {
    width: expandColumnWidth,
    title: showExpandAll ?
      <div>
        <div>{expandColumnTitle}</div>
        <div>
          {expandedRowKeys.length === 0 && <PlusSquareOutlined
            style={{
              color: tableTheme.primaryColor || '#1890ff',
              fontSize: '16px',
            }}
            onClick={expandAll}
          />}
          {expandedRowKeys.length > 0 && <MinusSquareOutlined
            style={{
              color: tableTheme.primaryColor || '#1890ff',
              fontSize: '16px',
            }}
            onClick={collapseAll}
          />}
        </div>
      </div>
      : expandColumnTitle,
    dataIndex: expandDataIndex,
    headerStyle: {
      display: 'flex',
      flexDirection: 'column',
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
  };

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

  useEffect(() => {
    if (expandRowByClick) {
      const Columns = [expandColum, ...getColumns(columns, displayColumns)];
      setOriginalColumns(Columns);
    } else {
      setOriginalColumns(getColumns(columns, displayColumns));
    }
  }, [columns, displayColumns, showExpandAll, expandColumnTitle, tableTheme, expandedRowKeys]);

  const getNewCloumns = (column: any[]) => {
    const colsWidth: Record<string, number> = {};
    const colsNoWidth: Record<string, number> = {};
    let totolWidth = 0;

    const getCol = (oldColumns: any[]): any[] => {
      let cols: any[] = [];

      oldColumns.forEach(column => {
        if (column.children?.length > 0) {
          cols = [...cols, ...getCol(column.children)];
        } else {
          cols.push(column);
          colsWidth[column.dataIndex] = column.width;
          if (!column.width) {
            colsNoWidth[column.dataIndex] = column.width;
          }
          totolWidth += column.width;
        }
      });
      return cols;
    };
    const newCloumns = getCol(column);

    if (totolWidth < tableWidth) {
      if (Object.keys(colsNoWidth).length > 0) {
        const width = Math.floor((tableWidth - totolWidth) / Object.keys(colsNoWidth).length);
        Object.keys(colsNoWidth).forEach(key => {
          colsNoWidth[key] = width;
        });

        Object.assign(colsWidth, colsNoWidth);
      } else {
        const proportion = totolWidth / tableWidth;
        Object.keys(colsWidth).forEach(key => {
          colsWidth[key] = Math.floor(colsWidth[key] / proportion);
        });
      }
    }

    return { colsWidth, newCloumns };
  };

  useEffect(() => {
    const { colsWidth, newCloumns } = getNewCloumns(originalColumns);
    console.log('colsWidth', colsWidth, newCloumns);

    setNewColumn(newCloumns);
    setNewColumnsWidth(colsWidth);
  }, [originalColumns, tableWidth]); // 添加columnWidths依赖

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
            columnWidth={newColumnsWidth}
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
              columns={newColumn}
              expandedRowKeys={expandedRowKeys}
              rowHeight={rowHeight}
              childrenColumnName={childrenColumnName}
              onRow={onRow}
              columnWidth={newColumnsWidth}
              theme={tableTheme}
            />
          )}
        </div>
      </div>
    </ResizeObserver>
  );
});

export default memo(VirtualTable);