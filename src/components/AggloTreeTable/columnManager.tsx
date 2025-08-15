import React, { useState, useEffect, useRef } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import type { TableTheme } from '../VirtualTable/themes';

export interface ColumnManagerProps {
  /** Table columns */
  columns: any[];
  /** Visible columns */
  visibleColumns: string[];
  /** Callback when column visibility changes */
  onColumnVisibilityChange: (visibleColumns: string[]) => void;
  /** Table theme */
  theme?: TableTheme;
  /** Position of the column manager */
  position?: 'left' | 'right';
}

// 获取所有列（包括嵌套子列）
const extractAllColumns = (cols: any[]) => {
  const allColumns: any[] = [];
  const extract = (columns: any[]) => {
    columns.forEach(column => {
      if (column.children?.length > 0) {
        extract(column.children);
      } else {
        allColumns.push(column);
      }
    });
  };
  extract(cols);
  return allColumns;
};

const ColumnManager: React.FC<ColumnManagerProps> = ({
  columns,
  visibleColumns,
  onColumnVisibilityChange,
  theme,
  position = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const columnManagerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭列管理器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnManagerRef.current && !columnManagerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 列管理图标组件 - 使用 antd 的 SettingOutlined 图标
  const ColumnManagerIcon = () => (
    <SettingOutlined style={{ color: theme?.primaryColor || '#007bff', fontSize: '16px' }} />
  );

  // 切换列可见性
  const toggleColumnVisibility = (dataIndex: string) => {
    const newVisibleColumns = visibleColumns.includes(dataIndex)
      ? visibleColumns.filter(key => key !== dataIndex)
      : [...visibleColumns, dataIndex];
    
    onColumnVisibilityChange(newVisibleColumns);
  };

  // 切换所有列可见性
  const toggleAllColumns = (isVisible: boolean) => {
    if (isVisible) {
      // 显示所有列
      const allColumnKeys: string[] = [];
      const extractColumnKeys = (cols: any[]) => {
        cols.forEach(col => {
          if (col.children?.length > 0) {
            extractColumnKeys(col.children);
          } else if (col.dataIndex) {
            allColumnKeys.push(col.dataIndex);
          }
        });
      };
      extractColumnKeys(columns);
      onColumnVisibilityChange(allColumnKeys);
    } else {
      // 隐藏所有列（完全清空）
      onColumnVisibilityChange([]);
    }
  };

  const allColumns = extractAllColumns(columns);

  return (
    <div 
      style={{ 
        position: 'relative',
        display: 'flex',
        height: '100%',
        boxSizing: 'border-box',
      }} 
      ref={columnManagerRef}
    >
      {/* 展开/收起按钮 */}
      <div
        ref={toggleButtonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          background: theme?.headerBgColor || '#ffffff',
          border: `1px solid ${theme?.borderColor || '#d9d9d9'}`,
          borderTop: theme?.showRowBorders ? `1px solid ${theme?.rowBorderColor || theme?.borderColor || '#d9d9d9'}` : 'none',
          borderBottom: theme?.showRowBorders ? `1px solid ${theme?.rowBorderColor || theme?.borderColor || '#d9d9d9'}` : 'none',
          borderLeft: position === 'left' ? undefined : 'none',
          borderRight: position === 'right' ? undefined : 'none',
          padding: '8px 4px',
          color: theme?.headerTextColor || theme?.bodyTextColor || '#000000',
          cursor: 'pointer',
          transition: 'all 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          width: '24px',
          writingMode: 'vertical-lr',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          userSelect: 'none',
          backgroundColor: theme?.headerBgColor || '#f0f0f0', // 使用更明显的背景色
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme?.rowHoverBgColor || '#e0e0e0'; // 使用更明显的悬停色
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme?.headerBgColor || '#f0f0f0'; // 恢复到背景色而不是白色
        }}
        title={isOpen ? "收起列管理" : "展开列管理"}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          transform: 'rotate(180deg)',
        }}>
          <ColumnManagerIcon />
          <span style={{ marginTop: '8px' }}>列管理</span>
        </div>
      </div>
      
      {/* 列管理面板 */}
      {isOpen && (
        <div
          style={{
            backgroundColor: theme?.bodyBgColor || '#ffffff',
            border: `1px solid ${theme?.borderColor || '#d9d9d9'}`,
            borderLeft: position === 'left' ? 
              (theme?.showColumnBorders ? `1px solid ${theme?.columnBorderColor || theme?.borderColor || '#d9d9d9'}` : undefined) : 
              undefined,
            borderRight: position === 'right' ? 
              (theme?.showColumnBorders ? `1px solid ${theme?.columnBorderColor || theme?.borderColor || '#d9d9d9'}` : undefined) : 
              undefined,
            borderTop: 'none',
            borderBottom: 'none',
            zIndex: 1000,
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'absolute',
            top: 0,
            [position === 'left' ? 'left' : 'right']: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* 全选/取消全选 */}
          <div
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '13px',
              borderBottom: `1px solid ${theme?.borderColor || '#d9d9d9'}`,
              color: theme?.headerTextColor || theme?.bodyTextColor || '#000000',
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleAllColumns(visibleColumns.length !== allColumns.length);
            }}
          >
            <input
              type="checkbox"
              checked={visibleColumns.length === allColumns.length}
              onChange={(e) => {
                e.stopPropagation();
                toggleAllColumns(e.target.checked);
              }}
              style={{
                marginRight: '8px',
              }}
            />
            <span>全选/取消全选</span>
          </div>
          
          {/* 列列表 */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            padding: '4px 0'
          }}>
            {allColumns.map((column, index) => (
              <div
                key={column.dataIndex}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '13px',
                  color: theme?.bodyTextColor || '#000000',
                  borderBottom: theme?.showRowBorders && index < allColumns.length - 1 ? 
                    `1px solid ${theme?.rowBorderColor || theme?.borderColor || '#d9d9d9'}` : 
                    undefined,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme?.rowHoverBgColor || '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column.dataIndex)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleColumnVisibility(column.dataIndex);
                  }}
                  style={{
                    marginRight: '8px',
                  }}
                />
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColumnVisibility(column.dataIndex);
                  }}
                >
                  {column.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnManager;