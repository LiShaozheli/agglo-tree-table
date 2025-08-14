import React, { FC, memo, useEffect, useRef, useState } from 'react';

/**
 * Props for the TableHeader component
 * TableHeader 组件的 Props
 */
export interface TableHeaderProps {
  /** Table columns */
  /** 表格列 */
  columns: Record<string, any>;
  /** Header row height */
  /** 表头行高度 */
  headerRowHeight?: number;
  /** Fixed table height */
  /** 固定表格高度 */
  tableFixedHeight?: number;
  /** Table reference */
  /** 表格引用 */
  tableRef: React.RefObject<HTMLDivElement>;
  /** Column widths */
  /** 列宽度 */
  columnWidth: Record<string, number>;
}

/**
 * A table header component with sticky functionality.
 * 一个具有粘性功能的表头组件。
 * 
 * This component renders table headers and makes them sticky when scrolling.
 * 该组件渲染表格头部，并在滚动时使其粘性固定。
 */
const TableHeader: FC<TableHeaderProps> = props => {
  const { columns, headerRowHeight = 40, tableFixedHeight = 48, tableRef, columnWidth } = props;
  const [headerLayer, setHeaderLayer] = useState(0);
  const [sticky, setSticky] = useState(false);
  const [tableHeaderHeight, setTableHeaderHeight] = useState(0);
  const [tableSize, setTableSize] = useState<Record<string, any>>({});
  const [scrollLeft, setScrollLeft] = useState(0);

  const tableHeaderRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);

  // 设置表头高度
  // Set table header height
  useEffect(() => {
    const tableHeaderSize = tableHeaderRef?.current?.getBoundingClientRect();
    setTableHeaderHeight(tableHeaderSize?.height || 0);
  }, [tableHeaderRef, sticky]);

  // 设置表头是否为粘滞状态
  // Set whether the header is sticky
  const bindHandleScroll = () => {
    const positionTypes = positionRef?.current?.getBoundingClientRect();

    if (positionTypes?.top !== undefined && positionTypes?.top < tableFixedHeight && !sticky) {
      setSticky(true);
    } else if (positionTypes?.top !== undefined && positionTypes?.top > tableFixedHeight && sticky) {
      setSticky(false);
    }
  };

  // 设置表头粘滞状态的左右滚动
  // Set left/right scrolling for sticky header
  const HandleScrollLeft = () => {
    const positionTypes = positionRef?.current?.getBoundingClientRect();
    setScrollLeft(positionTypes?.left || 0);
  };

  useEffect(() => {
    if (sticky) {
      tableRef?.current?.addEventListener('scroll', HandleScrollLeft);
    } else {
      tableRef?.current?.removeEventListener('scroll', HandleScrollLeft);
    }
    window.addEventListener('scroll', bindHandleScroll);

    return () => {
      tableRef?.current?.removeEventListener('scroll', HandleScrollLeft);
      window.removeEventListener('scroll', bindHandleScroll);
    };
  }, [positionRef, sticky, tableRef]);

  // 设置表头宽度及左右滚动起始位置
  // Set header width and scroll start position
  const bindWindowResize = () => {
    const tablesize = tableRef?.current?.getBoundingClientRect();
    if (tablesize) {
      setTableSize(tablesize);
    }
  };

  useEffect(() => {
    bindWindowResize();
    HandleScrollLeft();
    window.addEventListener('resize', bindWindowResize);
    
    return () => {
      window.removeEventListener('resize', bindWindowResize);
    };
  }, [sticky, tableRef]);

  const renderHeader = (oldColumns: Record<string, any>, layer = 0) => {
    if (layer > headerLayer) setHeaderLayer(layer);
    return (
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f0f0f0',
          color: '#333',
        }}
      >
        {oldColumns.map((column: any) => (
          <div
            key={column.key || column.dataIndex}
            style={{
              borderRight: column.children?.length > 0 ? '1px solid #ccc' : '0px',
            }}
          >
            <div
              style={{
                width: columnWidth[column.dataIndex] || column.width,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height:
                  column.children?.length > 0
                    ? headerRowHeight
                    : (headerLayer - layer + 1) * headerRowHeight,
                ...(column.headerStyle || {}),
              }}
            >
              {column.title}
            </div>
            {column.children?.length > 0 && renderHeader(column.children, layer + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        ref={positionRef}
        style={
          sticky
            ? { height: tableHeaderHeight, backgroundColor: '#f0f0f0' }
            : { backgroundColor: '#f0f0f0' }
        }
      />
      <div
        style={
          sticky
            ? {
                position: 'fixed',
                top: tableFixedHeight,
                left: tableSize.left,
                width: tableSize.width,
                zIndex: 10,
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
              }
            : {}
        }
      >
        <div
          ref={tableHeaderRef}
          style={
            sticky
              ? {
                  position: 'relative',
                  left: scrollLeft - (tableSize.left || 0),
                  minWidth: 'max-content',
                }
              : {}
          }
        >
          {renderHeader(columns)}
        </div>
      </div>
    </>
  );
};

export default memo(TableHeader);