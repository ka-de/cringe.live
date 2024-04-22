import { areas } from '../setarea.js'

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

  // Check for nearby areas
  for (const area of areas) {
    const areaX = parseInt(area.style.left) + canvasLeft
    const areaY = parseInt(area.style.top) + canvasTop
    const areaWidth = parseInt(area.style.width)
    const areaHeight = parseInt(area.style.height)

    // Check if the new area is within the snapping radius of the existing area
    if (
      Math.abs(x + canvasLeft - (areaX + areaWidth)) <= snappingRadius ||
      Math.abs(x + canvasLeft - areaX) <= snappingRadius ||
      Math.abs(y + canvasTop - (areaY + areaHeight)) <= snappingRadius ||
      Math.abs(y + canvasTop - areaY) <= snappingRadius
    ) {
      // Snap the new area to the existing area
      snappedX = x > areaX + areaWidth / 2 ? areaX + areaWidth - canvasLeft : areaX - canvasLeft
      snappedY = y > areaY + areaHeight / 2 ? areaY + areaHeight - canvasTop : areaY - canvasTop
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

  return { x: snappedX - canvasLeft, y: snappedY - canvasTop }
}

export default shouldSnapArea
