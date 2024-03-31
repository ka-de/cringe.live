import resizeAreaUtils from './resizeArea.js'

let twoWayWorkflowJSON, threeWayWorkflowJSON, fourWayWorkflowJSON, fiveWayWorkflowJSON

const areas = []
const isDragging = false
let xOffset = 0
let yOffset = 0

let isSelecting = false
let startX, startY

const floatingBar = document.getElementById('floating-bar')

let isDraggingFloatingBar = false

let floatingBarInitialX

let floatingBarInitialY

let isDraggingArea = false
let initialX, initialY
let currentX, currentY
let currentAreaOffsetX, currentAreaOffsetY

function getRandomFloat (min, max) {
  return Math.random() * (max - min) + min
}

function shouldSnapArea (x, y, width, height) {
  const canvas = document.getElementById('canvas')
  const canvasRect = canvas.getBoundingClientRect()
  const canvasLeft = canvasRect.left + window.pageXOffset
  const canvasTop = canvasRect.top + window.pageYOffset
  const canvasWidth = canvas.offsetWidth
  const canvasHeight = canvas.offsetHeight
  const snappingRadius = parseInt(document.getElementById('snappingRadius').value)
  const enableSnapping = document.getElementById('enableSnapping').checked

  if (!enableSnapping) {
    return { x, y }
  }

  let snappedX = x + canvasLeft
  let snappedY = y + canvasTop

  for (const area of areas) {
    const areaX = parseInt(area.style.left) + canvasLeft
    const areaY = parseInt(area.style.top) + canvasTop
    const areaWidth = parseInt(area.style.width)
    const areaHeight = parseInt(area.style.height)

    if (
      Math.abs(x + canvasLeft - (areaX + areaWidth)) <= snappingRadius ||
      Math.abs(x + canvasLeft - areaX) <= snappingRadius ||
      Math.abs(y + canvasTop - (areaY + areaHeight)) <= snappingRadius ||
      Math.abs(y + canvasTop - areaY) <= snappingRadius
    ) {
      snappedX = x > areaX + areaWidth / 2 ? areaX + areaWidth - canvasLeft : areaX - canvasLeft
      snappedY = y > areaY + areaHeight / 2 ? areaY + areaHeight - canvasTop : areaY - canvasTop
      break
    }
  }

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

  return { x: snappedX - canvasLeft, y: snappedY - canvasTop }
}

function startDragArea (e) {
  const enableAreaDragCheckbox = document.getElementById('enableAreaDrag')
  if (!enableAreaDragCheckbox.checked) return

  e.preventDefault()

  const area = e.currentTarget
  isDraggingArea = true
  resizeAreaUtils.currentArea = area

  const canvas = document.getElementById('canvas')
  const canvasRect = canvas.getBoundingClientRect()
  const canvasLeft = canvasRect.left + window.scrollX + canvas.scrollLeft
  const canvasTop = canvasRect.top + window.scrollY + canvas.scrollTop
  const areaRect = area.getBoundingClientRect()

  currentAreaOffsetX = e.clientX - (areaRect.left - canvasLeft)
  currentAreaOffsetY = e.clientY - (areaRect.top - canvasTop)

  document.addEventListener('mousemove', dragArea)
  document.addEventListener('mouseup', stopDragArea)
}

function dragArea (e) {
  if (!isDraggingArea) return

  const canvas = document.getElementById('canvas')
  const canvasWidth = canvas.offsetWidth
  const canvasHeight = canvas.offsetHeight

  let newX = e.clientX - currentAreaOffsetX
  let newY = e.clientY - currentAreaOffsetY

  newX = Math.max(0, Math.min(newX, canvasWidth - resizeAreaUtils.currentArea.offsetWidth))
  newY = Math.max(0, Math.min(newY, canvasHeight - resizeAreaUtils.currentArea.offsetHeight))

  resizeAreaUtils.currentArea.style.left = `${newX}px`
  resizeAreaUtils.currentArea.style.top = `${newY}px`

  resizeAreaUtils.currentArea.querySelector('.area-info').textContent = `${resizeAreaUtils.currentArea.offsetWidth}x${resizeAreaUtils.currentArea.offsetHeight} ${newX},${newY}`
}

function stopDragArea (e) {
  isDraggingArea = false

  document.removeEventListener('mousemove', dragArea)
  document.removeEventListener('mouseup', stopDragArea)
}

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

function copyToClipboard () {
  handleWorkflowData(false)
}

function exportToWorkflow () {
  handleWorkflowData(true)
}

function getElementPosition (element) {
  const rect = element.getBoundingClientRect()
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return {
    x: rect.left + scrollLeft,
    y: rect.top + scrollTop
  }
}

function getCanvasPosition () {
  const canvas = document.getElementById('canvas')
  return getElementPosition(canvas)
}

function getMousePositionRelativeToCanvas (e) {
  const { x: canvasX, y: canvasY } = getCanvasPosition()
  return {
    x: e.clientX - canvasX,
    y: e.clientY - canvasY
  }
}

function startSelection (e) {
  if (resizeAreaUtils.isResizingArea) return

  if (isDraggingArea) return

  const { x: canvasX, y: canvasY } = getCanvasPosition()
  const { x: mouseX, y: mouseY } = getMousePositionRelativeToCanvas(e)

  isSelecting = true

  startX = mouseX
  startY = mouseY
}

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

function endSelection (e) {
  if (!isSelecting) return
  isSelecting = false

  const selection = document.getElementById('selection')
  if (!selection) return

  const width = parseInt(selection.style.width, 10)
  const height = parseInt(selection.style.height, 10)

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

  area.addEventListener('mousedown', startDragArea)

  selection.remove()
}

function updateConditioningSetAreaNodes (workflowJSON, numAreas) {
  const conditioningSetAreaNodes = workflowJSON.nodes.filter(
    (node) => node.type === 'ConditioningSetArea'
  )
  const interpolatePredictionsNodes = workflowJSON.nodes.filter(
    (node) => node.type === 'InterpolatePredictions'
  )

  const enableScaleBRandomization = document.getElementById(
    'enableScaleBRandomization'
  ).checked
  const scaleBMin = parseFloat(document.getElementById('scaleBMin').value)
  const scaleBMax = parseFloat(document.getElementById('scaleBMax').value)

  const enableLogStepRandomization = document.getElementById(
    'enableLogStepRandomization'
  ).checked
  const logStepMin = parseFloat(document.getElementById('logStepMin').value)
  const logStepMax = parseFloat(document.getElementById('logStepMax').value)

  const enableLogToleranceRandomization = document.getElementById(
    'enableLogToleranceRandomization'
  ).checked
  const logToleranceMin = parseFloat(
    document.getElementById('logToleranceMin').value
  )
  const logToleranceMax = parseFloat(
    document.getElementById('logToleranceMax').value
  )

  const enableKeepToleranceRandomization = document.getElementById(
    'enableKeepToleranceRandomization'
  ).checked
  const keepToleranceMin = parseInt(
    document.getElementById('keepToleranceMin').value
  )
  const keepToleranceMax = parseInt(
    document.getElementById('keepToleranceMax').value
  )

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

  if (enableScaleBRandomization) {
    interpolatePredictionsNodes.forEach((node) => {
      node.widgets_values[0] = getRandomFloat(scaleBMin, scaleBMax)
    })
  } else {
    interpolatePredictionsNodes.forEach((node) => {
      node.widgets_values[0] = getRandomFloat(0.6, 0.8)
    })
  }

  if (enableLogStepRandomization) {
    interpolatePredictionsNodes.forEach((node) => {
      node.widgets_values[1] = getRandomFloat(logStepMin, logStepMax)
    })
  }

  if (enableLogToleranceRandomization) {
    interpolatePredictionsNodes.forEach((node) => {
      node.widgets_values[2] = getRandomFloat(logToleranceMin, logToleranceMax)
    })
  }

  if (enableKeepToleranceRandomization) {
    interpolatePredictionsNodes.forEach((node) => {
      node.widgets_values[3] = Math.floor(
        getRandomFloat(keepToleranceMin, keepToleranceMax)
      )
    })
  }
}

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

document.addEventListener('DOMContentLoaded', function () {
  loadWorkflowFiles()
})

function floatingBarDragStart (e) {
  const floatingBar = e.currentTarget
  if (floatingBar) {
    isDraggingFloatingBar = true
    floatingBarInitialX = e.clientX - floatingBar.offsetLeft
    floatingBarInitialY = e.clientY - floatingBar.offsetTop

    document.addEventListener('mousemove', floatingBarDrag)
  }
}

function floatingBarDrag (e) {
  if (isDraggingFloatingBar) {
    const floatingBar = document.getElementById('floating-bar')
    if (floatingBar) {
      let newX = e.clientX - floatingBarInitialX
      let newY = e.clientY - floatingBarInitialY

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      const maxX = viewportWidth - floatingBar.offsetWidth
      const maxY = viewportHeight - floatingBar.offsetHeight

      newX = Math.max(0, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))

      floatingBar.style.left = newX + 'px'
      floatingBar.style.top = newY + 'px'
    } else {
      console.error('Floating bar element not found.')
    }
  }
}

function floatingBarDragEnd () {
  isDraggingFloatingBar = false

  document.removeEventListener('mousemove', floatingBarDrag)
}

function setCanvasSize () {
  const canvasWidth = document.getElementById('canvasWidth').value
  const canvasHeight = document.getElementById('canvasHeight').value
  const canvas = document.getElementById('canvas')
  canvas.style.width = canvasWidth + 'px'
  canvas.style.height = canvasHeight + 'px'
}

function addArea () {
  const areaWidth = parseInt(document.getElementById('areaWidth').value)
  const areaHeight = parseInt(document.getElementById('areaHeight').value)
  const areaX = parseInt(document.getElementById('areaX').value)
  const areaY = parseInt(document.getElementById('areaY').value)

  if (isNaN(areaWidth) || isNaN(areaHeight) || isNaN(areaX) || isNaN(areaY)) {
    alert('Please enter valid numeric values for area dimensions and position.')
    return
  }

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

  area.addEventListener('mousedown', startDragArea)

  area.addEventListener('mousedown', (e) => {
    if (resizeAreaUtils.enableAreaResizeCheckbox && resizeAreaUtils.enableAreaResizeCheckbox.checked) {
      resizeAreaUtils.startResizeArea(e)
    }
  })
}

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

function getRandomRGBAColor () {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)

  const a = 0.5
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

document.addEventListener('DOMContentLoaded', function () {
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

  const canvas = document.getElementById('canvas')
  canvas.addEventListener('mousedown', startSelection)
  canvas.addEventListener('mousemove', updateSelection)
  canvas.addEventListener('mouseup', endSelection)

  document.getElementById('bgImageOpacity').addEventListener('mousedown', function (e) {
    e.stopPropagation()
  })

  document.getElementById('canvasWidth').value = 1024
  document.getElementById('canvasHeight').value = 1024
  setCanvasSize()

  const floatingBar = document.getElementById('floating-bar')
  floatingBar.addEventListener('mousedown', floatingBarDragStart)
  floatingBar.addEventListener('mouseup', floatingBarDragEnd)
  floatingBar.addEventListener('mouseleave', floatingBarDragEnd)
})

export { setBackgroundImage, setCanvasSize, exportToWorkflow, removeArea, copyToClipboard }
