import React, { useState, useMemo } from 'react';
import type { AggloTreeTableProps, AggregateKeysType } from './index';
import type { VirtualTableColumn } from '../VirtualTable/types';

interface GroupManagerProps {
  groupKeys: string[];
  aggregateKeys: AggregateKeysType | undefined;
  onGroupKeysChange: (keys: string[]) => void;
  onAggregateKeysChange: (keys: AggregateKeysType) => void;
  theme?: any;
  // 从 AggloTreeTable 组件接收 columns 属性
  columns?: VirtualTableColumn[];
  // 控制是否使用高精度求和
  useHighPrecision?: boolean;
  // 数据源，用于验证字段类型
  dataSource?: Array<Record<string, any>>;
}

const GroupManager: React.FC<GroupManagerProps> = ({
  groupKeys = [],
  aggregateKeys = {},
  onGroupKeysChange,
  onAggregateKeysChange,
  theme,
  columns = [],
  useHighPrecision = false,
  dataSource = []
}) => {
  // 从 columns 中提取所有可用字段
  const availableFields = useMemo(() => {
    const fields: string[] = [];
    const extractFields = (cols: VirtualTableColumn[]) => {
      cols.forEach(col => {
        if (col.dataIndex && !fields.includes(col.dataIndex)) {
          fields.push(col.dataIndex);
        }
        // 检查 col 是否有 children 属性
        if ('children' in col && col.children) {
          extractFields(col.children);
        }
      });
    };
    if (columns) {
      extractFields(columns);
    }
    return fields;
  }, [columns]);

  // 检查字段是否为数值类型
  const isNumericField = (field: string): boolean => {
    if (!dataSource || dataSource.length === 0) return true; // 如果没有数据源，默认认为是数值类型
    
    let numericCount = 0;
    let totalCount = 0;
    
    // 检查前几条数据判断字段是否为数值类型
    for (let i = 0; i < Math.min(dataSource.length, 10); i++) {
      const value = dataSource[i][field];
      if (value !== undefined && value !== null) {
        totalCount++;
        // 检查是否为数值类型（number 或可以转换为 number 的字符串）
        if (typeof value === 'number' && !isNaN(value)) {
          numericCount++;
        } else if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
          numericCount++;
        }
      }
    }
    
    // 如果有数据且大部分数据(>50%)是数值类型，则认为该字段是数值类型
    if (totalCount > 0 && numericCount / totalCount > 0.5) {
      return true;
    }
    
    // 如果没有数据或大部分数据不是数值类型，则认为不是数值类型
    return totalCount === 0; // 没有数据时默认返回true
  };

  const handleGroupKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !groupKeys.includes(value)) {
      onGroupKeysChange([...groupKeys, value]);
    }
    e.target.value = ''; // 重置选择
  };

  const handleRemoveGroupKey = (key: string) => {
    onGroupKeysChange(groupKeys.filter(k => k !== key));
  };

  const handleAddKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const currentAddKeys = aggregateKeys?.addkeys || [];
    const currentAddBNKeys = aggregateKeys?.addBNkeys || [];
    
    if (value && !currentAddKeys.includes(value) && !currentAddBNKeys.includes(value)) {
      // 根据 useHighPrecision 决定添加到哪个数组
      if (useHighPrecision) {
        onAggregateKeysChange({
          ...aggregateKeys,
          addBNkeys: [...currentAddBNKeys, value]
        });
      } else {
        onAggregateKeysChange({
          ...aggregateKeys,
          addkeys: [...currentAddKeys, value]
        });
      }
    }
    e.target.value = ''; // 重置选择
  };

  const handleRemoveAddKey = (key: string) => {
    if (useHighPrecision) {
      const currentAddBNKeys = aggregateKeys?.addBNkeys || [];
      onAggregateKeysChange({
        ...aggregateKeys,
        addBNkeys: currentAddBNKeys.filter(k => k !== key)
      });
    } else {
      const currentAddKeys = aggregateKeys?.addkeys || [];
      onAggregateKeysChange({
        ...aggregateKeys,
        addkeys: currentAddKeys.filter(k => k !== key)
      });
    }
  };

  const handleEqualKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const currentEqualKeys = aggregateKeys?.equalKeys || [];
    if (value && !currentEqualKeys.includes(value)) {
      onAggregateKeysChange({
        ...aggregateKeys,
        equalKeys: [...currentEqualKeys, value]
      });
    }
    e.target.value = ''; // 重置选择
  };

  const handleRemoveEqualKey = (key: string) => {
    const currentEqualKeys = aggregateKeys?.equalKeys || [];
    onAggregateKeysChange({
      ...aggregateKeys,
      equalKeys: currentEqualKeys.filter(k => k !== key)
    });
  };

  // 过滤出还未添加的选项，并且只显示数值类型的字段
  const availableGroupKeys = availableFields.filter(field => !groupKeys.includes(field));
  const availableAddKeys = availableFields.filter(field => 
    !aggregateKeys?.addkeys?.includes(field) && 
    !aggregateKeys?.addBNkeys?.includes(field) && 
    !aggregateKeys?.equalKeys?.includes(field) &&  // 添加相等的列不能出现在求和列里
    isNumericField(field)
  );
  const availableEqualKeys = availableFields.filter(field => 
    !aggregateKeys?.equalKeys?.includes(field) &&
    !aggregateKeys?.addkeys?.includes(field) &&    // 添加求和的列不能出现在相等列里
    !aggregateKeys?.addBNkeys?.includes(field)     // 添加高精度求和的列也不能出现在相等列里
  );

  // 根据 useHighPrecision 决定显示哪个数组
  const displayAddKeys = useHighPrecision 
    ? (aggregateKeys?.addBNkeys || []) 
    : (aggregateKeys?.addkeys || []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: theme?.bodyBgColor || '#ffffff',
      border: `1px solid ${theme?.borderColor || '#d9d9d9'}`,
      padding: '8px 12px',
      flexWrap: 'wrap',
      gap: '8px'
    }}>
      <span style={{ fontWeight: 'bold', color: theme?.headerTextColor || '#000000' }}>分组与聚合:</span>
      
      {/* Group Keys 管理 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
        {groupKeys.map((key) => (
          <div 
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '2px 8px',
              backgroundColor: theme?.primaryColor || '#1890ff',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px'
            }}
          >
            <span>{key}</span>
            <span 
              onClick={() => handleRemoveGroupKey(key)}
              style={{ 
                marginLeft: '6px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ×
            </span>
          </div>
        ))}
        <select
          onChange={handleGroupKeyChange}
          style={{
            minWidth: '80px',
            padding: '2px 4px',
            border: `1px solid ${theme?.borderColor || '#d9d9d9'}`
          }}
        >
          <option value="">添加分组</option>
          {availableGroupKeys.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>

      {/* Add Keys (根据 useHighPrecision 决定显示普通求和还是高精度求和) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
        {displayAddKeys.map((key) => (
          <div 
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '2px 8px',
              backgroundColor: useHighPrecision ? '#722ed1' : '#52c41a',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px'
            }}
          >
            <span>{key}</span>
            <span 
              onClick={() => handleRemoveAddKey(key)}
              style={{ 
                marginLeft: '6px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ×
            </span>
          </div>
        ))}
        <select
          onChange={handleAddKeyChange}
          style={{
            minWidth: '80px',
            padding: '2px 4px',
            border: `1px solid ${theme?.borderColor || '#d9d9d9'}`
          }}
        >
          <option value="">{useHighPrecision ? '添加高精度' : '添加求和'}</option>
          {availableAddKeys.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>

      {/* Equal Keys */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
        {(aggregateKeys?.equalKeys || []).map((key) => (
          <div 
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '2px 8px',
              backgroundColor: '#fa8c16',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px'
            }}
          >
            <span>{key}</span>
            <span 
              onClick={() => handleRemoveEqualKey(key)}
              style={{ 
                marginLeft: '6px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ×
            </span>
          </div>
        ))}
        <select
          onChange={handleEqualKeyChange}
          style={{
            minWidth: '80px',
            padding: '2px 4px',
            border: `1px solid ${theme?.borderColor || '#d9d9d9'}`
          }}
        >
          <option value="">添加相等</option>
          {availableEqualKeys.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default GroupManager;