import React, { memo, FC, ReactNode, useMemo } from 'react';
import List from 'rc-virtual-list';
import type { TableTheme } from './themes';

/**
 * Props for the TableList component
 * TableList 组件的 Props
 */
interface TableListProps {
  /** Unique row key */
  /** 唯一行键 */
  rowKey: string;
  /** Table data source */
  /** 表格数据源 */
  dataSource: Array<Record<string, any>>;
  /** Table columns */
  /** 表格列 */
  columns: Record<string, any>[];
  /** Expanded row keys */
  /** 展开的行键 */
  expandedRowKeys: string[];
  /** Children column name */
  /** 子项列名称 */
  childrenColumnName?: string;
  /** Whether to expand row by clicking */
  /** 是否通过点击展开行 */
  expandRowByClick?: boolean;
  /** Height of each row */
  /** 每行的高度 */
  rowHeight?: number;
  /** Row event handler */
  /** 行事件处理器 */
  onRow?: (record: any, index: any) => Record<string, any>;
  /** Column widths */
  /** 列宽度 */
  columnWidth: Record<string, number>;
  /** Table theme */
  /** 表格主题 */
  theme?: TableTheme;
}

/**
 * A virtualized list component for rendering table rows.
 * 用于渲染表格行的虚拟化列表组件。
 * 
 * This component is used internally by VirtualTable to render rows with virtualization.
 * 该组件由 VirtualTable 内部使用，用于虚拟化渲染行。
 */
const TableList: FC<TableListProps> = props => {
  const {
    rowKey,
    dataSource,
    columns,
    expandedRowKeys,
    childrenColumnName = 'children',
    rowHeight = 40,
    onRow,
    columnWidth,
    theme,
  } = props;

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
    showHeaderRowBorder: true,
  };

  // 合并主题配置
  const mergedTheme: TableTheme = { ...defaultTheme, ...theme };

  // 获取行边框样式
  const getRowBorderStyle = () => {
    if (!mergedTheme.showRowBorders) return 'none';
    
    if (mergedTheme.rowBorderStyle) {
      return mergedTheme.rowBorderStyle;
    }
    
    const color = mergedTheme.rowBorderColor || mergedTheme.borderColor || '#ccc';
    return `1px solid ${color}`;
  };

  // 获取列边框样式
  const getColumnBorderStyle = () => {
    if (!mergedTheme.showColumnBorders) return 'none';
    
    if (mergedTheme.columnBorderStyle) {
      return mergedTheme.columnBorderStyle;
    }
    
    const color = mergedTheme.borderColor || '#ccc';
    return `1px solid ${color}`;
  };

  // 优化的交替行背景色计算方法
  const getBackgroundColor = useMemo(() => {
    // 创建一个映射来缓存行键到背景色的映射
    const backgroundColorMap: Record<string, string> = {};
    let globalIndex = 0;
    
    // 遍历数据并为每个行键分配背景色
    const traverse = (items: Array<Record<string, any>>, expanded: string[], depth: number = 0) => {
      for (const item of items) {
        const key = item[rowKey];
        if (key !== undefined) {
          // 根据全局索引确定背景色
          backgroundColorMap[key] = globalIndex % 2 === 0 
            ? mergedTheme.alternatingRowBgColor || '#f5f5f5'
            : mergedTheme.bodyBgColor || '#ffffff';
          globalIndex++;
          
          // 如果当前项已展开且有子项，则遍历子项
          if (expanded.includes(key) && item[childrenColumnName]?.length > 0) {
            traverse(item[childrenColumnName], expanded, depth + 1);
          }
        }
      }
    };
    
    traverse(dataSource, expandedRowKeys);
    
    // 返回一个函数，用于根据行键获取背景色
    return (rowKey: string) => backgroundColorMap[rowKey] || mergedTheme.bodyBgColor || '#ffffff';
  }, [dataSource, expandedRowKeys, rowKey, childrenColumnName, mergedTheme]);

  const renderRow = (
    dataItem: Record<string, any>,
    newColumns: Record<string, any>[],
    index: number,
    expanded: string[],
    Layer: number = 0
  ): ReactNode => {
    // 使用优化的方法获取背景色
    const backgroundColor = getBackgroundColor(dataItem[rowKey]);
    const isExpanded = expanded.includes(dataItem[rowKey]);
    
    return (
      <React.Fragment key={dataItem[rowKey]}>
        <div
          className="agglo-tree-table-row"
          style={{
            display: 'flex',
            backgroundColor: backgroundColor,
            height: rowHeight,
            color: mergedTheme.bodyTextColor,
            fontSize: mergedTheme.fontSize,
            // 使用新的行边框配置
            borderBottom: getRowBorderStyle(),
          }}
          {...(onRow ? onRow(dataItem, index) : {})}
        >
          {newColumns.map((column: Record<string, any>) => (
            <div
              key={column.dataIndex}
              className="agglo-tree-table-cell"
              style={{
                width: columnWidth[column.dataIndex] || column.width,
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                whiteSpace: 'nowrap',
                // 使用新的列边框配置
                borderRight: getColumnBorderStyle(),
                ...(column.style || {}),
              }}
            >
              {column.render
                ? column.render(dataItem[column.dataIndex], dataItem, index, expanded, Layer)
                : dataItem[column.dataIndex]}
            </div>
          ))}
        </div>
        {dataItem[childrenColumnName]?.length > 0 && (
          <div
            className="agglo-tree-table-expand-container"
            style={{
              overflow: 'hidden',
              maxHeight: isExpanded ? '1000px' : '0',
            }}
          >
            {isExpanded &&
              dataItem[childrenColumnName].map((item: Record<string, any>, ind: number) =>
                renderRow(item, newColumns, ind, expanded, Layer + 1)
              )}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <>
      <style>{`
        .agglo-tree-table-row {
          transition: background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        
        .agglo-tree-table-row:hover {
          background-color: ${mergedTheme.rowHoverBgColor} !important;
        }
        
        .agglo-tree-table-expand-container {
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      `}</style>
      {dataSource?.length > 0 ? (
        <List
          data={dataSource}
          height={0}
          itemKey={rowKey}
          style={{ overflowY: 'visible', zIndex: 0 }}
        >
          {(item, index) => renderRow(item, columns, index, expandedRowKeys, 0)}
        </List>
      ) : (
        <div
          style={{
            width: '100%',
            height: 250,
            color: mergedTheme.bodyTextColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          No data available
          无可用数据
        </div>
      )}
    </>
  );
};

export default memo(TableList);