import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

/**
 * Props for the StickyHeader component
 */
export interface StickyHeaderProps {
  /** Table reference */
  tableRef: React.RefObject<HTMLDivElement>;
  /** Box shadow */
  boxShadow?: string;
  /** Z-index */
  zIndex?: number;
  /** Children to render */
  children: ReactNode;
}

/**
 * A standalone sticky header component that can make any header sticky when scrolling
 */
const StickyHeader: FC<StickyHeaderProps> = (props) => {
  const {
    tableRef,
    boxShadow = '0 2px 8px rgba(0,0,0,0.15)',
    zIndex = 1000,
    children
  } = props;

  const [sticky, setSticky] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [tableFixedHeight, setTableFixedHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [tableSize, setTableSize] = useState<{ left?: number; width?: number }>({});
  const positionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // 计算页面上固定元素的高度
  const calculateFixedHeight = () => {
    // 获取所有可能的固定元素
    const allElements = document.querySelectorAll('body *');
    let fixedElements: HTMLElement[] = [];

    // 遍历所有元素，找出固定在顶部的元素
    allElements.forEach(element => {
      if (!(element instanceof HTMLElement)) return;

      const style = window.getComputedStyle(element);
      const position = style.position;
      const top = style.top;
      const zIndex = parseInt(style.zIndex || '0');

      // 检查是否是固定或粘性定位
      const isFixedOrSticky = position === 'fixed' || position === 'sticky';

      // 检查是否在顶部（top 为 0 或接近 0）
      const isAtTop = top === '0px' || top === '0' || (parseFloat(top) <= 1 && parseFloat(top) >= 0);

      // 如果元素固定在顶部，添加到列表中
      if (isFixedOrSticky && isAtTop) {
        fixedElements.push(element);
      }
    });

    // 按照 z-index 排序，确保按正确的层级顺序计算高度
    fixedElements.sort((a, b) => {
      const aZIndex = parseInt(window.getComputedStyle(a).zIndex || '0');
      const bZIndex = parseInt(window.getComputedStyle(b).zIndex || '0');
      return aZIndex - bZIndex;
    });

    // 计算总高度
    let totalHeight = 0;
    fixedElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      totalHeight += rect.height;
    });

    return totalHeight;
  };

  // 设置表头高度
  const updateHeaderHeight = () => {
    const headerSize = headerRef?.current?.getBoundingClientRect();
    setHeaderHeight(headerSize?.height || 0);
  };

  // 设置表头是否为粘滞状态
  const bindHandleScroll = () => {
    const positionTypes = positionRef?.current?.getBoundingClientRect();
    const tableTypes = tableRef?.current?.getBoundingClientRect();

    // 当表头滚动到固定元素下方且表格底部仍在视口内时，激活粘滞状态
    if (positionTypes?.top !== undefined && positionTypes?.top <= tableFixedHeight &&
      tableTypes?.bottom !== undefined && tableTypes?.bottom > tableFixedHeight && !sticky) {
      setSticky(true);
      // 粘滞状态激活时更新headerHeight
      updateHeaderHeight();
    }
    // 当表头回到原始位置以上或表格完全滚出视口时，取消粘滞状态
    else if (((positionTypes?.top !== undefined && positionTypes?.top >= tableFixedHeight) ||
      (tableTypes?.bottom !== undefined && tableTypes?.bottom <= tableFixedHeight)) && sticky) {
      setSticky(false);
    }
  };

  useEffect(() => {
    // 组件挂载时计算固定元素高度
    setTableFixedHeight(calculateFixedHeight());

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

  // 设置表头粘滞状态的左右滚动
  const HandleScrollLeft = () => {
    const positionTypes = positionRef?.current?.getBoundingClientRect();
    setScrollLeft(positionTypes?.left || 0);
  };

  // 设置表头宽度及左右滚动起始位置
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

  return (
    <>
      <div
        ref={positionRef}
        style={
          sticky
            ? { height: headerHeight, }
            : {}
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
              zIndex,
              overflow: 'hidden',
              boxShadow,
            }
            : {}
        }
      >
        <div
          ref={headerRef}
          style={
            sticky
              ? {
                position: 'relative',
                left: scrollLeft - (tableSize.left || 0),  // 使用表格滚动位置来调整表头位置
                minWidth: 'max-content',
              }
              : {}
          }
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default StickyHeader;