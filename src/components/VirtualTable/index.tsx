import React, { FC, memo, ReactNode, useEffect, useRef, useState, useMemo } from 'react';
import ResizeObserver from 'rc-resize-observer';
import TableList from './tableList';
import TableHeader from './tableHeader';
import { predefinedThemes, type TableTheme } from './themes';


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
const VirtualTable: FC<VirtualTableProps> = props => {
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
    } = {},
    theme = 'default',
  } = props;

  const [expandedRowKeys, setExpandedRowKeys] = useState(defaultExpandedRowKeys || []);
  const [originalColumns, setOriginalColumns] = useState<any[]>([]);
  const [newColumn, setNewColumn] = useState<any[]>([]);
  const [tableWidth, setTableWidth] = useState(0);
  const [newColumnsWidth, setNewColumnsWidth] = useState<Record<string, number>>({});
  const tableRef = useRef<HTMLDivElement>(null);

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

  const expandColum = {
    width: expandColumnWidth,
    title: expandColumnTitle,
    dataIndex: expandDataIndex,
    headerStyle: {

    },
    render: (value: any, record: any, index: number, expanded: string[], Layer: number) => {
      const isExpend = expanded.includes(record[rowKey]);
      const getChiild = (data: any) => {
        if (!data.children) return null;
        if (expandIcon) return expandIcon(isExpend, data[expandDataIndex], data);
        
        // 使用更美观的SVG图标替换原有的简单字符，并添加更好的动画效果
        const ExpandIcon = () => (
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            style={{ 
              transform: isExpend ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
              verticalAlign: 'middle',
              marginRight: '8px',
              transformOrigin: 'center center'
            }}
          >
            <path 
              fill={tableTheme.primaryColor || '#1890ff'} 
              d="M6 4l4 4-4 4V4z"
            />
          </svg>
        );
        
        return (
          <>
            <ExpandIcon />
            {`${data[expandDataIndex]}(${data.length || data.children.length})`}
          </>
        );
      };
      return (
        <div
          onClick={() => isOrNotExpend(record[rowKey], expanded)}
          style={{
            paddingLeft: Layer * indentSize,
            width: '100%',
            color: tableTheme.primaryColor, // 使用主题中的主色调替换硬编码颜色
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
    if (!displayCols || displayCols.length === 0) {
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
  }, [columns, displayColumns, expandRowByClick]);

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
          if (column.width) {
            colsWidth[column.dataIndex] = column.width;
            totolWidth += column.width;
          } else {
            colsNoWidth[column.dataIndex] = 0; // 先设置为0，后续再计算
          }
        }
      });
      return cols;
    };
    const newCloumns = getCol(column);

    // 修复：正确处理没有指定宽度的列
    if (Object.keys(colsNoWidth).length > 0) {
      // 即使tableWidth为0，也要给列分配默认宽度
      const availableWidth = tableWidth > 0 ? tableWidth : 800; // 默认容器宽度800px
      const remainingWidth = Math.max(availableWidth - totolWidth, 0);
      const widthPerColumn = Math.floor(remainingWidth / Object.keys(colsNoWidth).length) || 100; // 默认100px
      Object.keys(colsNoWidth).forEach(key => {
        colsNoWidth[key] = widthPerColumn;
        colsWidth[key] = widthPerColumn;
      });
    }

    // 如果总宽度为0（初始状态），则给每列一个默认宽度
    if (tableWidth === 0 && Object.keys(colsWidth).length === 0 && newCloumns.length > 0) {
      const defaultWidth = 150;
      newCloumns.forEach(col => {
        colsWidth[col.dataIndex] = col.width || defaultWidth;
      });
    }

    return { colsWidth, newCloumns };
  };

  useEffect(() => {
    const { colsWidth, newCloumns } = getNewCloumns(originalColumns);
    setNewColumn(newCloumns);
    setNewColumnsWidth(colsWidth);
  }, [originalColumns, tableWidth]);

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <div style={{ overflowX: 'scroll', overflowY: 'visible', zIndex: 10 }} ref={tableRef}>
        <div style={{ minWidth: 'max-content' }}>
          <TableHeader
            columns={originalColumns}
            headerRowHeight={headerRowHeight}
            tableFixedHeight={tableFixedHeight}
            tableRef={tableRef}
            columnWidth={newColumnsWidth}
            containerRef={tableRef} // 传递容器引用
            theme={tableTheme}
          />
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
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
};

export default memo(VirtualTable);