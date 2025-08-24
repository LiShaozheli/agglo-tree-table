/**
 * 表格列定义接口
 * Interface for table column definition
 */
export interface ColumnType {
  /** 列标题 */
  /** Column title */
  title: string;
  /** 列数据字段 */
  /** Data index for the column */
  dataIndex?: string;
  /** 列宽度 */
  /** Width of the column */
  width?: number | string;
  /** 列是否可见 */
  /** Whether the column is visible */
  visible?: boolean;
  /** 子列 */
  /** Child columns */
  children?: ColumnType[];
  /** 其他属性 */
  /** Other properties */
  [key: string]: any;
}