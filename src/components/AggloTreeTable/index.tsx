import React, { useState, useEffect, useRef } from 'react';
import VirtualTable, { type VirtualTableProps, type VirtualTableHandles } from '../VirtualTable';
import { TreeClass } from '../../utils/treeClass';
import ColumnManager from './columnManager';
import type { TableTheme } from '../VirtualTable/themes';

/**
 * Configuration for data aggregation
 * 数据聚合配置
 */
export interface AggregateKeysType {
  /** Keys that should be summed using simple addition */
  /** 应使用简单加法求和的键 */
  addkeys?: string[];
  /** Keys that should be summed using BigNumber for precision */
  /** 应使用 BigNumber 精确计算求和的键 */
  addBNkeys?: string[];
  /** Keys that should be displayed only when values are equal across all children */
  /** 仅当所有子项值相等时才显示的键 */
  equalKeys?: string[];
}

/**
 * Props for the AggloTreeTable component
 * AggloTreeTable 组件的 Props
 */
export interface AggloTreeTableProps extends VirtualTableProps {
  /** Keys to group by, in hierarchical order */
  /** 用于分组的键，按层级顺序排列 */
  groupKeys: string[];
  /** Configuration for data aggregation */
  /** 数据聚合配置 */
  AggregateKeys?: {
    addkeys?: string[];
    addBNkeys?: string[];
    equalKeys?: string[];
  };
  /** Sort function for tree nodes */
  /** 树节点排序函数 */
  sort?: (a: any, b: any) => number;
  /** Columns to display in the table */
  /** 表格中要显示的列 */
  displayColumns?: string[];
  /** Whether to show column management component */
  /** 是否显示列管理组件 */
  showColumnManagement?: boolean;
  /** Position of the column management component */
  /** 列管理组件的位置 */
  columnManagerPosition?: 'left' | 'right';
  /** Width of the table container */
  /** 表格容器的宽度 */
  width?: number | string;
}

// 添加AggloTreeTable的公开方法接口
export interface AggloTreeTableHandles {
  /** Expand all rows */
  /** 展开所有行 */
  expandAll: () => void;
  /** Collapse all rows */
  /** 收起所有行 */
  collapseAll: () => void;
}

/**
 * A React tree table component with aggregation capabilities for financial data.
 * 一个支持金融数据聚合功能的 React 树形表格组件。
 * 
 * This component extends VirtualTable to provide tree-like data grouping and aggregation features.
 * 该组件扩展了 VirtualTable，提供了树形数据分组和聚合功能。
 * It's particularly useful for financial applications where data needs to be grouped and summarized
 * across multiple dimensions.
 * 它特别适用于需要在多个维度上对数据进行分组和汇总的金融应用。
 * 
 * @example
 * ```tsx
 * <AggloTreeTable
 *   columns={columns}
 *   dataSource={data}
 *   groupKeys={['category', 'subcategory']}
 *   rowKey="id"
 *   AggregateKeys={{
 *     equalKeys: ['currency'],
 *     addBNkeys: ['amount', 'balance']
 *   }}
 * />
 * ```
 */
const AggloTreeTable = React.forwardRef<AggloTreeTableHandles, AggloTreeTableProps>((props, ref) => {
  const {
    groupKeys,
    columns,
    dataSource,
    rowKey,
    AggregateKeys,
    displayColumns,
    loading,
    expandable,
    sort = () => 1,
    showColumnManagement = false,
    columnManagerPosition = 'right',
    width = '100%',
    theme,
  } = props;

  const expandDataIndex = expandable?.expandDataIndex ?? 'expand';
  
  const [newDataSource, setNewDataSource] = useState<any[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (displayColumns) return displayColumns;
    if (!columns) return [];
    
    // 如果没有提供 displayColumns 且 columns 存在，则默认显示所有列
    return columns
      .filter(col => !col.children)
      .map(col => col.dataIndex)
      .filter(Boolean) as string[];
  });

  const [expandRowByClick, setExpandRowByClick] = useState(false);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const virtualTableRef = useRef<VirtualTableHandles>(null);

  useEffect(() => {
    if (displayColumns) {
      setVisibleColumns(displayColumns);
    } else if (columns) {
      // 如果没有提供 displayColumns，则默认显示所有列
      const allColumnKeys = columns
        .filter(col => !col.children)
        .map(col => col.dataIndex)
        .filter(Boolean) as string[];
      setVisibleColumns(allColumnKeys);
    }
    
    // 初始化列顺序
    if (columns) {
      const allColumnKeys = columns
        .filter(col => !col.children)
        .map(col => col.dataIndex)
        .filter(Boolean) as string[];
      setColumnOrder(allColumnKeys);
    }
  }, [displayColumns, columns]);

  useEffect(() => {
    if (groupKeys?.length < 1) {
      setNewDataSource(dataSource || []);
      setExpandRowByClick(false);
    } else {
      setExpandRowByClick(true);
      const arrayTreeData = new TreeClass();
      arrayTreeData.creatTreeData(dataSource || [], groupKeys, rowKey, expandDataIndex);
      if (!AggregateKeys) {
        setNewDataSource(arrayTreeData.treeData);
        return;
      }
      const newData = arrayTreeData.addTree(AggregateKeys, sort);
      // 修复类型错误：确保传递给 setNewDataSource 的始终是数组
      setNewDataSource(Array.isArray(newData) ? newData : [newData]);
    }
  }, [dataSource, groupKeys, AggregateKeys, rowKey, expandDataIndex, sort]);

  // 使用useImperativeHandle暴露方法给父组件调用
  React.useImperativeHandle(ref, () => ({
    expandAll: () => virtualTableRef.current?.expandAll(),
    collapseAll: () => virtualTableRef.current?.collapseAll(),
  }));

  const handleColumnVisibilityChange = (newVisibleColumns: string[]) => {
    setVisibleColumns(newVisibleColumns);
  };

  const handleColumnOrderChange = (newColumnOrder: string[]) => {
    setColumnOrder(newColumnOrder);
  };

  // 处理主题配置
  const tableTheme: TableTheme | undefined = typeof theme === 'string' ? undefined : theme;

  // 根据列顺序重新排列列
  const reorderColumns = (cols: any[], order: string[]): any[] => {
    if (!order || order.length === 0) return cols;
    
    // 创建一个映射来快速查找列的索引
    const orderMap = new Map(order.map((dataIndex, index) => [dataIndex, index]));
    
    // 递归处理列和子列
    const reorder = (columns: any[]): any[] => {
      // 先处理子列
      const processedColumns = columns.map(col => {
        if (col.children) {
          return {
            ...col,
            children: reorder(col.children)
          };
        }
        return col;
      });
      
      // 然后根据order排序
      return processedColumns.sort((a, b) => {
        // 如果是父列（有子列），我们基于第一个叶子子列来排序
        if (a.children) {
          // 找到第一个叶子子列
          let firstLeafA = a.children[0];
          while (firstLeafA && firstLeafA.children) {
            firstLeafA = firstLeafA.children[0];
          }
          
          let firstLeafB = b.children[0];
          while (firstLeafB && firstLeafB.children) {
            firstLeafB = firstLeafB.children[0];
          }
          
          const indexA = firstLeafA?.dataIndex ? orderMap.get(firstLeafA.dataIndex) : Infinity;
          const indexB = firstLeafB?.dataIndex ? orderMap.get(firstLeafB.dataIndex) : Infinity;
          
          return (indexA ?? Infinity) - (indexB ?? Infinity);
        }
        
        // 如果是叶子列（没有子列），根据order排序
        const indexA = a.dataIndex ? orderMap.get(a.dataIndex) : Infinity;
        const indexB = b.dataIndex ? orderMap.get(b.dataIndex) : Infinity;
        
        return (indexA ?? Infinity) - (indexB ?? Infinity);
      });
    };
    
    return reorder(cols);
  };

  // ColumnManager 的宽度计算 (按钮宽度 24px + 左右边框各 1px)
  const columnManagerWidth = 26;
  
  // 计算 VirtualTable 容器的样式
  const virtualTableContainerStyle = showColumnManagement && columns 
    ? { 
        width: `calc(${typeof width === 'number' ? `${width}px` : width} - ${columnManagerWidth}px)`,
        height: '100%',
        marginLeft: columnManagerPosition === 'left' ? `${columnManagerWidth}px` : '0',
        marginRight: columnManagerPosition === 'right' ? `${columnManagerWidth}px` : '0'
      }
    : { 
        width: width,
        height: '100%'
      };

  return (
    <div style={{ 
      position: 'relative',
      display: 'flex',
      height: '100%',
      width: width,
      overflowX: 'hidden', // 防止在 AggloTreeTable 级别出现横向滚动条
      overflowY: 'visible',
    }}>
      {showColumnManagement && columns && (
        <div style={{ 
          position: 'absolute',
          left: columnManagerPosition === 'left' ? 0 : undefined,
          right: columnManagerPosition === 'right' ? 0 : undefined,
          top: 0,
          bottom: 0,
          zIndex: 1001
        }}>
          <ColumnManager
            columns={columns}
            visibleColumns={visibleColumns}
            onColumnVisibilityChange={handleColumnVisibilityChange}
            onColumnOrderChange={handleColumnOrderChange}
            theme={tableTheme}
            position={columnManagerPosition}
          />
        </div>
      )}
      <div style={virtualTableContainerStyle}>
        <VirtualTable
          ref={virtualTableRef}
          {...props}
          displayColumns={displayColumns || visibleColumns}
          loading={loading}
          columns={columns ? reorderColumns(columns, columnOrder) : columns}
          dataSource={newDataSource}
          rowKey={rowKey}
          expandable={{
            expandRowByClick,
            ...expandable,
          }}
        />
      </div>
    </div>
  );
});

export default AggloTreeTable;