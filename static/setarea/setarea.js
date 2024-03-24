/**
 * This JavaScript file contains functions for creating, updating, and exporting areas on a canvas.
 * It also includes functions for setting the background image of the canvas, loading workflow files,
 * and handling the drag functionality of a floating bar.
 */

/**
 * Starts the selection process on the canvas.
 * @param {Event} e - The mousedown event.
 */
function startSelection(e) {
    const canvas = document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const canvasLeft = canvasRect.left + window.pageXOffset;
    const canvasTop = canvasRect.top + window.pageYOffset;

    isSelecting = true;
    startX = e.pageX - canvasLeft;
    startY = e.pageY - canvasTop;
}

/**
 * Updates the selection on the canvas while the mouse is moving.
 * @param {Event} e - The mousemove event.
 */
function updateSelection(e) {
    if (!isSelecting) return;

    const canvas = document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const canvasLeft = canvasRect.left + window.pageXOffset;
    const canvasTop = canvasRect.top + window.pageYOffset;

    let selection = document.getElementById('selection');

    if (!selection) {
        selection = document.createElement('div');
        selection.id = 'selection';
        selection.classList.add('selection');
        document.body.appendChild(selection);
    }

    const minX = Math.min(startX, e.pageX - canvasLeft);
    const minY = Math.min(startY, e.pageY - canvasTop);
    const maxX = Math.max(startX, e.pageX - canvasLeft);
    const maxY = Math.max(startY, e.pageY - canvasTop);
    const width = maxX - minX;
    const height = maxY - minY;

    selection.style.position = 'absolute';
    selection.style.left = `${minX + canvasLeft}px`;
    selection.style.top = `${minY + canvasTop}px`;
    selection.style.width = `${width}px`;
    selection.style.height = `${height}px`;
}

/**
 * Ends the selection process on the canvas.
 * @param {Event} e - The mouseup event.
 */
function endSelection(e) {
    if (!isSelecting) return;
    isSelecting = false;

    const canvas = document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const canvasLeft = canvasRect.left + window.pageXOffset;
    const canvasTop = canvasRect.top + window.pageYOffset;

    const selection = document.getElementById('selection');
    const width = parseInt(selection.style.width);
    const height = parseInt(selection.style.height);
    const left = parseInt(selection.style.left) - canvasLeft;
    const top = parseInt(selection.style.top) - canvasTop;

    const color = getRandomRGBAColor();
    const area = document.createElement('div');
    area.className = 'area bg-gray-300 rounded-md';
    area.style.width = `${width}px`;
    area.style.height = `${height}px`;
    area.style.left = `${left}px`;
    area.style.top = `${top}px`;
    area.style.backgroundColor = color;
    area.innerHTML = `<span class="area-info">${width}x${height}<br>${left},${top}</span>`;

    canvas.appendChild(area);
    areas.push(area);

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
let twoWayWorkflowJSON, threeWayWorkflowJSON;

async function loadWorkflowFiles() {
  try {
    const twoWayResponse = await fetch('2way-conditional-workflow.json');
    const threeWayResponse = await fetch('3way-conditional-workflow.json');
    twoWayWorkflowJSON = await twoWayResponse.json();
    threeWayWorkflowJSON = await threeWayResponse.json();
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
 * Exports the areas on the canvas to a workflow.
 */
function exportToWorkflow() {
  const numAreas = areas.length;
  if (numAreas === 2 || numAreas === 3) {
    const workflowJSON = numAreas === 2 ? { ...twoWayWorkflowJSON } : { ...threeWayWorkflowJSON };
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
    alert("Please select 2 or 3 areas to export.");
  }
}

// Get the floating bar element.
let floatingBar = document.getElementById('floating-bar');

// A flag to indicate whether the user is currently dragging the floating bar.
let isDraggingFloatingBar = false;

// The initial x-coordinate of the mouse when the user starts dragging the floating bar.
let floatingBarInitialX;

// The initial y-coordinate of the mouse when the user starts dragging the floating bar.
let floatingBarInitialY;

/**
 * Starts the drag functionality of the floating bar.
 * @param {Event} e - The mousedown event.
 */
function floatingBarDragStart(e) {
    const floatingBar = document.getElementById('floating-bar');
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
        let newX = e.pageX - floatingBarInitialX;
        let newY = e.pageY - floatingBarInitialY;

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

// Variables for storing the state of the canvas and the selection process.
let areas = []; // An array to store the areas on the canvas.
let isDragging = false; // A flag to indicate whether the user is currently dragging the mouse.
let currentX; // The current x-coordinate of the mouse.
let currentY; // The current y-coordinate of the mouse.
let initialX; // The initial x-coordinate of the mouse when the user starts dragging.
let initialY; // The initial y-coordinate of the mouse when the user starts dragging.
let xOffset = 0; // The x-offset of the mouse from the initial x-coordinate.
let yOffset = 0; // The y-offset of the mouse from the initial y-coordinate.
let isSelecting = false; // A flag to indicate whether the user is currently selecting an area on the canvas.
let startX; // The x-coordinate of the mouse when the user starts selecting an area.
let startY; // The y-coordinate of the mouse when the user starts selecting an area.

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
