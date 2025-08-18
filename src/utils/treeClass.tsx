import BN from 'bignumber.js';

/**
 * Type definition for tree data structure
 * 树形数据结构的类型定义
 */
export interface DataTreeType extends Record<string, any> {
  /** Expand data index */
  /** 展开数据索引 */
  expandDataIndex?: string | number;
  /** Children nodes */
  /** 子节点 */
  children?: DataTreeType[];
}

/**
 * A utility class for handling tree data operations.
 * 一个处理树形数据操作的工具类。
 * 
 * This class provides methods for creating tree structures from flat data,
 * grouping data by keys, and aggregating values across tree nodes.
 * 该类提供了从平面数据创建树形结构、按键分组数据以及跨树节点聚合值的方法。
 */
export class TreeClass {
  /** Tree data */
  /** 树形数据 */
  public treeData: DataTreeType[];

  constructor() {
    this.treeData = [];
  }

  /**
   * Create tree data from flat data source
   * 从平面数据源创建树形数据
   * @param dataSource - Flat data array
   * @param dataSource - 平面数据数组
   * @param groupKeys - Keys to group by
   * @param groupKeys - 用于分组的键
   * @param rowKey - Unique row key
   * @param rowKey - 唯一行键
   * @param expandDataIndex - Expand data index
   * @param expandDataIndex - 展开数据索引
   */
  public creatTreeData = (
    dataSource: Array<Record<string, any>>,
    keys: string[],
    groupKeys: string,
    expandDataIndex: string
  ) => {
    dataSource.forEach(item => this.pushData(this.treeData, item, keys, groupKeys, expandDataIndex));
  };

  /**
   * Aggregate tree data
   * 聚合树形数据
   * @param tree - Tree data array
   * @param tree - 树形数据数组
   * @param aggregateKeys - Keys for aggregation
   * @param aggregateKeys - 用于聚合的键
   * @param treeItem - Tree item
   * @param treeItem - 树项
   * @param sort - Sort function
   * @param sort - 排序函数
   */
  public addTreeData = (
    tree: DataTreeType[],
    aggregateKeys: { addkeys?: string[]; addBNkeys?: string[]; equalKeys?: string[] },
    treeItem?: DataTreeType,
    sort: (a: any, b: any) => number = () => 1
  ): DataTreeType | DataTreeType[] => {
    if (tree?.length < 1) return treeItem || tree;

    const newTree = tree
      .map(dataItem => this.addTreeData(dataItem.children || [], aggregateKeys, dataItem, sort))
      .sort(sort);

    if (!treeItem) return newTree;

    const obj: Record<string, any> = { length: 0 };
    const { addkeys = [], addBNkeys = [], equalKeys = [] } = aggregateKeys;

    newTree.forEach(data => {
      // 修复类型错误：确保 data 是 DataTreeType 类型再访问 children 属性
      const treeData = Array.isArray(data) ? { children: data } : data;
      obj.length = obj.length + (treeData?.length || treeData?.children?.length || 0);

      // 修复类型错误：添加类型断言确保 data 是 DataTreeType 类型
      const dataItem = data as DataTreeType;
      Object.keys(data).forEach(key => {
        if (addkeys.includes(key)) {
          obj[key] = (obj[key] || 0) + (dataItem[key] || 0);
        }
        if (addBNkeys.includes(key) && !addkeys.includes(key)) {
          obj[key] = new BN(obj[key] || 0).plus(dataItem[key] || 0).toNumber();
        }
        if (equalKeys.includes(key) && !addBNkeys.includes(key) && !addkeys.includes(key)) {
          if (obj[key] === null || obj[key] === undefined) {
            obj[key] = dataItem[key];
          }
          if (obj[key] !== dataItem[key]) {
            obj[key] = '';
          }
        }
      });
    });

    return Object.assign(treeItem, obj);
  };

  /**
   * Add tree data with aggregation
   * 添加带聚合的树形数据
   * @param aggregateKeys - Keys for aggregation
   * @param aggregateKeys - 用于聚合的键
   * @param sort - Sort function
   * @param sort - 排序函数
   */
  public addTree = (
    aggregateKeys: {
      addkeys?: string[];
      addBNkeys?: string[];
      equalKeys?: string[];
    },
    sort: (a: any, b: any) => number = () => 1
  ) => {
    // 修复类型错误：将 null 改为 undefined 以匹配可选参数类型
    return this.addTreeData(this.treeData, aggregateKeys, undefined, sort);
  };

  /**
   * Push data to tree
   * 向树中添加数据
   * @param dataArr - Data array
   * @param dataArr - 数据数组
   * @param data - Data item
   * @param data - 数据项
   * @param keys - Keys to group by
   * @param groupKeys - 用于分组的键
   * @param rowKey - Row key
   * @param rowKey - 行键
   * @param expandDataIndex - Expand data index
   * @param expandDataIndex - 展开数据索引
   */
  protected pushData = (
    dataArr: DataTreeType[],
    data: Record<string, any>,
    groupKeys: string[],
    rowKey: string,
    expandDataIndex: string
  ) => {
    const thisKeys = [...groupKeys];
    if (thisKeys.length < 1) return;
    const groupKey = thisKeys.shift();

    if (groupKey === undefined || groupKey === null) return;

    const isHas = dataArr.some(item => item[expandDataIndex] === data[groupKey]);

    if (!isHas) {
      dataArr.push({
        [expandDataIndex]: data[groupKey],
        children: [],
        [rowKey]: `${data[groupKey]}-${data[rowKey]}`,
        _rowKey_: groupKey,
      });
    }

    dataArr.forEach(item => {
      if (item[expandDataIndex] === data[groupKey]) {
        if (thisKeys.length > 0) {
          this.pushData(item.children || [], data, thisKeys, rowKey, expandDataIndex);
        } else {
          item.children?.push(data);
        }
      }
    });
  };
}