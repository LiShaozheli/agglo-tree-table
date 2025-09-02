import React, { useState } from 'react';
import { AggloTreeTable } from '../src';
import type { TableTheme } from '../src/components/VirtualTable/themes';
import '../src/components/VirtualTable/index.css';

// Sample data with hierarchical structure
// 带有层次结构的示例数据
const sampleData = [
  {
    positionId: '1',
    instrumentName: 'Apple Inc.',
    contractCode: 'AAPL',
    'MTE:pv': 10000,
    'MTE:delta': 500,
    'MTE:deltaCash': 25000,
    'MTE:gamma': 25,
    'MTE:vega': 100,
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
    'MTE:gamma': 37.5,
    'MTE:vega': 150,
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
    'MTE:gamma': 50,
    'MTE:vega': 200,
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
    'MTE:gamma': 62.5,
    'MTE:vega': 250,
    remainingLot: 250,
    remainingNotional: 125000,
  },
];

// Table column definitions with nested headers
// 带嵌套表头的表格列定义
const tableColumns = [
  {
    title: 'Basic Information',
    children: [
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
    ],
  },
  {
    title: 'Risk Metrics',
    children: [
      {
        title: 'PV',
        dataIndex: 'MTE:pv',
        width: 120,
      },
      {
        title: 'Greeks',
        children: [
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
            title: 'Gamma',
            dataIndex: 'MTE:gamma',
            width: 120,
          },
          {
            title: 'Vega',
            dataIndex: 'MTE:vega',
            width: 120,
          },
        ],
      },
    ],
  },
  {
    title: 'Position Info',
    children: [
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
    ],
  },
];

const NestedHeaderExample = () => {
  const [theme, setTheme] = useState<'default' | 'antd' | 'agGrid'>('default');

  return (
    <div className="example-container">
      <h1>AggloTreeTable Nested Header Example</h1>
      <h1>AggloTreeTable 嵌套表头示例</h1>
      
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
        groupKeys={['instrumentName']}
        rowKey={'positionId'}
        AggregateKeys={{
          equalKeys: ['instrumentName'],
          addBNkeys: [
            'MTE:pv',
            'MTE:delta',
            'MTE:deltaCash',
            'MTE:gamma',
            'MTE:vega',
            'remainingLot',
            'remainingNotional',
          ],
        }}
        theme={theme}
        showColumnManagement={true}
      />
    </div>
  );
};

export default NestedHeaderExample;