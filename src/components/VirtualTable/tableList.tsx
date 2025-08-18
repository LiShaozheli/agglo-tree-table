import React, { memo, useMemo } from 'react';
import List from 'rc-virtual-list';
import type { TableTheme } from './themes';
import './tableList.css';
import './index.css';

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
const TableList = (props: TableListProps) => {
  const {
    rowKey,
    dataSource,
    columns,
    expandedRowKeys,
    rowHeight,
    columnWidth,
    childrenColumnName,
    onRow,
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

  const getNewDataSource = (data: Record<string, any>[], Layer: number = 0) => {
    const newDataSource = data.reduce((acc: Record<string, any>[], item: Record<string, any>) => {
      const newItem = { ...item, _layer: Layer };
      acc.push(newItem);
      const isExpanded = expandedRowKeys.includes(item[rowKey]);
      // 如果有子项，则递归处理
      const children = item[childrenColumnName as keyof typeof item];
      if (isExpanded && children && Array.isArray(children) && children.length > 0) {
        const childItems = getNewDataSource(children, Layer + 1);
        acc.push(...childItems);
      }

      return acc;
    }, []);
    return newDataSource;
  };

  // 获取新的数据源，添加层级信息
  const newDataSource = useMemo(() => getNewDataSource(dataSource), [dataSource, rowKey, expandedRowKeys, childrenColumnName]);

  const renderRow = (
    dataItem: Record<string, any>,
    newColumns: Record<string, any>[],
    index: number,
    expanded: string[],
    columnWidth: Record<string, number>
  ): React.ReactNode => {
    return (
      <div
        key={dataItem[rowKey]}
        className="agglo-tree-table-row"
        style={{
          display: 'flex',
          backgroundColor: index % 2 === 0
            ? mergedTheme.alternatingRowBgColor || '#f5f5f5'
            : mergedTheme.bodyBgColor || '#ffffff',
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
            key={`${dataItem[rowKey]}-${column.dataIndex}`}
            className="agglo-tree-table-cell"
            style={{
              width: columnWidth[column.dataIndex] || column.width,
              // 使用新的列边框配置
              borderRight: getColumnBorderStyle(),
              boxSizing: 'border-box',
            }}
            onClick={column.onCellClick ? () => column.onCellClick(dataItem, index, expanded, dataItem._layer) : undefined}
          >
            <div style={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0, // 关键：允许 flex item 收缩以触发文本省略
              padding: '8px 12px', // 添加默认padding
              textAlign: column.align || 'center',
              boxSizing: 'border-box',
              ...(column.style || {}), // 将用户自定义样式移到内层
            }}>
              {column.render
                ? column.render(dataItem[column.dataIndex], dataItem, index, expanded, dataItem._layer)
                : dataItem[column.dataIndex]}
            </div>
          </div>
        ))}
      </div>
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
      `}</style>
      {dataSource?.length > 0 ? (
        <List
          data={newDataSource}
          height={0}
          itemKey={rowKey}
          className="virtual-list-container"
        >
          {(item, index) => renderRow(item, columns, index, expandedRowKeys, columnWidth)}
        </List>
      ) : (
        <div
          className="agglo-tree-table-empty"
          style={{
            color: mergedTheme.bodyTextColor,
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