/* eslint-disable no-unused-vars */
/**
 * This JavaScript file contains functions for creating, updating, and exporting areas on a canvas.
 * It also includes functions for setting the background image of the canvas, loading workflow files,
 * and handling the drag functionality of a floating bar.
 */

let twoWayWorkflowJSON, threeWayWorkflowJSON, fourWayWorkflowJSON, fiveWayWorkflowJSON

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
let currentArea = null
let initialX, initialY
let currentX, currentY

// Event variables for resizing existing areas
let isResizingArea = false
let resizeDirection = null
let resizeStartWidth, resizeStartHeight
let resizeStartX, resizeStartY

let currentAreaOffsetX, currentAreaOffsetY

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
  const enableAreaResizeCheckbox = document.getElementById('enableAreaResize')
  if (!enableAreaResizeCheckbox.checked) return

  isResizingArea = true

  // Find the closest parent .area element
  const area = e.target.closest('.area')
  if (!area) return // If no .area element is found, return early

  currentArea = area
  const rect = area.getBoundingClientRect()

  resizeDirection = getResizeDirection(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height)
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

  const rect = currentArea.getBoundingClientRect()
  let newWidth = resizeStartWidth
  let newHeight = resizeStartHeight
  let newX = resizeStartX
  let newY = resizeStartY

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

  // Clamp the new dimensions within the canvas bounds and prevent resizing below 64x64 pixels
  const minSize = 64
  newWidth = Math.max(minSize, Math.min(newWidth, canvasWidth - (newX - resizeStartX)))
  newHeight = Math.max(minSize, Math.min(newHeight, canvasHeight - (newY - resizeStartY)))

  // Update the parent area dimensions and position
  currentArea.style.width = `${newWidth}px`
  currentArea.style.height = `${newHeight}px`
  currentArea.style.left = `${newX}px`
  currentArea.style.top = `${newY}px`

  // Update the child areas dimensions and positions relative to the parent area
  const childAreas = Array.from(currentArea.querySelectorAll('.area'))
  childAreas.forEach((child) => {
    const childRect = child.getBoundingClientRect()
    const childRelativeLeft = childRect.left - rect.left
    const childRelativeTop = childRect.top - rect.top
    const childRelativeRight = childRect.right - rect.right
    const childRelativeBottom = childRect.bottom - rect.bottom

    child.style.width = `${childRect.width + (newWidth - rect.width) * (childRelativeRight / rect.width)}px`
    child.style.height = `${childRect.height + (newHeight - rect.height) * (childRelativeBottom / rect.height)}px`
    child.style.left = `${newX + childRelativeLeft}px`
    child.style.top = `${newY + childRelativeTop}px`
  })

  // Update the area-info span with the new dimensions and coordinates
  currentArea.querySelector('.area-info').textContent = `${newWidth}x${newHeight}\n${newX},${newY}`
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
 * Checks if the area should be snapped to a nearby area or the canvas edges.
 * @param {number} x - The x-coordinate of the area.
 * @param {number} y - The y-coordinate of the area.
 * @param {number} width - The width of the area.
 * @param {number} height - The height of the area.
 * @returns {Object} An object containing the snapped x and y coordinates.
 */
function shouldSnapArea (x, y, width, height) {
  const canvas = document.getElementById('canvas')
  const canvasWidth = canvas.offsetWidth
  const canvasHeight = canvas.offsetHeight
  const snappingRadius = parseInt(document.getElementById('snappingRadius').value)
  const enableSnapping = document.getElementById('enableSnapping').checked

  if (!enableSnapping) {
    return { x, y }
  }

  let snappedX = x
  let snappedY = y

  // Check for nearby areas
  for (const area of areas) {
    const areaX = parseInt(area.style.left)
    const areaY = parseInt(area.style.top)
    const areaWidth = parseInt(area.style.width)
    const areaHeight = parseInt(area.style.height)

    // Check if the new area is within the snapping radius of the existing area
    if (
      Math.abs(x - (areaX + areaWidth)) <= snappingRadius ||
      Math.abs(x - areaX) <= snappingRadius ||
      Math.abs(y - (areaY + areaHeight)) <= snappingRadius ||
      Math.abs(y - areaY) <= snappingRadius
    ) {
      // Snap the new area to the existing area
      snappedX = x > areaX + areaWidth / 2 ? areaX + areaWidth : areaX
      snappedY = y > areaY + areaHeight / 2 ? areaY + areaHeight : areaY
      break
    }
  }

  // Check for canvas edges
  if (x <= snappingRadius) {
    snappedX = 0
  } else if (x + width >= canvasWidth - snappingRadius) {
    snappedX = canvasWidth - width
  }

  if (y <= snappingRadius) {
    snappedY = 0
  } else if (y + height >= canvasHeight - snappingRadius) {
    snappedY = canvasHeight - height
  }

  return { x: snappedX, y: snappedY }
}

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
  currentArea = area

  // Get the area's position relative to the canvas
  const canvas = document.getElementById('canvas')
  const canvasRect = canvas.getBoundingClientRect()
  const canvasLeft = canvasRect.left + window.pageXOffset
  const canvasTop = canvasRect.top + window.pageYOffset
  const areaRect = area.getBoundingClientRect()

  // Set the initial offset based on the canvas position
  currentAreaOffsetX = e.clientX - (areaRect.left - canvasLeft)
  currentAreaOffsetY = e.clientY - (areaRect.top - canvasTop)

  document.addEventListener('mousemove', dragArea)
  document.addEventListener('mouseup', stopDragArea)
}

function handleResizeMouseDown (e) {
  startResizeArea(e)
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
  newX = Math.max(0, Math.min(newX, canvasWidth - currentArea.offsetWidth))
  newY = Math.max(0, Math.min(newY, canvasHeight - currentArea.offsetHeight))

  currentArea.style.left = `${newX}px`
  currentArea.style.top = `${newY}px`

  // Update the area-info span with the new coordinates
  currentArea.querySelector('.area-info').textContent = `${currentArea.offsetWidth}x${currentArea.offsetHeight}\n${newX},${newY}`
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
 * Handles the workflow data based on whether it should be exported or copied to the clipboard.
 * If exporting, the workflow data is downloaded as a JSON file with the appropriate filename.
 * If copying, the workflow data is copied to the clipboard.
 * @param {boolean} shouldExport - A boolean indicating whether the workflow data should be exported.
 */
function handleWorkflowData (shouldExport) {
  const numAreas = areas.length
  if (numAreas === 2 || numAreas === 3 || numAreas === 4 || numAreas === 5) {
    const workflowJSON = numAreas === 2
      ? { ...twoWayWorkflowJSON }
      : numAreas === 3
        ? { ...threeWayWorkflowJSON }
        : numAreas === 4
          ? { ...fourWayWorkflowJSON }
          : { ...fiveWayWorkflowJSON }
    updateConditioningSetAreaNodes(workflowJSON, numAreas)

    const workflowData = JSON.stringify(workflowJSON, null, 2)

    if (shouldExport) {
      const workflowName = `${numAreas}way-conditional-workflow.json`
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(workflowData)
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute('href', dataStr)
      downloadAnchorNode.setAttribute('download', workflowName)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    } else {
      navigator.clipboard.writeText(workflowData)
        .then(() => {
          alert(`${numAreas}way-conditional-workflow.json copied to clipboard`)
        })
        .catch((err) => {
          console.error('Failed to copy workflow data: ', err)
        })
    }
  } else {
    const action = shouldExport ? 'export' : 'copy'
    alert(`Please select 2, 3, 4, or 5 areas to ${action} workflow data.`)
  }
}

/**
 * Copies the workflow data to the clipboard.
 */
function copyToClipboard () {
  handleWorkflowData(false)
}

/**
 * Exports the workflow data to a JSON file.
 */
function exportToWorkflow () {
  handleWorkflowData(true)
}

/**
 * Starts the selection process on the canvas or within nested areas.
 * @param {Event} e - The mousedown event.
 */
function startSelection (e) {
  // Check if the user is already resizing an area
  if (isResizingArea) return

  // Check if the user is already dragging an area
  if (isDraggingArea) return

  const canvas = document.getElementById('canvas')
  const canvasRect = canvas.getBoundingClientRect()
  const canvasLeft = canvasRect.left + window.pageXOffset
  const canvasTop = canvasRect.top + window.pageYOffset

  // Find all parent areas under the mouse pointer
  const parentAreas = document.elementsFromPoint(e.clientX, e.clientY)
    .filter(elem => elem.classList.contains('area'))

  // If the user clicked on an existing area, return early
  if (parentAreas.length > 0) return

  isSelecting = true

  // Calculate startX and startY relative to the canvas
  startX = e.pageX - canvasLeft
  startY = e.pageY - canvasTop
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
  const canvasLeft = canvasRect.left + window.pageXOffset
  const canvasTop = canvasRect.top + window.pageYOffset
  const canvasWidth = canvasRect.width
  const canvasHeight = canvasRect.height

  let minX = Math.min(startX, e.clientX - canvasLeft)
  let minY = Math.min(startY, e.clientY - canvasTop)
  let maxX = Math.max(startX, e.clientX - canvasLeft)
  let maxY = Math.max(startY, e.clientY - canvasTop)
  let width = maxX - minX
  let height = maxY - minY

  // Clamp the selection within the canvas bounds
  minX = Math.max(0, minX)
  minY = Math.max(0, minY)
  maxX = Math.min(canvasWidth, maxX)
  maxY = Math.min(canvasHeight, maxY)
  width = maxX - minX
  height = maxY - minY

  selection.style.position = 'absolute'
  selection.style.left = `${minX + canvasLeft}px`
  selection.style.top = `${minY + canvasTop}px`
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

  // Find all parent areas under the mouse pointer
  const parentAreas = document.elementsFromPoint(e.clientX, e.clientY)
    .filter(elem => elem.classList.contains('area'))

  const width = parseInt(selection.style.width, 10)
  const height = parseInt(selection.style.height, 10)

  // Check if the area dimensions are at least 64x64 pixels
  if (width < 64 || height < 64) {
    alert('Area dimensions must be at least 64x64 pixels.')
    selection.remove()
    return
  }

  let left, top

  if (parentAreas.length > 0) {
    const innermost = parentAreas[parentAreas.length - 1]
    const innermostRect = innermost.getBoundingClientRect()
    left = parseInt(selection.style.left, 10) - innermostRect.left
    top = parseInt(selection.style.top, 10) - innermostRect.top
  } else {
    const canvas = document.getElementById('canvas')
    const canvasRect = canvas.getBoundingClientRect()
    const canvasLeft = canvasRect.left + window.pageXOffset
    const canvasTop = canvasRect.top + window.pageYOffset
    left = parseInt(selection.style.left, 10) - canvasLeft
    top = parseInt(selection.style.top, 10) - canvasTop
  }

  const color = getRandomRGBAColor()
  const area = document.createElement('div')
  area.className = 'area bg-gray-300 rounded-md'
  area.style.width = `${width}px`
  area.style.height = `${height}px`
  area.style.left = `${left}px`
  area.style.top = `${top}px`
  area.style.backgroundColor = color
  area.innerHTML = `<span class="area-info">${width}x${height}<br>${left},${top}</span>`

  // Append the new area to the innermost parent area or the canvas
  if (parentAreas.length > 0) {
    const innermost = parentAreas[parentAreas.length - 1]
    innermost.appendChild(area)
  } else {
    const canvas = document.getElementById('canvas')
    canvas.appendChild(area)
  }

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
 * Loads the workflow JSON files.
 */
async function loadWorkflowFiles () {
  try {
    const fourWayResponse = await fetch('4way-conditional-workflow.json')
    const fiveWayResponse = await fetch('5way-conditional-workflow.json')
    const twoWayResponse = await fetch('2way-conditional-workflow.json')
    const threeWayResponse = await fetch('3way-conditional-workflow.json')

    if (!fourWayResponse.ok || !fiveWayResponse.ok || !twoWayResponse.ok || !threeWayResponse.ok) {
      throw new Error('Failed to load one or more workflow files.')
    }

    twoWayWorkflowJSON = await twoWayResponse.json()
    threeWayWorkflowJSON = await threeWayResponse.json()
    fourWayWorkflowJSON = await fourWayResponse.json()
    fiveWayWorkflowJSON = await fiveWayResponse.json()
  } catch (error) {
    console.error('Error loading workflow files:', error)
  }
}

/**
 * Call loadWorkflowFiles when the page loads
 */
document.addEventListener('DOMContentLoaded', loadWorkflowFiles)

/**
 * Updates the ConditioningSetArea nodes in the workflow JSON based on the areas on the canvas.
 * @param {Object} workflowJSON - The workflow JSON object.
 * @param {number} numAreas - The number of areas on the canvas.
 */
function updateConditioningSetAreaNodes (workflowJSON, numAreas) {
  const conditioningSetAreaNodes = workflowJSON.nodes.filter(node => node.type === 'ConditioningSetArea')

  for (let i = 0; i < numAreas; i++) {
    const area = areas[i]
    const width = parseInt(area.style.width)
    const height = parseInt(area.style.height)
    const x = parseInt(area.style.left)
    const y = parseInt(area.style.top)

    if (conditioningSetAreaNodes[i]) {
      conditioningSetAreaNodes[i].widgets_values = [width, height, x, y]
    }
  }
}

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

  const { x, y } = shouldSnapArea(areaX, areaY, areaWidth, areaHeight)

  const color = getRandomRGBAColor()

  const area = document.createElement('div')
  area.className = 'area bg-gray-300 rounded-md'
  area.style.width = areaWidth + 'px'
  area.style.height = areaHeight + 'px'
  area.style.left = x + 'px'
  area.style.top = y + 'px'
  area.style.backgroundColor = color

  const areaInfo = document.createElement('span')
  areaInfo.className = 'area-info'
  areaInfo.textContent = `${areaWidth}x${areaHeight}\n${x},${y}`
  area.appendChild(areaInfo)

  const canvas = document.getElementById('canvas')
  canvas.appendChild(area)
  areas.push(area)
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

  currentArea = e.currentTarget

  if (enableAreaDragCheckbox.checked) {
    isDraggingArea = true
    initialX = e.clientX - currentArea.offsetLeft
    initialY = e.clientY - currentArea.offsetTop
  }

  if (enableAreaResizeCheckbox.checked) {
    isResizingArea = true
    resizeDirection = getResizeDirection(e.clientX - currentArea.offsetLeft, e.clientY - currentArea.offsetTop, currentArea.offsetWidth, currentArea.offsetHeight)
    resizeStartWidth = currentArea.offsetWidth
    resizeStartHeight = currentArea.offsetHeight
    resizeStartX = currentArea.offsetLeft
    resizeStartY = currentArea.offsetTop
  }
}

function handleMouseMove (e) {
  if (isDraggingArea) {
    currentX = e.clientX - initialX
    currentY = e.clientY - initialY

    currentArea.style.left = `${currentX}px`
    currentArea.style.top = `${currentY}px`
  }

  if (isResizingArea) {
    const newWidth = resizeStartWidth + (e.clientX - resizeStartX - currentArea.offsetLeft)
    const newHeight = resizeStartHeight + (e.clientY - resizeStartY - currentArea.offsetTop)

    currentArea.style.width = `${newWidth}px`
    currentArea.style.height = `${newHeight}px`

    switch (resizeDirection) {
      case RESIZE_DIRECTIONS.TOP_LEFT:
        currentArea.style.left = `${resizeStartX + currentArea.offsetLeft + (resizeStartWidth - newWidth)}px`
        currentArea.style.top = `${resizeStartY + currentArea.offsetTop + (resizeStartHeight - newHeight)}px`
        break
      case RESIZE_DIRECTIONS.TOP_RIGHT:
        currentArea.style.top = `${resizeStartY + currentArea.offsetTop + (resizeStartHeight - newHeight)}px`
        break
      case RESIZE_DIRECTIONS.BOTTOM_LEFT:
        currentArea.style.left = `${resizeStartX + currentArea.offsetLeft + (resizeStartWidth - newWidth)}px`
        break
      case RESIZE_DIRECTIONS.BOTTOM_RIGHT:
        break
    }
  }
}

function handleMouseUp (e) {
  isDraggingArea = false
  isResizingArea = false
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

/**
 * Returns a random RGBA color.
 * @returns {string} A string representing a random RGBA color.
 */
function getRandomRGBAColor () {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  // Set alpha value to 0.5
  const a = 0.5
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

// Event listeners for dragging and resizing areas
document.addEventListener('DOMContentLoaded', function () {
  const enableAreaDragCheckbox = document.getElementById('enableAreaDrag')
  const enableAreaResizeCheckbox = document.getElementById('enableAreaResize')

  const areas = document.querySelectorAll('.area')

  areas.forEach(area => {
    area.addEventListener('mousedown', handleMouseDown)
    area.addEventListener('mousemove', handleMouseMove)
    area.addEventListener('mouseup', handleMouseUp)
    area.addEventListener('mousedown', handleResizeMouseDown)
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
