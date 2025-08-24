/**
 * 虚拟表格列定义接口 - 有子列的列（dataIndex可选）
 * Interface for virtual table column definition with children (dataIndex is optional)
 */
export interface VirtualTableColumnWithChildren {
  /** 列标题 */
  /** Column title */
  title: string;
  /** 列数据字段（可选）*/
  /** Data index for the column (optional) */
  dataIndex?: string;
  /** 列宽度 */
  /** Width of the column */
  width?: number | string;
  /** 子列 */
  /** Child columns */
  children: (VirtualTableColumnWithChildren | VirtualTableColumnWithoutChildren)[];
  /** 列对齐方式 */
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** 自定义表头样式 */
  /** Custom header style */
  headerStyle?: React.CSSProperties;
  /** 其他属性 */
  /** Other properties */
  [key: string]: any;
}

/**
 * 虚拟表格列定义接口 - 无子列的列（dataIndex必需）
 * Interface for virtual table column definition without children (dataIndex is required)
 */
export interface VirtualTableColumnWithoutChildren {
  /** 列标题 */
  /** Column title */
  title: string;
  /** 列数据字段（必需）*/
  /** Data index for the column (required) */
  dataIndex: string;
  /** 列宽度 */
  /** Width of the column */
  width?: number | string;
  /** 列对齐方式 */
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** 自定义单元格渲染函数 */
  /** Custom cell render function */
  render?: (value: any, record: Record<string, any>, index: number, expanded: string[], layer: number) => React.ReactNode;
  /** 自定义表头样式 */
  /** Custom header style */
  headerStyle?: React.CSSProperties;
  /** 自定义单元格样式 */
  /** Custom cell style */
  style?: React.CSSProperties;
  /** 单元格点击事件 */
  /** Cell click handler */
  onCellClick?: (record: Record<string, any>, index: number, expanded: string[], layer: number) => void;
  /** 子列（无）*/
  /** Child columns (none) */
  children?: never;
  /** 其他属性 */
  /** Other properties */
  [key: string]: any;
}

/**
 * 虚拟表格列定义类型
 * Virtual table column definition type
 */
export type VirtualTableColumn = VirtualTableColumnWithChildren | VirtualTableColumnWithoutChildren;