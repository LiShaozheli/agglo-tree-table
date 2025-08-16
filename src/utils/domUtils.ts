/**
 * Calculate the total height of fixed elements at the top of the page
 * 计算页面顶部固定元素的总高度
 * 
 * This function identifies all elements with position: fixed or position: sticky 
 * that are positioned at the top of the page (top: 0) and calculates their total height.
 * 该函数识别所有 position: fixed 或 position: sticky 且位于页面顶部 (top: 0) 的元素，
 * 并计算它们的总高度。
 * 
 * @returns The total height of fixed elements at the top of the page
 * @returns 页面顶部固定元素的总高度
 */
export const calculateFixedElementsHeight = (): number => {
  // 获取所有可能的固定元素
  const allElements = document.querySelectorAll('body *');
  let fixedElements: HTMLElement[] = [];

  // 遍历所有元素，找出固定在顶部的元素
  allElements.forEach(element => {
    if (!(element instanceof HTMLElement)) return;

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