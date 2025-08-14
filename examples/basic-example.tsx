import React from 'react';
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

const BasicExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>AggloTreeTable Basic Example</h1>
      <h1>AggloTreeTable 基础示例</h1>
      <AggloTreeTable
        columns={tableColumns}
        dataSource={sampleData}
        groupKeys={['instrumentName']}
        rowKey={'positionId'}
        tableFixedHeight={300}
        filterColumns={['instrumentName', 'contractCode', 'MTE:pv', 'MTE:delta', 'MTE:deltaCash', 'remainingLot', 'remainingNotional']}
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
      />
    </div>
  );
};

export default BasicExample;