import React, { useState } from 'react';
import { AggloTreeTable } from '../src';
import type { TableTheme } from '../src/components/VirtualTable/themes';
import '../src/components/VirtualTable/index.css';

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
    department: 'Technology',
    region: 'North America',
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
    department: 'Technology',
    region: 'North America',
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
    department: 'Technology',
    region: 'North America',
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
    department: 'Technology',
    region: 'North America',
  },
  {
    positionId: '5',
    instrumentName: 'Tesla Inc.',
    contractCode: 'TSLA',
    'MTE:pv': 30000,
    'MTE:delta': 1500,
    'MTE:deltaCash': 75000,
    remainingLot: 300,
    remainingNotional: 150000,
    department: 'Automotive',
    region: 'North America',
  },
  {
    positionId: '6',
    instrumentName: 'Tesla Inc.',
    contractCode: 'TSLA',
    'MTE:pv': 35000,
    'MTE:delta': 1750,
    'MTE:deltaCash': 87500,
    remainingLot: 350,
    remainingNotional: 175000,
    department: 'Automotive',
    region: 'Europe',
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
    title: 'Department',
    dataIndex: 'department',
    width: 120,
  },
  {
    title: 'Region',
    dataIndex: 'region',
    width: 120,
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

const GroupManagementExample = () => {
  const [theme, setTheme] = useState<'default' | 'antd' | 'agGrid'>('default');

  return (
    <div className="example-container">
      <h1>AggloTreeTable Group Management Example</h1>
      <h1>AggloTreeTable 分组管理示例</h1>
      
      <div className="example-theme-selector">
        <label htmlFor="theme-select">选择主题: </label>
        <select id="theme-select" value={theme} onChange={(e) => setTheme(e.target.value as 'default' | 'antd' | 'agGrid')}>
          <option value="default">默认主题</option>
          <option value="antd">Ant Design 风格</option>
          <option value="agGrid">AG Grid 风格</option>
        </select>
      </div>
      
      <AggloTreeTable
        columns={tableColumns}
        dataSource={sampleData}
        rowKey={'positionId'}
        showGroupManagement={true}
        groupManagerPosition="top"
        theme={theme}
        height={400}
      />
    </div>
  );
};

export default GroupManagementExample;