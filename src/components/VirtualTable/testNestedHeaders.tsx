import React from 'react';
import VirtualTable from './index';

// 创建测试用的嵌套表头数据
const testColumns = [
  {
    title: '基本信息',
    dataIndex: 'baseInfo',
    width: 200,
    children: [
      {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        width: 100,
      },
    ],
  },
  {
    title: '联系方式',
    dataIndex: 'contactInfo',
    width: 300,
    children: [
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 150,
      },
      {
        title: '电话',
        dataIndex: 'phone',
        width: 150,
      },
    ],
  },
  {
    title: '这是一个非常长的表头标题用来测试对齐问题',
    dataIndex: 'longTitle',
    width: 150,
    children: [
      {
        title: '电话',
        dataIndex: 'phone2',
        width: 150,
      },
    ],
  },
];

// 测试数据
const testData = [
  {
    key: '1',
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    phone: '13800138000',
    phone2: '13800138000',
  },
  {
    key: '2',
    name: '李四',
    age: 30,
    email: 'lisi@example.com',
    phone: '13800138001',
    phone2: '13800138001',
  },
];

const TestNestedHeaders: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>嵌套表头对齐测试</h2>
      <VirtualTable
        columns={testColumns}
        dataSource={testData}
        rowKey="key"
        resizable={true}
      />
    </div>
  );
};

export default TestNestedHeaders;