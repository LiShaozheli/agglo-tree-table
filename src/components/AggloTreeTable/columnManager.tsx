import React, { useState, useEffect, useRef } from 'react';
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

/**
 * 列信息类型定义
 */
export type ColumnInfo = {
  /** 列标题 */
  title: string;
  /** 列数据字段 */
  dataIndex: string;
  /** 列是否可见 */
  visible?: boolean;
  /** 子列 */
  children?: ColumnInfo[];
  /** 其他属性 */
  [key: string]: any;
};

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

// 扁平化列结构，用于树状显示
const flattenColumns = (columns: any[], depth = 0, parentPath: string[] = []): any[] => {
  let result: any[] = [];
  columns.forEach((column, index) => {
    const path = [...parentPath, String(index)].join('-');
    result.push({
      ...column,
      depth,
      path,
      originalIndex: index,
    });
    
    if (column.children?.length > 0) {
      result = result.concat(flattenColumns(column.children, depth + 1, [...parentPath, String(index)]));
    }
  });
  return result;
};

// 从扁平化结构重建嵌套结构
const rebuildNestedColumnsFromFlattened = (flattenedColumns: any[], originalColumns: any[]): any[] => {
  // 创建一个映射来存储所有列的副本
  const columnMap: Record<string, any> = {};
  
  // 创建所有列的副本
  flattenedColumns.forEach(col => {
    columnMap[col.path] = { ...col };
  });
  
  // 清除所有列的children属性，准备重新构建
  Object.values(columnMap).forEach(col => {
    delete col.children;
  });
  
  // 重新构建嵌套结构
  const rootColumns: any[] = [];
  
  flattenedColumns.forEach(col => {
    const pathParts = col.path.split('-');
    
    if (pathParts.length === 1) {
      // 根级别的列
      rootColumns.push(columnMap[col.path]);
    } else {
      // 子级别的列
      const parentPath = pathParts.slice(0, -1).join('-');
      const parentColumn = columnMap[parentPath];
      
      if (parentColumn) {
        if (!parentColumn.children) {
          parentColumn.children = [];
        }
        parentColumn.children.push(columnMap[col.path]);
      }
    }
  });
  
  return rootColumns;
};

const ColumnManager: React.FC<ColumnManagerProps> = ({
  columns,
  onColumnChange,
  theme,
  position = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
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
  
  // 扁平化的列用于树状显示
  const flattenedColumns = flattenColumns(columns);
  
  // 处理拖拽开始事件
  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  // 处理列重新排序（支持改变父子级关系）
  const handleDragOver = (event: any) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // 这里可以实现更复杂的拖拽逻辑，例如改变父子级关系
    // 当前实现保持原有的列交换逻辑
  };

  // 处理拖拽结束事件
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    // 添加检查确保 over 对象存在
    if (over && active.id !== over.id) {
      // 重新排列列的顺序
      const activeIndex = flattenedColumns.findIndex(col => col.path === active.id);
      const overIndex = flattenedColumns.findIndex(col => col.path === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        // 重新排序扁平化的列
        const newFlattenedColumns = [...flattenedColumns];
        const [movedItem] = newFlattenedColumns.splice(activeIndex, 1);
        newFlattenedColumns.splice(overIndex, 0, movedItem);
        
        // 重建嵌套结构
        const newColumns = rebuildNestedColumnsFromFlattened(newFlattenedColumns, columns);
        onColumnChange(newColumns);
      }
    }
  };

  // 切换列可见性
  const toggleColumnVisibility = (dataIndex: string) => {
    // 创建列的深拷贝以避免直接修改原始数据
    const newColumns = JSON.parse(JSON.stringify(columns));
    
    // 递归查找并更新列的可见性
    const updateColumnVisibility = (cols: any[]) => {
      cols.forEach(col => {
        if (col.children?.length > 0) {
          updateColumnVisibility(col.children);
        }
        // 无论是否有子列，只要 dataIndex 匹配就切换可见性
        if (col.dataIndex === dataIndex) {
          // 正确切换 visible 属性
          // 如果 visible 属性为 undefined，默认是可见的 (true)
          // 如果 visible 属性为 true，切换为 false (隐藏)
          // 如果 visible 属性为 false，切换为 true (显示)
          col.visible = !(col.visible !== false);
        }
      });
    };
    
    updateColumnVisibility(newColumns);
    onColumnChange(newColumns);
  };

  // 切换父级列及其所有子列的可见性
  const toggleParentColumnVisibility = (columnPath: string) => {
    // 创建列的深拷贝以避免直接修改原始数据
    const newColumns = JSON.parse(JSON.stringify(columns));
    
    // 根据路径找到对应的列
    const pathParts = columnPath.split('-').map(Number);
    let targetColumn: any = newColumns[pathParts[0]];
    
    for (let i = 1; i < pathParts.length; i++) {
      if (targetColumn && targetColumn.children) {
        targetColumn = targetColumn.children[pathParts[i]];
      } else {
        targetColumn = null;
        break;
      }
    }
    
    if (targetColumn) {
      // 计算新的可见性状态
      const newVisibleState = !(targetColumn.visible !== false);
      
      // 设置目标列的新可见性状态
      targetColumn.visible = newVisibleState;
      
      // 如果有子列，也一并设置它们的可见性状态
      const updateChildrenVisibility = (cols: any[]) => {
        cols.forEach(col => {
          col.visible = newVisibleState;
          if (col.children?.length > 0) {
            updateChildrenVisibility(col.children);
          }
        });
      };
      
      if (targetColumn.children?.length > 0) {
        updateChildrenVisibility(targetColumn.children);
      }
      
      onColumnChange(newColumns);
    }
  };

  // 切换所有列可见性
  const toggleAllColumns = (isVisible: boolean) => {
    // 创建列的深拷贝以避免直接修改原始数据
    const newColumns = JSON.parse(JSON.stringify(columns));
    
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
            width: '250px', // 增加宽度以适应树状结构
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
          
          {/* 列列表 - 树状结构 */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={flattenedColumns.map(col => col.path)}
              strategy={verticalListSortingStrategy}
            >
              <div style={{ 
                flex: 1, 
                overflowY: 'auto',
                padding: '4px 0'
              }}>
                {flattenedColumns.map((column) => (
                  <SortableTreeItem
                    key={column.path}
                    column={column}
                    theme={theme}
                    toggleColumnVisibility={toggleColumnVisibility}
                    toggleParentColumnVisibility={toggleParentColumnVisibility}
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

// 树状结构的可排序项组件
const SortableTreeItem = ({ 
  column,
  theme,
  toggleColumnVisibility,
  toggleParentColumnVisibility
}: {
  column: any;
  theme?: TableTheme;
  toggleColumnVisibility: (dataIndex: string) => void;
  toggleParentColumnVisibility: (columnPath: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.path });

  const style = {
    transform: CSS.Transform.toString(transform),
    padding: '6px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: theme?.bodyTextColor || '#000000',
    backgroundColor: isDragging ? (theme?.rowHoverBgColor || '#f5f5f5') : 'transparent',
    zIndex: isDragging ? 1 : 'auto',
    position: 'relative' as const,
    opacity: isDragging ? 0.5 : 1,
    paddingLeft: `${12 + column.depth * 20}px`, // 根据深度增加左边距以显示层级关系
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
      {column.children?.length > 0 ? (
        // 父级列显示文件夹图标
        <span style={{ marginRight: '8px' }}>📁</span>
      ) : (
        // 叶子列显示文件图标
        <span style={{ marginRight: '8px' }}>📄</span>
      )}
      <input
        type="checkbox"
        checked={column.visible !== false}
        onChange={(e) => {
          e.stopPropagation();
          if (column.dataIndex) {
            toggleColumnVisibility(column.dataIndex);
          } else {
            // 对于没有 dataIndex 的父级列，切换整个分支的可见性
            toggleParentColumnVisibility(column.path);
          }
        }}
        style={{
          marginRight: '8px',
        }}
      />
      <span 
        onClick={(e) => {
          e.stopPropagation();
          if (column.dataIndex) {
            toggleColumnVisibility(column.dataIndex);
          } else {
            // 对于没有 dataIndex 的父级列，切换整个分支的可见性
            toggleParentColumnVisibility(column.path);
          }
        }}
      >
        {column.title}
      </span>
    </div>
  );
};

export default ColumnManager;