/* eslint-disable no-unused-vars */

// Importing wolves 🐺
import './setarea.sass'
import resizeAreaUtils from './utils/resizeArea.js'
import { copyToClipboard, exportToWorkflow, loadWorkflowFiles, updateCharacteristicGuidancePredictionNodes } from './utils/workflowHandling.js'
import getRandomRGBAColor from './utils/colorTools.js'
import { getCanvasPosition, getMousePositionRelativeToCanvas } from './utils/position.js'
import shouldSnapArea from './utils/areaLayout.js'

/**
 * This JavaScript file contains functions for creating, updating, and exporting areas on a canvas.
 * It also includes functions for setting the background image of the canvas, loading workflow files,
 * and handling the drag functionality of a floating bar.
 */

// Variables for storing the state of the canvas and the selection process.
const areas = [] // An array to store the areas on the canvas.
const isDragging = false // A flag to indicate whether the user is currently dragging the mouse.
let xOffset = 0 // The x-offset of the mouse from the initial x-coordinate.
let yOffset = 0 // The y-offset of the mouse from the initial y-coordinate.

// Event variables for creating new areas
let isSelecting = false
let startX, startY

// Get the floating bar element.
const floatingBar = document.getElementById('floating-bar')

// A flag to indicate whether the user is currently dragging the floating bar.
let isDraggingFloatingBar = false

// The initial x-coordinate of the mouse when the user starts dragging the floating bar.
let floatingBarInitialX

// The initial y-coordinate of the mouse when the user starts dragging the floating bar.
let floatingBarInitialY

// Event variables for dragging existing areas
let isDraggingArea = false
let initialX, initialY
let currentX, currentY
let currentAreaOffsetX, currentAreaOffsetY

/**
 * Starts the drag functionality of an existing area.
 * @param {Event} e - The mousedown event.
 */
function startDragArea (e) {
  const enableAreaDragCheckbox = document.getElementById('enableAreaDrag')
  if (!enableAreaDragCheckbox.checked) return

  // Prevent selection while dragging
  e.preventDefault()

  const area = e.currentTarget
  isDraggingArea = true
  resizeAreaUtils.currentArea = area

  // Get the area's position relative to the canvas
  const canvas = document.getElementById('canvas')
  const canvasRect = canvas.getBoundingClientRect()
  const canvasLeft = canvasRect.left + window.scrollX + canvas.scrollLeft
  const canvasTop = canvasRect.top + window.scrollY + canvas.scrollTop
  const areaRect = area.getBoundingClientRect()

  // Set the initial offset based on the canvas position
  currentAreaOffsetX = e.clientX - (areaRect.left - canvasLeft)
  currentAreaOffsetY = e.clientY - (areaRect.top - canvasTop)

  document.addEventListener('mousemove', dragArea)
  document.addEventListener('mouseup', stopDragArea)
}

/**
 * Handles the drag functionality of an existing area while the mouse is moving.
 * @param {Event} e - The mousemove event.
 */
function dragArea (e) {
  if (!isDraggingArea) return

  const canvas = document.getElementById('canvas')
  const canvasWidth = canvas.offsetWidth
  const canvasHeight = canvas.offsetHeight

  let newX = e.clientX - currentAreaOffsetX
  let newY = e.clientY - currentAreaOffsetY

  // Clamp the new position to stay within the canvas bounds
  newX = Math.max(0, Math.min(newX, canvasWidth - resizeAreaUtils.currentArea.offsetWidth))
  newY = Math.max(0, Math.min(newY, canvasHeight - resizeAreaUtils.currentArea.offsetHeight))

  resizeAreaUtils.currentArea.style.left = `${newX}px`
  resizeAreaUtils.currentArea.style.top = `${newY}px`

  // Update the area-info span with the new coordinates
  resizeAreaUtils.currentArea.querySelector('.area-info').textContent = `${resizeAreaUtils.currentArea.offsetWidth}x${resizeAreaUtils.currentArea.offsetHeight} ${newX},${newY}`
}

/**
 * Ends the drag functionality of an existing area.
 * @param {Event} e - The mouseup event.
 */
function stopDragArea (e) {
  isDraggingArea = false

  document.removeEventListener('mousemove', dragArea)
  document.removeEventListener('mouseup', stopDragArea)
}

/**
 * Starts the selection process on the canvas or within nested areas.
 * @param {Event} e - The mousedown event.
 */
function startSelection (e) {
  // Check if the user is already resizing an area
  if (resizeAreaUtils.isResizingArea) return

  // Check if the user is already dragging an area
  if (isDraggingArea) return

  const { x: canvasX, y: canvasY } = getCanvasPosition()
  const { x: mouseX, y: mouseY } = getMousePositionRelativeToCanvas(e)

  isSelecting = true

  // Calculate startX and startY relative to the canvas
  startX = mouseX
  startY = mouseY
}

/**
 * Updates the selection on the canvas or within nested areas while the mouse is moving.
 * @param {Event} e - The mousemove event.
 */
function updateSelection (e) {
  if (!isSelecting) return

  let selection = document.getElementById('selection')

  if (!selection) {
    selection = document.createElement('div')
    selection.id = 'selection'
    selection.classList.add('selection')
    document.body.appendChild(selection)
  }

  const canvas = document.getElementById('canvas')
  const canvasRect = canvas.getBoundingClientRect()
  const canvasLeft = canvasRect.left + window.scrollX
  const canvasTop = canvasRect.top + window.scrollY

  const mouseX = e.clientX - canvasLeft
  const mouseY = e.clientY - canvasTop

  const minX = Math.min(startX, mouseX)
  const minY = Math.min(startY, mouseY)
  const maxX = Math.max(startX, mouseX)
  const maxY = Math.max(startY, mouseY)
  const width = maxX - minX
  const height = maxY - minY

  selection.style.left = `${minX}px`
  selection.style.top = `${minY}px`
  selection.style.width = `${width}px`
  selection.style.height = `${height}px`
}

/**
 * Ends the selection process on the canvas or within nested areas.
 * @param {Event} e - The mouseup event.
 */
function endSelection (e) {
  if (!isSelecting) return
  isSelecting = false

  const selection = document.getElementById('selection')
  if (!selection) return

  const width = parseInt(selection.style.width, 10)
  const height = parseInt(selection.style.height, 10)

  // Check if the area dimensions are at least 64x64 pixels
  if (width < 64 || height < 64) {
    alert('Area dimensions must be at least 64x64 pixels.')
    selection.remove()
    return
  }

  const canvas = document.getElementById('canvas')
  const canvasRect = canvas.getBoundingClientRect()
  const canvasLeft = canvasRect.left + window.pageXOffset
  const canvasTop = canvasRect.top + window.pageYOffset

  const left = selection.offsetLeft - canvasLeft
  const top = selection.offsetTop - canvasTop

  const color = getRandomRGBAColor()
  const area = document.createElement('div')
  area.className = 'area bg-gray-300 rounded-md'
  area.style.width = `${width}px`
  area.style.height = `${height}px`
  area.style.left = `${left}px`
  area.style.top = `${top}px`
  area.style.backgroundColor = color
  area.innerHTML = `<span class="area-info">${width}x${height} ${left},${top}</span>`

  canvas.appendChild(area)
  areas.push(area)

  // Add event listener for dragging the new area
  area.addEventListener('mousedown', startDragArea)

  selection.remove()
}

/**
 * Sets the background image of the canvas.
 * @param {File} file - The image file to be set as the background.
 */
function setBackgroundImage (file) {
  if (file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      const bgImageContainer = document.getElementById('bgImageContainer')
      bgImageContainer.style.backgroundImage = `url(${e.target.result})`
      bgImageContainer.style.backgroundSize = 'contain'
      bgImageContainer.style.backgroundRepeat = 'no-repeat'
      bgImageContainer.style.backgroundPosition = 'center'
    }
    reader.readAsDataURL(file)
  }
}

/**
 * Call loadWorkflowFiles when the page loads
 */
document.addEventListener('DOMContentLoaded', function () {
  loadWorkflowFiles()

  // Add event listeners for CharacteristicGuidancePrediction node randomization
  const enableLogStepRandomizationCheckbox = document.getElementById('enableLogStepRandomization')
  const logStepMinInput = document.getElementById('logStepMin')
  const logStepMaxInput = document.getElementById('logStepMax')

  enableLogStepRandomizationCheckbox.addEventListener('change', () => {
    updateCharacteristicGuidancePredictionNodes()
  })

  logStepMinInput.addEventListener('input', () => {
    updateCharacteristicGuidancePredictionNodes()
  })

  logStepMaxInput.addEventListener('input', () => {
    updateCharacteristicGuidancePredictionNodes()
  })

  const enableLogToleranceRandomizationCheckbox = document.getElementById('enableLogToleranceRandomization')
  const logToleranceMinInput = document.getElementById('logToleranceMin')
  const logToleranceMaxInput = document.getElementById('logToleranceMax')

  enableLogToleranceRandomizationCheckbox.addEventListener('change', () => {
    updateCharacteristicGuidancePredictionNodes()
  })

  logToleranceMinInput.addEventListener('input', () => {
    updateCharacteristicGuidancePredictionNodes()
  })

  logToleranceMaxInput.addEventListener('input', () => {
    updateCharacteristicGuidancePredictionNodes()
  })

  const enableKeepToleranceRandomizationCheckbox = document.getElementById('enableKeepToleranceRandomization')
  const keepToleranceMinInput = document.getElementById('keepToleranceMin')
  const keepToleranceMaxInput = document.getElementById('keepToleranceMax')

  enableKeepToleranceRandomizationCheckbox.addEventListener('change', () => {
    updateCharacteristicGuidancePredictionNodes()
  })

  keepToleranceMinInput.addEventListener('input', () => {
    updateCharacteristicGuidancePredictionNodes()
  })

  keepToleranceMaxInput.addEventListener('input', () => {
    updateCharacteristicGuidancePredictionNodes()
  })
})

/**
 * Starts the drag functionality of the floating bar.
 * @param {Event} e - The mousedown event.
 */
function floatingBarDragStart (e) {
  const floatingBar = e.currentTarget
  if (floatingBar) {
    isDraggingFloatingBar = true
    floatingBarInitialX = e.clientX - floatingBar.offsetLeft
    floatingBarInitialY = e.clientY - floatingBar.offsetTop

    // Capture mousemove event globally
    document.addEventListener('mousemove', floatingBarDrag)
  }
}

/**
 * Handles the drag functionality of the floating bar while the mouse is moving.
 * @param {Event} e - The mousemove event.
 */
function floatingBarDrag (e) {
  if (isDraggingFloatingBar) {
    const floatingBar = document.getElementById('floating-bar')
    if (floatingBar) {
      let newX = e.clientX - floatingBarInitialX
      let newY = e.clientY - floatingBarInitialY

      // Get the viewport dimensions
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Calculate the maximum allowed position for the floating bar
      const maxX = viewportWidth - floatingBar.offsetWidth
      const maxY = viewportHeight - floatingBar.offsetHeight

      // Clamp the new position to stay within the viewport bounds
      newX = Math.max(0, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))

      floatingBar.style.left = newX + 'px'
      floatingBar.style.top = newY + 'px'
    } else {
      console.error('Floating bar element not found.')
    }
  }
}

/**
 * Ends the drag functionality of the floating bar.
 */
function floatingBarDragEnd () {
  isDraggingFloatingBar = false

  // Remove global mousemove event listener
  document.removeEventListener('mousemove', floatingBarDrag)
}

/**
 * Sets the size of the canvas.
 */
function setCanvasSize () {
  const canvasWidth = document.getElementById('canvasWidth').value
  const canvasHeight = document.getElementById('canvasHeight').value
  const canvas = document.getElementById('canvas')
  canvas.style.width = canvasWidth + 'px'
  canvas.style.height = canvasHeight + 'px'
}

/**
 * Handles the drag functionality of an element.
 * @param {Event} e - The mousedown event.
 */
function elementDrag (e) {
  e = e || window.event
  e.preventDefault() // Prevent default behavior for all elements

  const clickedElement = e.target
  if (clickedElement.tagName.toLowerCase() !== 'input') {
    // Only perform dragging logic if the clicked element is not an input field
    if (isDragging) {
      currentX = e.clientX - initialX
      currentY = e.clientY - initialY
      xOffset = currentX
      yOffset = currentY
      setTranslate(currentX, currentY, floatingBar)
    }
  }
}

/**
 * Translates an element to a new position.
 * @param {number} xPos - The new x-position.
 * @param {number} yPos - The new y-position.
 * @param {HTMLElement} el - The element to be translated.
 */
function setTranslate (xPos, yPos, el) {
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`
}

/**
 * Adds a new area to the canvas.
 */
function addArea () {
  const areaWidth = parseInt(document.getElementById('areaWidth').value)
  const areaHeight = parseInt(document.getElementById('areaHeight').value)
  const areaX = parseInt(document.getElementById('areaX').value)
  const areaY = parseInt(document.getElementById('areaY').value)

  // Check if the input values are valid numbers
  if (isNaN(areaWidth) || isNaN(areaHeight) || isNaN(areaX) || isNaN(areaY)) {
    alert('Please enter valid numeric values for area dimensions and position.')
    return
  }

  // Check if the area dimensions are at least 64x64 pixels
  if (areaWidth < 64 || areaHeight < 64) {
    alert('Area dimensions must be at least 64x64 pixels.')
    return
  }

  const canvas = document.getElementById('canvas')
  const canvasRect = canvas.getBoundingClientRect()
  const canvasLeft = canvasRect.left + window.pageXOffset
  const canvasTop = canvasRect.top + window.pageYOffset

  const { x, y } = shouldSnapArea(areaX, areaY, areaWidth, areaHeight)

  const color = getRandomRGBAColor()

  const area = document.createElement('div')
  area.className = 'area bg-gray-300 rounded-md'
  area.style.width = areaWidth + 'px'
  area.style.height = areaHeight + 'px'
  area.style.left = (x + canvasLeft) + 'px'
  area.style.top = (y + canvasTop) + 'px'
  area.style.backgroundColor = color

  const areaInfo = document.createElement('span')
  areaInfo.className = 'area-info'
  areaInfo.textContent = `${areaWidth}x${areaHeight} ${x},${y}`
  area.appendChild(areaInfo)

  canvas.appendChild(area)
  areas.push(area)

  // Add event listeners for dragging the area
  area.addEventListener('mousedown', startDragArea)

  // Add event listeners for resizing the area
  area.addEventListener('mousedown', (e) => {
    if (resizeAreaUtils.enableAreaResizeCheckbox && resizeAreaUtils.enableAreaResizeCheckbox.checked) {
      resizeAreaUtils.startResizeArea(e)
    }
  })
}

/**
 * Removes the last added area from the canvas or its parent area.
 */
function removeArea () {
  if (areas.length > 0) {
    const areaToRemove = areas.pop()
    const parentArea = areaToRemove.parentNode

    if (parentArea.classList.contains('area')) {
      parentArea.removeChild(areaToRemove)
    } else {
      const canvas = document.getElementById('canvas')
      canvas.removeChild(areaToRemove)
    }

    // Remove event listener for the removed area
    areaToRemove.removeEventListener('mousedown', startDragArea)
  }
}

function handleMouseDown (e) {
  const enableAreaDragCheckbox = document.getElementById('enableAreaDrag')
  const enableAreaResizeCheckbox = document.getElementById('enableAreaResize')

  resizeAreaUtils.currentArea = e.currentTarget

  if (enableAreaDragCheckbox && enableAreaDragCheckbox.checked) {
    isDraggingArea = true
    initialX = e.clientX - resizeAreaUtils.currentArea.offsetLeft
    initialY = e.clientY - resizeAreaUtils.currentArea.offsetTop
  }

  if (enableAreaResizeCheckbox && enableAreaResizeCheckbox.checked) {
    resizeAreaUtils.isResizingArea = true
    resizeAreaUtils.resizeDirection = resizeAreaUtils.getResizeDirection(
      e.clientX - resizeAreaUtils.currentArea.offsetLeft,
      e.clientY - resizeAreaUtils.currentArea.offsetTop,
      resizeAreaUtils.currentArea.offsetWidth,
      resizeAreaUtils.currentArea.offsetHeight
    )
    resizeAreaUtils.resizeStartWidth = resizeAreaUtils.currentArea.offsetWidth
    resizeAreaUtils.resizeStartHeight = resizeAreaUtils.currentArea.offsetHeight
    resizeAreaUtils.resizeStartX = resizeAreaUtils.currentArea.offsetLeft
    resizeAreaUtils.resizeStartY = resizeAreaUtils.currentArea.offsetTop
  }
}

function getNewCoordinates (resizeDirection, resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight, newWidth, newHeight) {
  let newX = resizeStartX
  let newY = resizeStartY

  switch (resizeDirection) {
    case resizeAreaUtils.RESIZE_DIRECTIONS.TOP_LEFT:
      newX += resizeStartWidth - newWidth
      newY += resizeStartHeight - newHeight
      break
    case resizeAreaUtils.RESIZE_DIRECTIONS.TOP_RIGHT:
      newY += resizeStartHeight - newHeight
      break
    case resizeAreaUtils.RESIZE_DIRECTIONS.BOTTOM_LEFT:
      newX += resizeStartWidth - newWidth
      break
    case resizeAreaUtils.RESIZE_DIRECTIONS.BOTTOM_RIGHT:
      break
  }

  return { newX, newY }
}

function handleMouseMove (e) {
  if (isDraggingArea) {
    currentX = e.clientX - initialX
    currentY = e.clientY - initialY

    resizeAreaUtils.currentArea.style.left = `${currentX}px`
    resizeAreaUtils.currentArea.style.top = `${currentY}px`
  }

  if (resizeAreaUtils.isResizingArea) {
    const newWidth = resizeAreaUtils.resizeStartWidth + (e.clientX - resizeAreaUtils.resizeStartX - resizeAreaUtils.currentArea.offsetLeft)
    const newHeight = resizeAreaUtils.resizeStartHeight + (e.clientY - resizeAreaUtils.resizeStartY - resizeAreaUtils.currentArea.offsetTop)

    resizeAreaUtils.currentArea.style.width = `${newWidth}px`
    resizeAreaUtils.currentArea.style.height = `${newHeight}px`

    const { newX, newY } = getNewCoordinates(
      resizeAreaUtils.resizeDirection,
      resizeAreaUtils.resizeStartX,
      resizeAreaUtils.resizeStartY,
      resizeAreaUtils.resizeStartWidth,
      resizeAreaUtils.resizeStartHeight,
      newWidth,
      newHeight
    )

    resizeAreaUtils.currentArea.style.left = `${newX}px`
    resizeAreaUtils.currentArea.style.top = `${newY}px`
  }
}

function handleMouseUp (e) {
  isDraggingArea = false
  resizeAreaUtils.isResizingArea = false
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
  // Add click event listener for the buttons
  const addAreaButton = document.querySelector('button[onclick="addArea()"]')
  addAreaButton.onclick = addArea
  const removeAreaButton = document.querySelector('button[onclick="removeArea()"]')
  removeAreaButton.onclick = removeArea
  const setCanvasSizeButton = document.querySelector('button[onclick="setCanvasSize()"]')
  setCanvasSizeButton.onclick = setCanvasSize
  const exportToWorkflowButton = document.querySelector('button[onclick="exportToWorkflow()"]')
  exportToWorkflowButton.onclick = exportToWorkflow
  const copyToClipboardButton = document.querySelector('button[onclick="copyToClipboard()"]')
  copyToClipboardButton.onclick = copyToClipboard

  document.getElementById('bgImageFile').onchange = function (event) {
    setBackgroundImage(event.target.files[0])
  }

  const enableAreaDragCheckbox = document.getElementById('enableAreaDrag')
  const enableAreaResizeCheckbox = document.getElementById('enableAreaResize')
  const areas = document.querySelectorAll('.area')

  areas.forEach(area => {
    area.addEventListener('mousedown', handleMouseDown)
    area.addEventListener('mousemove', handleMouseMove)
    area.addEventListener('mouseup', handleMouseUp)
    area.addEventListener('mousedown', (e) => {
      if (enableAreaResizeCheckbox && enableAreaResizeCheckbox.checked) {
        resizeAreaUtils.startResizeArea(e)
      }
    })
  })

  enableAreaDragCheckbox.addEventListener('change', () => {
    areas.forEach(area => {
      if (enableAreaDragCheckbox.checked) {
        area.style.cursor = 'move'
      } else {
        area.style.cursor = 'default'
      }
    })
  })

  enableAreaResizeCheckbox.addEventListener('change', () => {
    areas.forEach(area => {
      if (enableAreaResizeCheckbox.checked) {
        area.style.cursor = 'nw-resize'
      } else {
        area.style.cursor = 'default'
      }
    })
  })

  // Get the canvas element and add event listeners for mousedown, mousemove, and mouseup events.
  const canvas = document.getElementById('canvas')
  canvas.addEventListener('mousedown', startSelection)
  canvas.addEventListener('mousemove', updateSelection)
  canvas.addEventListener('mouseup', endSelection)

  // Add a mousedown event listener to the bgImageOpacity element to prevent the floating bar from dragging when interacting with the opacity slider.
  document.getElementById('bgImageOpacity').addEventListener('mousedown', function (e) {
    e.stopPropagation()
  })

  // Set the initial canvas size to 1024 x 1024.
  document.getElementById('canvasWidth').value = 1024
  document.getElementById('canvasHeight').value = 1024
  setCanvasSize()
  // Add event listeners for mousedown, mousemove, mouseup, and mouseleave events to the floating bar.
  const floatingBar = document.getElementById('floating-bar')
  floatingBar.addEventListener('mousedown', floatingBarDragStart)
  floatingBar.addEventListener('mouseup', floatingBarDragEnd)
  floatingBar.addEventListener('mouseleave', floatingBarDragEnd)
})

export { setBackgroundImage, setCanvasSize, exportToWorkflow, removeArea, copyToClipboard }
