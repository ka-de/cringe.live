// resizeArea.js
const isResizing = false
const currentResizeArea = null
let resizeStartX, resizeStartY
let resizeStartWidth, resizeStartHeight

// Event variables for resizing existing areas
let isResizingArea = false
let resizeDirection = null
let currentArea = null

// Constants for resize direction
const RESIZE_DIRECTIONS = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right'
}

/**
 * Starts the resizing process for an area.
 * @param {Event} e - The mousedown event.
 */
function startResizeArea (e) {
  // Stop event propagation
  e.stopPropagation()

  const enableAreaResizeCheckbox = document.getElementById('enableAreaResize')
  if (!enableAreaResizeCheckbox.checked) return

  isResizingArea = true

  // Find the closest parent .area element
  const area = e.target.closest('.area')
  if (!area) return // If no .area element is found, return early

  currentArea = area
  const rect = area.getBoundingClientRect()

  resizeDirection = getResizeDirection(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height)

  if (resizeDirection) {
    currentArea.style.cursor = `${resizeDirection}-resize`
  } else {
    currentArea.style.cursor = 'default'
  }

  resizeStartWidth = rect.width
  resizeStartHeight = rect.height
  resizeStartX = rect.left
  resizeStartY = rect.top

  document.addEventListener('mousemove', resizeArea)
  document.addEventListener('mouseup', stopResizeArea)
}

/**
 * Resizes the area while the mouse is moving.
 * @param {Event} e - The mousemove event.
 */
function resizeArea (e) {
  if (!isResizingArea || !currentArea) return

  const canvas = document.getElementById('canvas')
  const canvasRect = canvas.getBoundingClientRect()
  const canvasLeft = canvasRect.left + window.pageXOffset
  const canvasTop = canvasRect.top + window.pageYOffset
  const canvasWidth = canvasRect.width
  const canvasHeight = canvasRect.height

  let newWidth = currentArea.offsetWidth
  let newHeight = currentArea.offsetHeight
  let newX = currentArea.offsetLeft
  let newY = currentArea.offsetTop

  switch (resizeDirection) {
    case RESIZE_DIRECTIONS.TOP_LEFT:
      newWidth = resizeStartWidth - (e.clientX - resizeStartX)
      newHeight = resizeStartHeight - (e.clientY - resizeStartY)
      newX = e.clientX - canvasLeft
      newY = e.clientY - canvasTop
      break
    case RESIZE_DIRECTIONS.TOP_RIGHT:
      newWidth = e.clientX - canvasLeft - resizeStartX
      newHeight = resizeStartHeight - (e.clientY - resizeStartY)
      newX = resizeStartX
      newY = resizeStartY
      break
    case RESIZE_DIRECTIONS.BOTTOM_LEFT:
      newWidth = resizeStartWidth - (e.clientX - resizeStartX)
      newHeight = e.clientY - canvasTop - resizeStartY
      newX = e.clientX - canvasLeft
      newY = resizeStartY
      break
    case RESIZE_DIRECTIONS.BOTTOM_RIGHT:
      newWidth = e.clientX - canvasLeft - resizeStartX
      newHeight = e.clientY - canvasTop - resizeStartY
      newX = resizeStartX
      newY = resizeStartY
      break
  }

  const minSize = 64
  newWidth = Math.max(minSize, Math.min(newWidth, canvasWidth - newX))
  newHeight = Math.max(minSize, Math.min(newHeight, canvasHeight - newY))

  currentArea.style.width = `${newWidth}px`
  currentArea.style.height = `${newHeight}px`
  currentArea.style.left = `${newX}px`
  currentArea.style.top = `${newY}px`

  // Update the area-info span with the new dimensions and coordinates
  currentArea.querySelector('.area-info').textContent = `${newWidth}x${newHeight} ${newX},${newY}`
}

/**
 * Ends the resizing process for an area.
 * @param {Event} e - The mouseup event.
 */
function stopResizeArea (e) {
  isResizingArea = false
  currentArea = e.currentTarget

  document.removeEventListener('mousemove', resizeArea)
  document.removeEventListener('mouseup', stopResizeArea)
}

/**
 * Determines the resize direction based on the mouse position relative to the area.
 * @param {number} mouseX - The x-coordinate of the mouse relative to the area.
 * @param {number} mouseY - The y-coordinate of the mouse relative to the area.
 * @param {number} areaWidth - The width of the area.
 * @param {number} areaHeight - The height of the area.
 * @returns {string|null} The resize direction or null if not near a corner.
 */
function getResizeDirection (mouseX, mouseY, areaWidth, areaHeight) {
  const resizeRadius = 10 // Adjust this value to change the resize corner radius

  if (mouseX < resizeRadius && mouseY < resizeRadius) {
    return RESIZE_DIRECTIONS.TOP_LEFT
  } else if (mouseX >= areaWidth - resizeRadius && mouseY < resizeRadius) {
    return RESIZE_DIRECTIONS.TOP_RIGHT
  } else if (mouseX < resizeRadius && mouseY >= areaHeight - resizeRadius) {
    return RESIZE_DIRECTIONS.BOTTOM_LEFT
  } else if (mouseX >= areaWidth - resizeRadius && mouseY >= areaHeight - resizeRadius) {
    return RESIZE_DIRECTIONS.BOTTOM_RIGHT
  }

  return null
}

const resizeAreaUtils = {
  isResizing: false,
  currentResizeArea: null,
  resizeStartX: null,
  resizeStartY: null,
  resizeStartWidth: null,
  resizeStartHeight: null,
  isResizingArea: false,
  resizeDirection: null,
  currentArea: null,
  startResizeArea,
  resizeArea,
  stopResizeArea,
  getResizeDirection,
  RESIZE_DIRECTIONS
}

export default resizeAreaUtils
