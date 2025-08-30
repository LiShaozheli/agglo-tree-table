/**
 * Calculate the height of the fixed element with the highest z-index at the top of the page
 * 计算页面顶部具有最高 z-index 的固定元素的高度
 * 
 * This function identifies all elements with position: fixed or position: sticky 
 * that are positioned at the top of the page (top: 0), finds the one with the highest z-index,
 * and returns its height.
 * 该函数识别所有 position: fixed 或 position: sticky 且位于页面顶部 (top: 0) 的元素，
 * 找到其中 z-index 值最大的元素，并返回其高度。
 * 
 * @param containerRef - Optional container reference to exclude internal elements
 * @returns The height of the fixed element with the highest z-index at the top of the page
 * @returns 页面顶部具有最高 z-index 的固定元素的高度
 */
export const calculateFixedElementsHeight = (containerRef?: React.RefObject<HTMLElement>): number => {
  // 获取所有可能的固定元素
  const allElements = document.querySelectorAll('body *');
  const fixedElements: HTMLElement[] = [];

  // 遍历所有元素，找出固定在顶部的元素
  allElements.forEach(element => {
    if (!(element instanceof HTMLElement)) return;

    // 如果提供了容器引用，且元素是容器的子元素，则跳过
    if (containerRef?.current && containerRef.current.contains(element)) {
      return;
    }

    const style = window.getComputedStyle(element);
    const position = style.position;
    const top = style.top;

    // 检查是否是固定或粘性定位
    const isFixedOrSticky = position === 'fixed' || position === 'sticky';

    // 检查是否在顶部（top 为 0 或接近 0）
    const isAtTop = top === '0px' || top === '0' || (parseFloat(top) <= 1 && parseFloat(top) >= 0);

    // 如果元素固定在顶部，添加到列表中
    if (isFixedOrSticky && isAtTop) {
      fixedElements.push(element);
    }
  });

  // 如果没有找到固定元素，返回0
  if (fixedElements.length === 0) {
    return 0;
  }

  // 找到 z-index 最大的元素
  const elementWithMaxZIndex = fixedElements.reduce((maxElement, currentElement) => {
    const maxZIndex = parseInt(window.getComputedStyle(maxElement).zIndex || '0');
    const currentZIndex = parseInt(window.getComputedStyle(currentElement).zIndex || '0');
    return currentZIndex > maxZIndex ? currentElement : maxElement;
  });

  // 计算 z-index 最大元素的高度
  const rect = elementWithMaxZIndex.getBoundingClientRect();
  const maxHeight = rect.height;

  return maxHeight;
};