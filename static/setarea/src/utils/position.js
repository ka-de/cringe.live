/**
 * Get the position of an element relative to the viewport.
 * @param {HTMLElement} element - The element to get the position for.
 * @returns {Object} An object with x and y properties representing the element's position.
 */
function getElementPosition (element) {
  const rect = element.getBoundingClientRect()
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return {
    x: rect.left + scrollLeft,
    y: rect.top + scrollTop
  }
}

/**
 * Get the position of the canvas relative to the viewport.
 * @returns {Object} An object with x and y properties representing the canvas's position.
 */
function getCanvasPosition () {
  const canvas = document.getElementById('canvas')
  return getElementPosition(canvas)
}

/**
 * Get the position of the mouse relative to the canvas.
 * @param {MouseEvent} e - The mouse event object.
 * @returns {Object} An object with x and y properties representing the mouse position relative to the canvas.
 */
function getMousePositionRelativeToCanvas (e) {
  const { x: canvasX, y: canvasY } = getCanvasPosition()
  return {
    x: e.clientX - canvasX,
    y: e.clientY - canvasY
  }
}

export { getElementPosition, getCanvasPosition, getMousePositionRelativeToCanvas }
