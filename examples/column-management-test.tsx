import React, { useState } from 'react';
import { AggloTreeTable } from '../src';
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

const ColumnManagementTest = () => {
  const [showColumnManagement, setShowColumnManagement] = useState(true);
  const [displayColumns, setDisplayColumns] = useState<string[] | undefined>(undefined);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Column Management Test</h1>
      
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={showColumnManagement}
            onChange={(e) => setShowColumnManagement(e.target.checked)}
          />
          Show Column Management
        </label>
        
        <button onClick={() => setDisplayColumns(['name', 'symbol'])}>
          Show Only Name & Symbol
        </button>
        
        <button onClick={() => setDisplayColumns(undefined)}>
          Reset to All Columns
        </button>
      </div>
      
      <AggloTreeTable
        columns={tableColumns}
        dataSource={sampleData}
        groupKeys={[]}
        rowKey="id"
        showColumnManagement={showColumnManagement}
      />
    </div>
  );
};

export default ColumnManagementTest;