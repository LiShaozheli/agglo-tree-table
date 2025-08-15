import React, { useState } from 'react';
import { AggloTreeTable } from '../src';
import type { TableTheme } from '../src/components/VirtualTable/themes';
import '../src/components/VirtualTable/index.css';

// Sample data with many columns to test horizontal scrolling
const sampleData = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: 150.0,
    change: 2.5,
    volume: 1000000,
    marketCap: 2500000000000,
    peRatio: 28.5,
    dividendYield: 0.6,
    eps: 5.27,
    beta: 1.2,
    '52WeekHigh': 182.94,
    '52WeekLow': 124.17,
  },
  {
    id: '2',
    name: 'Microsoft Corp.',
    symbol: 'MSFT',
    price: 300.0,
    change: -1.2,
    volume: 800000,
    marketCap: 2250000000000,
    peRatio: 35.2,
    dividendYield: 0.8,
    eps: 8.52,
    beta: 0.9,
    '52WeekHigh': 366.75,
    '52WeekLow': 257.65,
  },
  {
    id: '3',
    name: 'Google LLC',
    symbol: 'GOOGL',
    price: 2500.0,
    change: 5.3,
    volume: 500000,
    marketCap: 1650000000000,
    peRatio: 26.8,
    dividendYield: 0.0,
    eps: 93.31,
    beta: 1.1,
    '52WeekHigh': 2935.55,
    '52WeekLow': 2292.25,
  },
  {
    id: '4',
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    price: 3200.0,
    change: 1.8,
    volume: 600000,
    marketCap: 1600000000000,
    peRatio: 58.9,
    dividendYield: 0.0,
    eps: 54.35,
    beta: 1.3,
    '52WeekHigh': 3770.33,
    '52WeekLow': 2975.16,
  },
];

// Table columns with many fields to test horizontal scrolling
const tableColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    width: 100,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    width: 100,
  },
  {
    title: 'Change',
    dataIndex: 'change',
    width: 100,
  },
  {
    title: 'Volume',
    dataIndex: 'volume',
    width: 120,
  },
  {
    title: 'Market Cap',
    dataIndex: 'marketCap',
    width: 150,
  },
  {
    title: 'P/E Ratio',
    dataIndex: 'peRatio',
    width: 100,
  },
  {
    title: 'Dividend Yield',
    dataIndex: 'dividendYield',
    width: 130,
  },
  {
    title: 'EPS',
    dataIndex: 'eps',
    width: 100,
  },
  {
    title: 'Beta',
    dataIndex: 'beta',
    width: 100,
  },
  {
    title: '52 Week High',
    dataIndex: '52WeekHigh',
    width: 120,
  },
  {
    title: '52 Week Low',
    dataIndex: '52WeekLow',
    width: 120,
  },
];

const FixedColumnManagement = () => {
  const [theme, setTheme] = useState<TableTheme | 'default' | 'antd' | 'agGrid'>('agGrid');
  const [showColumnManagement, setShowColumnManagement] = useState(true);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Fixed Column Management</h1>
      
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={showColumnManagement}
            onChange={(e) => setShowColumnManagement(e.target.checked)}
          />
          Show Column Management
        </label>
        
        <select 
          value={typeof theme === 'string' ? theme : 'custom'}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'default' || value === 'antd' || value === 'agGrid') {
              setTheme(value);
            }
          }}
        >
          <option value="default">Default Theme</option>
          <option value="antd">Ant Design Theme</option>
          <option value="agGrid">AG Grid Theme</option>
        </select>
      </div>
      
      <div style={{ height: '400px' }}>
        <AggloTreeTable
          columns={tableColumns}
          dataSource={sampleData}
          groupKeys={[]}
          rowKey="id"
          showColumnManagement={showColumnManagement}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default FixedColumnManagement;