import React, { useState } from 'react';
import { AggloTreeTable } from 'agglo-tree-table';

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
const customThemes = {
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
  const [theme, setTheme] = useState('default');
  const [customTheme, setCustomTheme] = useState(null);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    setCustomTheme(selectedTheme.startsWith('custom-') ? customThemes[selectedTheme.replace('custom-', '')] : null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>AggloTreeTable Theme Example</h1>
      <h2>AggloTreeTable 主题示例</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>选择主题: </label>
        <select value={theme} onChange={handleThemeChange}>
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
        theme={customTheme || theme}
      />
    </div>
  );
};

export default ThemeExample;