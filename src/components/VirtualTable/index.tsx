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
  /** Fixed table height */
  /** 固定表格高度 */
  tableFixedHeight?: number;
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
 *   tableFixedHeight={300}
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
    tableFixedHeight = 48,
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
  } = props;

  const [expandedRowKeys, setExpandedRowKeys] = useState(defaultExpandedRowKeys || []);
  const [originalColumns, setOriginalColumns] = useState<any[]>([]);
  const [newColumn, setNewColumn] = useState<any[]>([]);
  const [tableWidth, setTableWidth] = useState(0);
  const [newColumnsWidth, setNewColumnsWidth] = useState<Record<string, number>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({}); // 添加列宽状态
  
  const tableRef = useRef<HTMLDivElement>(null);

  // 处理列宽变化
  const handleColumnWidthChange = (dataIndex: string, newWidth: number) => {
    setColumnWidths(prev => ({
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

  // 全部展开
  const expandAll = () => {
    const getAllRowKeys = (data: any[], keys: string[] = []): string[] => {
      data.forEach(item => {
        // 检查是否有子项，如果有则添加到展开列表中
        const children = item[childrenColumnName as keyof typeof item];
        if (children && Array.isArray(children) && children.length > 0) {
          keys.push(item[rowKey]);
          getAllRowKeys(children, keys);
        }
      });
      return keys;
    };
    
    const allRowKeys = getAllRowKeys(dataSource);
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
    
    const getAllExpandableRowKeys = (data: any[], keys: string[] = []): string[] => {
      data.forEach(item => {
        const children = item[childrenColumnName as keyof typeof item];
        if (children && Array.isArray(children) && children.length > 0) {
          keys.push(item[rowKey]);
          getAllExpandableRowKeys(children, keys);
        }
      });
      return keys;
    };
    
    const allExpandableRowKeys = getAllExpandableRowKeys(dataSource);
    return allExpandableRowKeys.length > 0 && 
           allExpandableRowKeys.every(key => expandedRowKeys.includes(key));
  }, [dataSource, expandedRowKeys, childrenColumnName, rowKey]);

  // 检查是否所有可展开的行都已收起
  const isAllCollapsed = useMemo(() => {
    if (!dataSource || dataSource.length === 0) return true;
    
    const getAllExpandableRowKeys = (data: any[], keys: string[] = []): string[] => {
      data.forEach(item => {
        const children = item[childrenColumnName as keyof typeof item];
        if (children && Array.isArray(children) && children.length > 0) {
          keys.push(item[rowKey]);
          getAllExpandableRowKeys(children, keys);
        }
      });
      return keys;
    };
    
    const allExpandableRowKeys = getAllExpandableRowKeys(dataSource);
    return allExpandableRowKeys.length === 0 || 
           !expandedRowKeys.some(key => allExpandableRowKeys.includes(key));
  }, [dataSource, expandedRowKeys, childrenColumnName, rowKey]);

  // 使用useImperativeHandle暴露方法给父组件调用
  useImperativeHandle(ref, () => ({
    expandAll,
    collapseAll,
  }));

  const expandColum = {
    width: expandColumnWidth,
    title: expandColumnTitle,
    dataIndex: expandDataIndex,
    headerStyle: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    render: (value: any, record: any, index: number, expanded: string[], Layer: number) => {
      const isExpend = expanded.includes(record[rowKey]);
      const getChiild = (data: any) => {
        if (!data.children) return null;
        if (expandIcon) return expandIcon(isExpend, data[expandDataIndex], data);
        
        return (
          <span 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              cursor: 'pointer',
              marginRight: '8px',
            }}
          >
            <CaretRightOutlined
              style={{ 
                transform: isExpend ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
                verticalAlign: 'middle',
                transformOrigin: 'center center',
              }}
            />
            {`${data[expandDataIndex]}(${data.length || data.children.length})`}
          </span>
        );
      };
      return (
        <div
          onClick={() => isOrNotExpend(record[rowKey], expanded)}
          style={{
            paddingLeft: Layer * indentSize,
            width: '100%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            userSelect: 'none', // 防止文本选择干扰点击
          }}
        >
          {getChiild(record)}
        </div>
      );
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
      // 如果需要显示全部展开/收起按钮，则添加控制按钮到展开列标题
      let finalExpandColumn = expandColum;
      if (showExpandAll) {
        finalExpandColumn = {
          ...expandColum,
          title: (
            <div style={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{expandColumnTitle}</span>
              <div style={{ 
                display: 'flex',
                gap: '4px'
              }}>
                {!isAllExpanded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      expandAll();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '2px',
                      color: tableTheme.primaryColor,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = tableTheme.rowHoverBgColor || '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="全部展开"
                  >
                    <PlusSquareOutlined
                      style={{ 
                        color: tableTheme.primaryColor || '#1890ff',
                        fontSize: '16px'
                      }}
                    />
                  </button>
                )}
                {expandedRowKeys.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      collapseAll();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '2px',
                      color: tableTheme.primaryColor,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = tableTheme.rowHoverBgColor || '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="全部收起"
                  >
                    <MinusSquareOutlined
                      style={{ 
                        color: tableTheme.primaryColor || '#1890ff',
                        fontSize: '16px'
                      }}
                    />
                  </button>
                )}
              </div>
            </div>
          )
        };
      }
      
      const Columns = [finalExpandColumn, ...getColumns(columns, displayColumns)];
      setOriginalColumns(Columns);
    } else {
      setOriginalColumns(getColumns(columns, displayColumns));
    }
  }, [columns, displayColumns, expandRowByClick, showExpandAll, expandColumnTitle, tableTheme, isAllExpanded, isAllCollapsed]);

  const getNewCloumns = (cols: any[]) => {
    const colsWidth: Record<string, number> = {};
    const newCloumns: any[] = [];

    cols.forEach((item) => {
      // 处理列宽 - 优先使用用户调整的宽度
      let width = item.width || 100;
      if (columnWidths[item.dataIndex]) {
        width = columnWidths[item.dataIndex];
      }
      colsWidth[item.dataIndex] = width;

      const newItem = { ...item, width };
      if (item.children) {
        const { colsWidth: childWidths, newCloumns: childColumns } = getNewCloumns(item.children);
        newItem.children = childColumns;
        // 合并子列的宽度信息
        Object.assign(colsWidth, childWidths);
      }
      newCloumns.push(newItem);
    });

    return { colsWidth, newCloumns };
  };

  useEffect(() => {
    const { colsWidth, newCloumns } = getNewCloumns(originalColumns);
    setNewColumn(newCloumns);
    setNewColumnsWidth(colsWidth);
  }, [originalColumns, tableWidth, columnWidths]); // 添加columnWidths依赖

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
            tableFixedHeight={tableFixedHeight}
            tableRef={tableRef}
            columnWidth={newColumnsWidth}
            containerRef={tableRef} // 传递容器引用
            theme={tableTheme}
            onColumnWidthChange={handleColumnWidthChange}
            resizable={resizable}
          />
          {loading ? (
            <div className="virtual-table-loading">Loading...</div>
          ) : (
            <TableList
              rowKey={rowKey}
              dataSource={dataSource}
              columns={newColumn}
              expandedRowKeys={expandedRowKeys}
              expandRowByClick={expandRowByClick}
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