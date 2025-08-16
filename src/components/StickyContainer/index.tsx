import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

/**
 * 粘滞组件属性接口
 */
export interface StickyContainerProps {
  /** 
   * 容器引用 - 用于同步水平滚动和获取容器位置信息
   * 该引用应该指向需要监听滚动事件的容器DOM元素
   * 组件将通过此引用来:
   * 1. 监听容器的滚动事件以同步水平位置
   * 2. 获取容器的位置和尺寸信息用于固定定位计算
   */
  containerRef: React.RefObject<HTMLDivElement>;
  /** 
   * 阴影效果 - 粘滞状态下组件的阴影样式
   * @default '0 2px 8px rgba(0,0,0,0.15)'
   */
  boxShadow?: string;
  /** 
   * 层级 - 粘滞状态下组件的z-index值
   * @default 1000
   */
  zIndex?: number;
  /** 
   * 子元素 - 需要应用粘滞效果的内容
   */
  children: ReactNode;
}

/**
 * 通用粘滞容器组件
 * 
 * 该组件可以将任意内容在滚动时固定在页面顶部，常用于表头、导航栏等需要始终可见的场景。
 * 组件会自动检测页面上已存在的固定元素，并将自身定位在这些固定元素的下方。
 * 同时支持水平滚动同步，确保粘滞状态下的内容与容器内容保持水平对齐。
 */
const StickyContainer: FC<StickyContainerProps> = (props) => {
  const {
    containerRef,
    boxShadow = '0 2px 8px rgba(0,0,0,0.15)',
    zIndex = 1000,
    children
  } = props;

  const [isSticky, setIsSticky] = useState(false);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const [fixedElementsHeight, setFixedElementsHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerBounds, setContainerBounds] = useState<{ left?: number; width?: number }>({});
  const positionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 计算页面上固定元素的高度
  const calculateFixedElementsHeight = () => {
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

  // 设置内容高度
  const updateContentHeight = () => {
    const contentSize = contentRef?.current?.getBoundingClientRect();
    setContentHeight(contentSize?.height || 0);
  };

  // 设置是否为粘滞状态
  const handleScroll = () => {
    const positionElement = positionRef?.current?.getBoundingClientRect();
    const containerElement = containerRef?.current?.getBoundingClientRect();

    // 当内容滚动到固定元素下方且容器底部仍在视口内时，激活粘滞状态
    if (positionElement?.top !== undefined && positionElement?.top <= fixedElementsHeight &&
      containerElement?.bottom !== undefined && containerElement?.bottom > fixedElementsHeight && !isSticky) {
      setIsSticky(true);
      // 粘滞状态激活时更新contentHeight
      updateContentHeight();
    }
    // 当内容回到原始位置以上或容器完全滚出视口时，取消粘滞状态
    else if (((positionElement?.top !== undefined && positionElement?.top >= fixedElementsHeight) ||
      (containerElement?.bottom !== undefined && containerElement?.bottom <= fixedElementsHeight)) && isSticky) {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    // 组件挂载时计算固定元素高度
    setFixedElementsHeight(calculateFixedElementsHeight());

    if (isSticky) {
      containerRef?.current?.addEventListener('scroll', handleContainerScroll);
    } else {
      containerRef?.current?.removeEventListener('scroll', handleContainerScroll);
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      containerRef?.current?.removeEventListener('scroll', handleContainerScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [positionRef, isSticky, containerRef]);

  // 设置内容粘滞状态的左右滚动
  const handleContainerScroll = () => {
    const positionElement = positionRef?.current?.getBoundingClientRect();
    setHorizontalOffset(positionElement?.left || 0);
  };

  // 设置容器宽度及左右滚动起始位置
  const updateContainerBounds = () => {
    const containerSize = containerRef?.current?.getBoundingClientRect();
    if (containerSize) {
      setContainerBounds(containerSize);
    }
  };

  useEffect(() => {
    updateContainerBounds();
    handleContainerScroll();
    window.addEventListener('resize', updateContainerBounds);

    return () => {
      window.removeEventListener('resize', updateContainerBounds);
    };
  }, [isSticky, containerRef]);

  return (
    <>
      <div
        ref={positionRef}
        style={
          isSticky
            ? { height: contentHeight, }
            : {}
        }
      />
      <div
        style={
          isSticky
            ? {
              position: 'fixed',
              top: fixedElementsHeight,
              left: containerBounds.left,
              width: containerBounds.width,
              zIndex,
              overflow: 'hidden',
              boxShadow,
            }
            : {}
        }
      >
        <div
          ref={contentRef}
          style={
            isSticky
              ? {
                position: 'relative',
                left: horizontalOffset - (containerBounds.left || 0),  // 使用容器滚动位置来调整内容位置
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

export default StickyContainer;