import React, { useState, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import { SettingOutlined, HolderOutlined } from '@ant-design/icons';
import type { TableTheme } from '../VirtualTable/themes';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface ColumnManagerProps {
  /** Table columns */
  columns: any[];
  /** Callback when column configuration changes */
  onColumnChange: (columns: any[]) => void;
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
  onColumnChange,
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 获取所有叶子节点列
  const leafColumns = extractAllColumns(columns);
  
  // 处理拖拽结束事件
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // 创建列的深拷贝以避免直接修改原始数据
      const newColumns = [...columns];
      
      // 获取所有叶子节点列及其在数组中的路径
      const getAllLeafColumnsWithPaths = (cols: any[], parentPath: number[] = []): Array<{column: any, path: number[]}> => {
        let result: Array<{column: any, path: number[]}> = [];
        cols.forEach((col, index) => {
          const currentPath = [...parentPath, index];
          if (col.children?.length > 0) {
            result = result.concat(getAllLeafColumnsWithPaths(col.children, currentPath));
          } else {
            result.push({ column: col, path: currentPath });
          }
        });
        return result;
      };
      
      const leafColumnsWithPaths = getAllLeafColumnsWithPaths(newColumns);
      
      // 找到要交换的两列的路径
      const activeColumnPath = leafColumnsWithPaths.find(item => item.column.dataIndex === active.id)?.path;
      const overColumnPath = leafColumnsWithPaths.find(item => item.column.dataIndex === over.id)?.path;
      
      if (activeColumnPath && overColumnPath) {
        // 根据路径找到列在嵌套结构中的位置并交换它们
        const moveColumn = (cols: any[], fromPath: number[], toPath: number[]) => {
          // 获取源列
          let sourceContainer = cols;
          for (let i = 0; i < fromPath.length - 1; i++) {
            sourceContainer = sourceContainer[fromPath[i]].children;
          }
          const sourceColumn = sourceContainer[fromPath[fromPath.length - 1]];
          
          // 获取目标列
          let targetContainer = cols;
          for (let i = 0; i < toPath.length - 1; i++) {
            targetContainer = targetContainer[toPath[i]].children;
          }
          const targetColumn = targetContainer[toPath[toPath.length - 1]];
          
          // 交换列
          sourceContainer[fromPath[fromPath.length - 1]] = targetColumn;
          targetContainer[toPath[toPath.length - 1]] = sourceColumn;
        };
        
        moveColumn(newColumns, activeColumnPath, overColumnPath);
        onColumnChange(newColumns);
      }
    }
  };

  // 切换列可见性
  const toggleColumnVisibility = (dataIndex: string) => {
    // 创建列的深拷贝以避免直接修改原始数据
    const newColumns = [...columns];
    
    // 递归查找并更新列的可见性
    const updateColumnVisibility = (cols: any[]) => {
      cols.forEach(col => {
        if (col.children?.length > 0) {
          updateColumnVisibility(col.children);
        } else if (col.dataIndex === dataIndex) {
          // 切换 visible 属性
          col.visible = !col.visible;
        }
      });
    };
    
    updateColumnVisibility(newColumns);
    onColumnChange(newColumns);
  };

  // 切换所有列可见性
  const toggleAllColumns = (isVisible: boolean) => {
    // 创建列的深拷贝以避免直接修改原始数据
    const newColumns = [...columns];
    
    // 递归更新所有列的可见性
    const updateAllColumnsVisibility = (cols: any[]) => {
      cols.forEach(col => {
        if (col.children?.length > 0) {
          updateAllColumnsVisibility(col.children);
        } else {
          col.visible = isVisible;
        }
      });
    };
    
    updateAllColumnsVisibility(newColumns);
    onColumnChange(newColumns);
  };

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
            zIndex: 5,  // 降低 z-index 值，避免遮挡 dumi 菜单栏
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
              // 检查是否所有列都可见
              const allVisible = leafColumns.every(col => col.visible !== false);
              toggleAllColumns(!allVisible);
            }}
          >
            <input
              type="checkbox"
              checked={leafColumns.every(col => col.visible !== false)}
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={leafColumns.map(col => col.dataIndex)}
              strategy={verticalListSortingStrategy}
            >
              <div style={{ 
                flex: 1, 
                overflowY: 'auto',
                padding: '4px 0'
              }}>
                {leafColumns.map((column, index) => (
                  <SortableColumnItem
                    key={column.dataIndex}
                    column={column}
                    index={index}
                    allColumns={leafColumns}
                    theme={theme}
                    toggleColumnVisibility={toggleColumnVisibility}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

const SortableColumnItem = ({ 
  column, 
  index, 
  allColumns, 
  theme, 
  toggleColumnVisibility 
}: {
  column: any;
  index: number;
  allColumns: any[];
  theme?: TableTheme;
  toggleColumnVisibility: (dataIndex: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.dataIndex });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '6px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: theme?.bodyTextColor || '#000000',
    borderBottom: theme?.showRowBorders && index < allColumns.length - 1 ? 
      `1px solid ${theme?.rowBorderColor || theme?.borderColor || '#d9d9d9'}` : 
      undefined,
    backgroundColor: isDragging ? (theme?.rowHoverBgColor || '#f5f5f5') : 'transparent',
    zIndex: isDragging ? 1 : 'auto',
    position: 'relative' as const,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.backgroundColor = theme?.rowHoverBgColor || '#f5f5f5';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div 
        {...listeners}
        style={{
          marginRight: '8px',
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '20px',
          height: '16px',
        }}
      >
        <HolderOutlined style={{ color: theme?.bodyTextColor || '#666' }} />
      </div>
      <input
        type="checkbox"
        checked={column.visible !== false}
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
  );
};

export default ColumnManager;