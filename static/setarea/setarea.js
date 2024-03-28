/* eslint-disable no-unused-vars */

import resizeAreaUtils from './resizeArea.js'

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
let initialX, initialY
let currentX, currentY
let currentAreaOffsetX, currentAreaOffsetY

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
  resizeAreaUtils.currentArea = area

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
  resizeAreaUtils.startResizeArea(e)
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
  if (resizeAreaUtils.isResizingArea) return

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
  area.innerHTML = `<span class="area-info">${width}x${height} ${left},${top}</span>`

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
  areaInfo.textContent = `${areaWidth}x${areaHeight} ${x},${y}`
  area.appendChild(areaInfo)

  const canvas = document.getElementById('canvas')
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
  // Add click event listener for the "Add Area" button
  const addAreaButton = document.querySelector('button[onclick="addArea()"]')
  addAreaButton.onclick = addArea

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
