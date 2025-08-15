import React, { FC, memo, useEffect, useState, useRef } from 'react';
import VirtualTable, { VirtualTableProps, VirtualTableHandles } from '../VirtualTable';
import { TreeClass, DataTreeType } from '../../utils/treeClass';

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
  AggregateKeys?: AggregateKeysType;
  /** Sort function for tree nodes */
  /** 树节点排序函数 */
  sort?: (a: any, b: any) => number;
  /** Columns to display in the table */
  /** 表格中要显示的列 */
  displayColumns?: string[];
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
    tableFixedHeight,
    displayColumns,
    loading,
    expandable,
    sort = () => 1,
  } = props;

  const expandDataIndex = expandable?.expandDataIndex ?? 'expand';
  
  const [newDataSource, setNewDataSource] = useState<any[]>([]);

  const [expandRowByClick, setExpandRowByClick] = useState(false);
  const virtualTableRef = useRef<VirtualTableHandles>(null);

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

  return (
    <VirtualTable
      ref={virtualTableRef}
      {...props}
      loading={loading}
      columns={columns}
      dataSource={newDataSource}
      rowKey={rowKey}
      tableFixedHeight={tableFixedHeight}
      expandable={{
        expandRowByClick,
        ...expandable,
      }}
    />
  );
});

export default memo(AggloTreeTable);