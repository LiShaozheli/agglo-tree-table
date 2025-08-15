import React, { useState, useEffect, useRef } from 'react';
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
  /** Whether the column manager should be fixed and not scroll with the table */
  fixedPosition?: boolean;
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
  fixedPosition = false,
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

  // 列管理图标组件 - 使用 aggrid 风格的图标
  const ColumnManagerIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      style={{
        verticalAlign: 'middle',
      }}
    >
      <path
        fill={theme?.primaryColor || '#007bff'}
        d="M2 2h12v2H2V2zm0 4h12v2H2V6zm0 4h12v2H2v-2zm0 4h12v2H2v-2z"
      />
    </svg>
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
        position: fixedPosition ? 'absolute' : 'relative',
        display: 'flex',
        height: '100%',
        [position === 'left' ? 'left' : 'right']: fixedPosition ? 0 : 'auto',
        top: 0,
        zIndex: fixedPosition ? 1001 : 'auto',
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
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme?.rowHoverBgColor || '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme?.headerBgColor || '#ffffff';
        }}
        title={isOpen ? "收起列管理" : "展开列管理"}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          transform: 'rotate(180deg)'
        }}>
          <ColumnManagerIcon />
          <span style={{ marginLeft: '4px' }}>列管理</span>
        </div>
      </div>
      
      {/* 列管理面板 */}
      {isOpen && (
        <div
          style={{
            backgroundColor: theme?.bodyBgColor || '#ffffff',
            border: `1px solid ${theme?.borderColor || '#d9d9d9'}`,
            borderLeft: position === 'left' ? undefined : 'none',
            borderRight: position === 'right' ? undefined : 'none',
            zIndex: 1000,
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'absolute',
            top: 0,
            [position === 'left' ? 'left' : 'right']: '100%',
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
            {allColumns.map((column) => (
              <div
                key={column.dataIndex}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '13px',
                  color: theme?.bodyTextColor || '#000000',
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