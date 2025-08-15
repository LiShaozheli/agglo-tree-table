import React, { useState } from 'react';
import { AggloTreeTable } from '../src';
import type { TableTheme } from '../src/components/VirtualTable/themes';
import '../src/components/VirtualTable/index.css';

// Sample data
const sampleData = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: 150.0,
    change: 2.5,
    volume: 1000000,
  },
  {
    id: '2',
    name: 'Microsoft Corp.',
    symbol: 'MSFT',
    price: 300.0,
    change: -1.2,
    volume: 800000,
  },
  {
    id: '3',
    name: 'Google LLC',
    symbol: 'GOOGL',
    price: 2500.0,
    change: 5.3,
    volume: 500000,
  },
  {
    id: '4',
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    price: 3200.0,
    change: 1.8,
    volume: 600000,
  },
];

// Table columns
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
];

const AgGridStyleColumnManagement = () => {
  const [theme, setTheme] = useState<TableTheme | 'default' | 'antd' | 'agGrid'>('agGrid');
  const [showColumnManagement, setShowColumnManagement] = useState(true);

  return (
    <div style={{ padding: '20px' }}>
      <h1>AgGrid Style Column Management</h1>
      
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
      
      <AggloTreeTable
        columns={tableColumns}
        dataSource={sampleData}
        groupKeys={[]}
        rowKey="id"
        showColumnManagement={showColumnManagement}
        theme={theme}
      />
    </div>
  );
};

export default AgGridStyleColumnManagement;