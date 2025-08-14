import React, { useState } from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

// 通过接口定义复制TableTheme结构
interface TableTheme {
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

// Sample data
// 示例数据
const sampleData = [
  {
    positionId: '1',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    'MTE:pv': 10000,
    'MTE:delta': 500,
    'MTE:deltaCash': 25000,
    remainingLot: 100,
    remainingNotional: 50000,
  },
  {
    positionId: '2',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    'MTE:pv': 15000,
    'MTE:delta': 750,
    'MTE:deltaCash': 37500,
    remainingLot: 150,
    remainingNotional: 75000,
  },
  {
    positionId: '3',
    instrumentName: 'Microsoft Corp.',
    contractCode: 'MSFT',
    'MTE:pv': 20000,
    'MTE:delta': 1000,
    'MTE:deltaCash': 50000,
    remainingLot: 200,
    remainingNotional: 100000,
  },
  {
    positionId: '4',
    instrumentName: 'Microsoft Corp.',
    contractCode: 'MSFT',
    'MTE:pv': 25000,
    'MTE:delta': 1250,
    'MTE:deltaCash': 62500,
    remainingLot: 250,
    remainingNotional: 125000,
  },
  {
    positionId: '5',
    instrumentName: 'Google LLC',
    contractCode: 'GOOGL',
    'MTE:pv': 30000,
    'MTE:delta': 1500,
    'MTE:deltaCash': 75000,
    remainingLot: 300,
    remainingNotional: 150000,
  },
  {
    positionId: '6',
    instrumentName: 'Google LLC',
    contractCode: 'GOOGL',
    'MTE:pv': 35000,
    'MTE:delta': 1750,
    'MTE:deltaCash': 87500,
    remainingLot: 350,
    remainingNotional: 175000,
  },
];

// Table column definitions
// 表格列定义
const tableColumns = [
  {
    title: 'Instrument',
    dataIndex: 'instrumentName',
    width: 150,
  },
  {
    title: 'Contract',
    dataIndex: 'contractCode',
    width: 100,
  },
  {
    title: 'PV',
    dataIndex: 'MTE:pv',
    width: 120,
  },
  {
    title: 'Delta',
    dataIndex: 'MTE:delta',
    width: 120,
  },
  {
    title: 'Delta Cash',
    dataIndex: 'MTE:deltaCash',
    width: 120,
  },
  {
    title: 'Remaining Lot',
    dataIndex: 'remainingLot',
    width: 120,
  },
  {
    title: 'Remaining Notional',
    dataIndex: 'remainingNotional',
    width: 150,
  },
];

// 自定义主题配置
const customThemes: Record<string, TableTheme> = {
  dark: {
    primaryColor: '#007bff',
    headerBgColor: '#212529',
    headerTextColor: '#ffffff',
    bodyBgColor: '#343a40',
    bodyTextColor: '#ffffff',
    borderColor: '#495057',
    rowHoverBgColor: '#495057',
    alternatingRowBgColor: '#343a40',
    fontSize: 14,
    borderRadius: 4,
  },
  colorful: {
    primaryColor: '#ff6b6b',
    headerBgColor: '#ffe66d',
    headerTextColor: '#333333',
    bodyBgColor: '#ffffff',
    bodyTextColor: '#333333',
    borderColor: '#ffa8a8',
    rowHoverBgColor: '#fff0f0',
    alternatingRowBgColor: '#f8f9fa',
    fontSize: 15,
    borderRadius: 8,
  },
  corporate: {
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
  }
};

const ThemeExample = () => {
  const [theme, setTheme] = useState<'default' | 'antd' | 'agGrid' | 'custom-dark' | 'custom-colorful' | 'custom-corporate'>('default');

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value as 'default' | 'antd' | 'agGrid' | 'custom-dark' | 'custom-colorful' | 'custom-corporate';
    setTheme(selectedTheme);
  };

  // 确定传递给组件的实际主题值
  const getTableTheme = (): 'default' | 'antd' | 'agGrid' | TableTheme | undefined => {
    if (theme.startsWith('custom-')) {
      const themeName = theme.replace('custom-', '');
      return customThemes[themeName];
    }
    
    if (theme === 'default' || theme === 'antd' || theme === 'agGrid') {
      return theme;
    }
    
    return 'default';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>AggloTreeTable Theme Example</h1>
      <h2>AggloTreeTable 主题示例</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="theme-selector">选择主题: </label>
        <select id="theme-selector" value={theme} onChange={handleThemeChange}>
          <option value="default">默认主题</option>
          <option value="antd">Ant Design 风格</option>
          <option value="agGrid">AG Grid 风格</option>
          <option value="custom-dark">深色主题</option>
          <option value="custom-colorful">彩色主题</option>
          <option value="custom-corporate">企业风格</option>
        </select>
      </div>
      
      <AggloTreeTable
        columns={tableColumns}
        dataSource={sampleData}
        groupKeys={['instrumentName']}
        rowKey={'positionId'}
        tableFixedHeight={400}
        displayColumns={['instrumentName', 'contractCode', 'MTE:pv', 'MTE:delta', 'MTE:deltaCash', 'remainingLot', 'remainingNotional']}
        expandable={{
          expandDataIndex: 'expand',
          expandColumnWidth: 200,
          expandColumnTitle: 'Group',
        }}
        AggregateKeys={{
          equalKeys: ['instrumentName'],
          addBNkeys: [
            'MTE:pv',
            'MTE:delta',
            'MTE:deltaCash',
            'remainingLot',
            'remainingNotional',
          ],
        }}
        theme={getTableTheme()}
      />
    </div>
  );
};

export default ThemeExample;