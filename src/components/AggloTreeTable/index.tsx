import React, { useState, useEffect, useRef } from 'react';
import VirtualTable, { type VirtualTableProps, type VirtualTableHandles } from '../VirtualTable';
import { TreeClass } from '../../utils/treeClass';
import ColumnManager from './columnManager';
import { predefinedThemes, type TableTheme } from '../VirtualTable/themes';
import type { VirtualTableColumn } from './types';

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
export interface AggloTreeTableProps extends Omit<VirtualTableProps, 'columns' | 'dataSource' | 'expandable'> {
  /** Keys to group by, in hierarchical order */
  /** 用于分组的键，按层级顺序排列 */
  groupKeys?: string[];
  /** Table columns configuration */
  /** 表格列配置 */
  columns?: VirtualTableColumn[];
  /** Table data source */
  /** 表格数据源 */
  dataSource?: Array<Record<string, any>>;
  /** Configuration for data aggregation */
  /** 数据聚合配置 */
  AggregateKeys?: AggregateKeysType;
  /** Whether the table container is resizable */
  /** 表格容器是否可调整大小 */
  resizable?: boolean;
  /** Sort function for tree nodes */
  /** 树节点排序函数 */
  sort?: (a: any, b: any) => number;
  /** Whether to show column management component */
  /** 是否显示列管理组件 */
  showColumnManagement?: boolean;
  /** Position of the column management component */
  /** 列管理组件的位置 */
  columnManagerPosition?: 'left' | 'right';
  /** Width of the table container */
  /** 表格容器的宽度 */
  width?: number | string;
  /** Height of the table container */
  /** 表格容器的高度 */
  height?: number | string;
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
    groupKeys = [],
    columns = [],
    dataSource = [],
    rowKey,
    AggregateKeys,
    sort,
    showColumnManagement = false,
    columnManagerPosition = 'right',
    width = '100%',
    theme,
    ...restProps
  } = props;

  const expandable = (props as VirtualTableProps).expandable;

  const expandDataIndex = expandable?.expandDataIndex ?? 'expand';

  const [processedDataSource, setProcessedDataSource] = useState<any[]>([]);
  const [processedColumns, setProcessedColumns] = useState<any[]>(columns);
  const virtualTableRef = useRef<VirtualTableHandles>(null);

  // 处理数据源，包括分组和聚合
  useEffect(() => {
    if (groupKeys?.length < 1) {
      setProcessedDataSource(dataSource);
    } else {
      const arrayTreeData = new TreeClass();
      arrayTreeData.creatTreeData(dataSource, groupKeys, rowKey, expandDataIndex);
      if (!AggregateKeys) {
        setProcessedDataSource(arrayTreeData.treeData);
      } else {
        const newData = arrayTreeData.addTree(AggregateKeys, sort);
        setProcessedDataSource(Array.isArray(newData) ? newData : [newData]);
      }
    }
  }, [dataSource, groupKeys, rowKey, expandDataIndex, AggregateKeys, sort]);

  // 使用useImperativeHandle暴露方法给父组件调用
  React.useImperativeHandle(ref, () => ({
    expandAll: () => virtualTableRef.current?.expandAll(),
    collapseAll: () => virtualTableRef.current?.collapseAll(),
  }));

  // 处理主题配置
  const tableTheme: TableTheme = typeof theme === 'string' ? predefinedThemes[theme] : { ...predefinedThemes.default, ...theme };

  return (
    <div style={{
      display: 'flex',
      width: width,
      overflowX: 'hidden', // 防止在 AggloTreeTable 级别出现横向滚动条
      overflowY: 'visible',
      flexDirection: columnManagerPosition === 'left' ? 'row' : 'row-reverse',
      maxHeight: 'max-content',
    }}>
      {showColumnManagement && columns && (
        <ColumnManager
          columns={processedColumns}
          onColumnChange={setProcessedColumns}
          theme={tableTheme}
          position={columnManagerPosition}
        />
      )}
      <VirtualTable
        ref={virtualTableRef}
        {...restProps}
        columns={processedColumns}
        dataSource={processedDataSource}
        rowKey={rowKey}
        theme={theme}
        expandable={{
          expandRowByClick: groupKeys?.length > 0,
          childrenColumnName: 'children',
          expandDataIndex,
          ...expandable,
        }}
      />
    </div>
  );
});

export default AggloTreeTable;