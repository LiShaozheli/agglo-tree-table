/**
 * 虚拟表格列定义类型
 * Virtual table column definition type
 */
export type VirtualTableColumn = {
  /** 列标题 */
  /** Column title */
  title: React.ReactNode;
  /** 列对齐方式 */
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** 自定义表头样式 */
  /** Custom header style */
  headerStyle?: React.CSSProperties;
} & (
    {
      /** 列数据字段（必需）*/
      /** Data index for the column (required) */
      dataIndex: string;
      /** 列宽度 */
      /** Width of the column */
      width?: number | string;
      /** 自定义单元格渲染函数 */
      /** Custom cell render function */
      render?: (value: any, record: Record<string, any>, index: number, expanded: string[], layer: number) => React.ReactNode;
      /** 自定义单元格样式 */
      /** Custom cell style */
      style?: React.CSSProperties;
      /** 单元格点击事件 */
      /** Cell click handler */
      onCellClick?: (record: Record<string, any>, index: number, expanded: string[], layer: number) => void;
      /** 是否可见 */
      /** Whether the column is visible */
      visible?: boolean;
    } | {
      /** 列数据字段（可选）*/
      /** Data index for the column (optional) */
      dataIndex?: string;
      /** 子列 */
      /** Child columns */
      children: VirtualTableColumn[];
    }
  )