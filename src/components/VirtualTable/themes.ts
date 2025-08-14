
/**
 * Table theme configuration
 * 表格主题配置
 */
export interface TableTheme {
  /** Primary color */
  /** 主色调 */
  primaryColor?: string;
  /** Header background color */
  /** 表头背景色 */
  headerBgColor?: string;
  /** Header text color */
  /** 表头文字颜色 */
  headerTextColor?: string;
  /** Body background color */
  /** 表格主体背景色 */
  bodyBgColor?: string;
  /** Body text color */
  /** 表格主体文字颜色 */
  bodyTextColor?: string;
  /** Border color */
  /** 边框颜色 */
  borderColor?: string;
  /** Row hover background color */
  /** 行悬停背景色 */
  rowHoverBgColor?: string;
  /** Alternating row background color */
  /** 交替行背景色 */
  alternatingRowBgColor?: string;
  /** Font size */
  /** 字体大小 */
  fontSize?: number;
  /** Border radius */
  /** 边框圆角 */
  borderRadius?: number;
  /** Header font weight */
  /** 表头字体粗细 */
  headerFontWeight?: number | string;
  /** Show column borders */
  /** 是否显示列分割线 */
  showColumnBorders?: boolean;
  /** Show row borders */
  /** 是否显示行分割线 */
  showRowBorders?: boolean;
  /** Show header row border */
  /** 是否显示表头行分割线 */
  showHeaderRowBorder?: boolean;
  /** Column border color */
  /** 列分割线颜色 */
  columnBorderColor?: string;
  /** Row border color */
  /** 行分割线颜色 */
  rowBorderColor?: string;
  /** Column border style */
  /** 列分割线样式 */
  columnBorderStyle?: string;
  /** Row border style */
  /** 行分割线样式 */
  rowBorderStyle?: string;
  /** Header column border style */
  /** 表头列分割线样式 */
  headerColumnBorderStyle?: string;
  /** Header row border style */
  /** 表头行分割线样式 */
  headerRowBorderStyle?: string;
}

/**
 * Predefined themes
 * 预定义主题
 */
export const predefinedThemes: Record<string, TableTheme> = {
  default: {
    primaryColor: '#1890ff',
    headerBgColor: '#fafafa',
    headerTextColor: '#000000d9',
    bodyBgColor: '#ffffff',
    bodyTextColor: '#000000d9',
    borderColor: '#f0f0f0',
    rowHoverBgColor: '#f5f5f5',
    alternatingRowBgColor: '#fafafa',
    fontSize: 14,
    borderRadius: 2,
    showColumnBorders: true,
    showRowBorders: true,
    showHeaderRowBorder: true,
  },
  antd: {
    primaryColor: '#1890ff',
    headerBgColor: '#fafafa',
    headerTextColor: '#000000d9',
    bodyBgColor: '#ffffff',
    bodyTextColor: '#000000d9',
    borderColor: '#f0f0f0',
    rowHoverBgColor: '#f5f5f5',
    alternatingRowBgColor: '#ffffff',
    fontSize: 14,
    borderRadius: 2,
    showColumnBorders: false,
    showRowBorders: true,
    showHeaderRowBorder: true,
    rowBorderStyle: '1px solid #f0f0f0',
    headerRowBorderStyle: '1px solid #f0f0f0',
  },
  agGrid: {
    primaryColor: '#007bff',
    headerBgColor: '#f8f9fa',
    headerTextColor: '#212529',
    bodyBgColor: '#ffffff',
    bodyTextColor: '#212529',
    borderColor: '#dee2e6',
    rowHoverBgColor: '#e9ecef',
    alternatingRowBgColor: '#f8f9fa',
    fontSize: 13,
    borderRadius: 0,
    headerFontWeight: 600,
    showColumnBorders: true,
    showRowBorders: false,
    showHeaderRowBorder: true,
    columnBorderStyle: '1px solid #dee2e6',
    headerColumnBorderStyle: '1px solid #dee2e6',
    headerRowBorderStyle: '1px solid #dee2e6',
  },
};