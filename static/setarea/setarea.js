/**
 * This JavaScript file contains functions for creating, updating, and exporting areas on a canvas.
 * It also includes functions for setting the background image of the canvas, loading workflow files,
 * and handling the drag functionalit  y of a floating bar.
 */

let twoWayWorkflowJSON, threeWayWorkflowJSON, fourWayWorkflowJSON, fiveWayWorkflowJSON;

// Variables for storing the state of the canvas and the selection process.
let areas = []; // An array to store the areas on the canvas.
let isDragging = false; // A flag to indicate whether the user is currently dragging the mouse.
let currentX; // The current x-coordinate of the mouse.
let currentY; // The current y-coordinate of the mouse.
let initialX; // The initial x-coordinate of the mouse when the user starts dragging.
let initialY; // The initial y-coordinate of the mouse when the user starts dragging.
let xOffset = 0; // The x-offset of the mouse from the initial x-coordinate.
let yOffset = 0; // The y-offset of the mouse from the initial y-coordinate.\

// Event variables for creating new areas
let isSelecting = false;
let startX, startY;

// Event variables for dragging existing areas
let isDraggingArea = false;
let currentArea = null;
let currentAreaOffsetX, currentAreaOffsetY;

// Get the floating bar element.
let floatingBar = document.getElementById('floating-bar');

// A flag to indicate whether the user is currently dragging the floating bar.
let isDraggingFloatingBar = false;

// The initial x-coordinate of the mouse when the user starts dragging the floating bar.
let floatingBarInitialX;

// The initial y-coordinate of the mouse when the user starts dragging the floating bar.
let floatingBarInitialY;

function copyToClipboard() {
  const numAreas = areas.length;
  if (numAreas === 2 || numAreas === 3 || numAreas === 4 || numAreas === 5) {
    const workflowJSON = numAreas === 2 ? { ...twoWayWorkflowJSON } :
                         numAreas === 3 ? { ...threeWayWorkflowJSON } :
                         numAreas === 4 ? { ...fourWayWorkflowJSON } :
                         { ...fiveWayWorkflowJSON };
    updateConditioningSetAreaNodes(workflowJSON, numAreas);

    const workflowData = JSON.stringify(workflowJSON, null, 2);
    navigator.clipboard.writeText(workflowData)
      .then(() => {
        alert(`${numAreas}way-conditional-workflow.json copied to clipboard`);
      })
      .catch((err) => {
        console.error('Failed to copy workflow data: ', err);
      });
  } else {
    alert("Please select 2, 3, 4, or 5 areas to copy workflow data.");
  }
}

/**
 * Exports the areas on the canvas to a workflow.
 */
function exportToWorkflow() {
  const numAreas = areas.length;
  if (numAreas === 2 || numAreas === 3 || numAreas === 4 || numAreas === 5) {
    const workflowJSON = numAreas === 2 ? { ...twoWayWorkflowJSON } :
                         numAreas === 3 ? { ...threeWayWorkflowJSON } :
                         numAreas === 4 ? { ...fourWayWorkflowJSON } :
                         { ...fiveWayWorkflowJSON };
    updateConditioningSetAreaNodes(workflowJSON, numAreas);

    const workflowName = `${numAreas}way-conditional-workflow.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflowJSON, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", workflowName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  } else {
    alert("Please select 2, 3, 4, or 5 areas to export.");
  }
}

/**
 * Starts the selection process on the canvas or within nested areas.
 * @param {Event} e - The mousedown event.
 */
function startSelection(e) {
    const canvas = document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const canvasLeft = canvasRect.left + window.pageXOffset;
    const canvasTop = canvasRect.top + window.pageYOffset;

    isSelecting = true;

    // Find all parent areas under the mouse pointer
    const parentAreas = document.elementsFromPoint(e.clientX, e.clientY)
        .filter(elem => elem.classList.contains('area'));

    // Calculate startX and startY relative to the innermost parent area or canvas
    if (parentAreas.length > 0) {
        const innermost = parentAreas[parentAreas.length - 1];
        const innermostRect = innermost.getBoundingClientRect();
        startX = e.clientX - innermostRect.left;
        startY = e.clientY - innermostRect.top;
    } else {
        startX = e.pageX - canvasLeft;
        startY = e.pageY - canvasTop;
    }
}

/**
 * Updates the selection on the canvas or within nested areas while the mouse is moving.
 * @param {Event} e - The mousemove event.
 */
function updateSelection(e) {
    if (!isSelecting) return;

    let selection = document.getElementById('selection');

    if (!selection) {
        selection = document.createElement('div');
        selection.id = 'selection';
        selection.classList.add('selection');
        document.body.appendChild(selection);
    }

    const canvas = document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const canvasLeft = canvasRect.left + window.pageXOffset;
    const canvasTop = canvasRect.top + window.pageYOffset;

    let minX = Math.min(startX, e.pageX - canvasLeft);
    let minY = Math.min(startY, e.pageY - canvasTop);
    let maxX = Math.max(startX, e.pageX - canvasLeft);
    let maxY = Math.max(startY, e.pageY - canvasTop);
    let width = maxX - minX;
    let height = maxY - minY;

    const parentArea = areas.find(area => {
        const areaRect = area.getBoundingClientRect();
        return (
            e.clientX >= areaRect.left &&
            e.clientX <= areaRect.right &&
            e.clientY >= areaRect.top &&
            e.clientY <= areaRect.bottom
        );
    });

    if (parentArea) {
        const areaRect = parentArea.getBoundingClientRect();
        minX = Math.min(startX, e.clientX - areaRect.left);
        minY = Math.min(startY, e.clientY - areaRect.top);
        maxX = Math.max(startX, e.clientX - areaRect.left);
        maxY = Math.max(startY, e.clientY - areaRect.top);
        width = maxX - minX;
        height = maxY - minY;

        selection.style.position = 'absolute';
        selection.style.left = `${minX + areaRect.left}px`;
        selection.style.top = `${minY + areaRect.top}px`;
        selection.style.width = `${width}px`;
        selection.style.height = `${height}px`;
    } else {
        selection.style.position = 'absolute';
        selection.style.left = `${minX + canvasLeft}px`;
        selection.style.top = `${minY + canvasTop}px`;
        selection.style.width = `${width}px`;
        selection.style.height = `${height}px`;
    }
}

/**
 * Ends the selection process on the canvas or within nested areas.
 * @param {Event} e - The mouseup event.
 */
function endSelection(e) {
    if (!isSelecting) return;
    isSelecting = false;

    const selection = document.getElementById('selection');
    if (!selection) return; // Exit the function if the selection element is not found

    // Find all parent areas under the mouse pointer
    const parentAreas = document.elementsFromPoint(e.clientX, e.clientY)
        .filter(elem => elem.classList.contains('area'));

    const width = parseInt(selection.style.width, 10) || 0; // Use 0 as a fallback value
    const height = parseInt(selection.style.height, 10) || 0; // Use 0 as a fallback value
    let left, top;

    if (parentAreas.length > 0) {
        const innermost = parentAreas[parentAreas.length - 1];
        const innermostRect = innermost.getBoundingClientRect();
        left = parseInt(selection.style.left, 10) - innermostRect.left;
        top = parseInt(selection.style.top, 10) - innermostRect.top;
    } else {
        const canvas = document.getElementById('canvas');
        const canvasRect = canvas.getBoundingClientRect();
        const canvasLeft = canvasRect.left + window.pageXOffset;
        const canvasTop = canvasRect.top + window.pageYOffset;
        left = parseInt(selection.style.left, 10) - canvasLeft;
        top = parseInt(selection.style.top, 10) - canvasTop;
    }

    const color = getRandomRGBAColor();
    const area = document.createElement('div');
    area.className = 'area bg-gray-300 rounded-md';
    area.style.width = `${width}px`;
    area.style.height = `${height}px`;
    area.style.left = `${left}px`;
    area.style.top = `${top}px`;
    area.style.backgroundColor = color;
    area.innerHTML = `<span class="area-info">${width}x${height}<br>${left},${top}</span>`;

    // Append the new area to the innermost parent area or the canvas
    if (parentAreas.length > 0) {
        const innermost = parentAreas[parentAreas.length - 1];
        innermost.appendChild(area);
    } else {
        const canvas = document.getElementById('canvas');
        canvas.appendChild(area);
    }

    areas.push(area);

    // Remove the reference to startDragArea, as it is not defined
    // area.addEventListener('mousedown', startDragArea);

    selection.remove();
}

/**
 * Sets the background image of the canvas.
 * @param {File} file - The image file to be set as the background.
 */
function setBackgroundImage(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const bgImageContainer = document.getElementById('bgImageContainer');
            bgImageContainer.style.backgroundImage = `url(${e.target.result})`;
            bgImageContainer.style.backgroundSize = 'contain';
            bgImageContainer.style.backgroundRepeat = 'no-repeat';
            bgImageContainer.style.backgroundPosition = 'center';
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Loads the workflow JSON files.
 */
async function loadWorkflowFiles() {
  try {
    const fourWayResponse = await fetch('4way-conditional-workflow.json');
    const fiveWayResponse = await fetch('5way-conditional-workflow.json');
    const twoWayResponse = await fetch('2way-conditional-workflow.json');
    const threeWayResponse = await fetch('3way-conditional-workflow.json');
    twoWayWorkflowJSON = await twoWayResponse.json();
    threeWayWorkflowJSON = await threeWayResponse.json();
    fourWayWorkflowJSON = await fourWayResponse.json();
    fiveWayWorkflowJSON = await fiveWayResponse.json();
  } catch (error) {
    console.error('Error loading workflow files:', error);
  }
}

/**
 * Call loadWorkflowFiles when the page loads
 */
document.addEventListener('DOMContentLoaded', loadWorkflowFiles);

/**
 * Updates the ConditioningSetArea nodes in the workflow JSON based on the areas on the canvas.
 * @param {Object} workflowJSON - The workflow JSON object.
 * @param {number} numAreas - The number of areas on the canvas.
 */
function updateConditioningSetAreaNodes(workflowJSON, numAreas) {
  const conditioningSetAreaNodes = workflowJSON.nodes.filter(node => node.type === 'ConditioningSetArea');

  for (let i = 0; i < numAreas; i++) {
    const area = areas[i];
    const width = parseInt(area.style.width);
    const height = parseInt(area.style.height);
    const x = parseInt(area.style.left);
    const y = parseInt(area.style.top);

    if (conditioningSetAreaNodes[i]) {
      conditioningSetAreaNodes[i].widgets_values = [width, height, x, y];
    }
  }
}

/**
 * Starts the drag functionality of the floating bar.
 * @param {Event} e - The mousedown event.
 */
function floatingBarDragStart(e) {
    const floatingBar = e.currentTarget;
    if (floatingBar) {
        isDraggingFloatingBar = true;
        floatingBarInitialX = e.clientX - floatingBar.offsetLeft;
        floatingBarInitialY = e.clientY - floatingBar.offsetTop;

        // Capture mousemove event globally
        document.addEventListener('mousemove', floatingBarDrag);
    }
}

/**
 * Handles the drag functionality of the floating bar while the mouse is moving.
 * @param {Event} e - The mousemove event.
 */
function floatingBarDrag(e) {
    if (isDraggingFloatingBar) {
        let newX = e.clientX - floatingBarInitialX;
        let newY = e.clientY - floatingBarInitialY;

        // Get the viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate the maximum allowed position for the floating bar
        const maxX = viewportWidth - floatingBar.offsetWidth;
        const maxY = viewportHeight - floatingBar.offsetHeight;

        // Clamp the new position to stay within the viewport bounds
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        floatingBar.style.left = newX + 'px';
        floatingBar.style.top = newY + 'px';
    }
}

/**
 * Ends the drag functionality of the floating bar.
 */
function floatingBarDragEnd() {
    isDraggingFloatingBar = false;

    // Remove global mousemove event listener
    document.removeEventListener('mousemove', floatingBarDrag);
}

// Event listeners for the canvas and other elements are added when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas element and add event listeners for mousedown, mousemove, and mouseup events.
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', startSelection);
    canvas.addEventListener('mousemove', updateSelection);
    canvas.addEventListener('mouseup', endSelection);

    // Add a mousedown event listener to the bgImageOpacity element to prevent the floating bar from dragging when interacting with the opacity slider.
    document.getElementById('bgImageOpacity').addEventListener('mousedown', function(e) {
      e.stopPropagation();
    });

    // Set the initial canvas size to 1024 x 1024.
    document.getElementById('canvasWidth').value = 1024;
    document.getElementById('canvasHeight').value = 1024;
    setCanvasSize();

    // Add event listeners for mousedown, mousemove, mouseup, and mouseleave events to the floating bar.
    let floatingBar = document.getElementById('floating-bar');
    floatingBar.addEventListener('mousedown', floatingBarDragStart);
    floatingBar.addEventListener('mouseup', floatingBarDragEnd);
    floatingBar.addEventListener('mouseleave', floatingBarDragEnd);
});

/**
 * Sets the size of the canvas.
 */
function setCanvasSize() {
    const canvasWidth = document.getElementById('canvasWidth').value;
    const canvasHeight = document.getElementById('canvasHeight').value;
    const canvas = document.getElementById('canvas');
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
}

/**
 * Handles the drag functionality of an element.
 * @param {Event} e - The mousedown event.
 */
function elementDrag(e) {
    e = e || window.event;
    e.preventDefault(); // Prevent default behavior for all elements

    let clickedElement = e.target;
    if (clickedElement.tagName.toLowerCase() !== 'input') {
        // Only perform dragging logic if the clicked element is not an input field
        if (isDragging) {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, floatingBar);
        }
    }
}

/**
 * Translates an element to a new position.
 * @param {number} xPos - The new x-position.
 * @param {number} yPos - The new y-position.
 * @param {HTMLElement} el - The element to be translated.
 */
function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

/**
 * Adds a new area to the canvas.
 */
function addArea() {
    const areaWidth = document.getElementById('areaWidth').value;
    const areaHeight = document.getElementById('areaHeight').value;
    const areaX = document.getElementById('areaX').value;
    const areaY = document.getElementById('areaY').value;
    const color = getRandomRGBAColor(); // Use the new function to get rgba color

    const area = document.createElement('div');
    area.className = 'area bg-gray-300 rounded-md';
    area.style.width = areaWidth + 'px';
    area.style.height = areaHeight + 'px';
    area.style.left = areaX + 'px';
    area.style.top = areaY + 'px';
    area.style.backgroundColor = color; // Set background color

    // Display width, height, and xy coordinates inside the area
    area.innerHTML = `<span class="area-info">${areaWidth}x${areaHeight}<br>${areaX},${areaY}</span>`;

    const canvas = document.getElementById('canvas');
    canvas.appendChild(area);
    areas.push(area);
}

/**
 * Removes the last added area from the canvas.
 */
function removeArea() {
    const canvas = document.getElementById('canvas');
    if (areas.length > 0) {
        canvas.removeChild(areas.pop());
    }
}

/**
 * Returns a random RGBA color.
 * @returns {string} A string representing a random RGBA color.
 */
function getRandomRGBAColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    // Set alpha value to 0.5
    const a = 0.5;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
