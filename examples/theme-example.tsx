import React, { useState } from 'react';
import { VirtualTable, VirtualTableHandles } from '../src';
import './example.css';

const ThemeExample = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: 100,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];

  const data = Array.from({ length: 1000 }).map((_, index) => ({
    key: index,
    name: `Name ${index}`,
    age: Math.floor(Math.random() * 100),
    address: `Address ${index}`,
  }));

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div style={{ padding: '20px' }}>
      <h2>主题示例 (Theme Example)</h2>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setTheme('light')}
          style={{ 
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: theme === 'light' ? '#1890ff' : '#f0f0f0',
            color: theme === 'light' ? '#fff' : '#000',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          明亮模式 (Light Mode)
        </button>
        <button 
          onClick={() => setTheme('dark')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: theme === 'dark' ? '#177ddc' : '#f0f0f0',
            color: theme === 'dark' ? '#fff' : '#000',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          暗黑模式 (Dark Mode)
        </button>
      </div>
      
      <div style={theme === 'dark' ? { background: '#141414', padding: '20px', borderRadius: '4px' } : {}}>
        <VirtualTable
          columns={columns}
          dataSource={data}
          rowKey="key"
          theme={theme}
        />
      </div>
    </div>
  );
};

export default ThemeExample;
