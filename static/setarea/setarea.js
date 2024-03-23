function startSelection(e) {
    const canvas = document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const canvasLeft = canvasRect.left + window.pageXOffset;
    const canvasTop = canvasRect.top + window.pageYOffset;

    isSelecting = true;
    startX = e.clientX - canvasLeft;
    startY = e.clientY - canvasTop;
}

function updateSelection(e) {
    if (!isSelecting) return;

    const canvas = document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const canvasLeft = canvasRect.left + window.pageXOffset;
    const canvasTop = canvasRect.top + window.pageYOffset;

    const selection = document.getElementById('selection');

    if (!selection) {
        const newSelection = document.createElement('div');
        newSelection.id = 'selection';
        newSelection.classList.add('selection');
        canvas.appendChild(newSelection);
    }

    const minX = Math.min(startX, e.clientX - canvasLeft);
    const minY = Math.min(startY, e.clientY - canvasTop);
    const maxX = Math.max(startX, e.clientX - canvasLeft);
    const maxY = Math.max(startY, e.clientY - canvasTop);
    const width = maxX - minX;
    const height = maxY - minY;

    selection.style.left = `${minX}px`;
    selection.style.top = `${minY}px`;
    selection.style.width = `${width}px`;
    selection.style.height = `${height}px`;
}

function endSelection(e) {
    if (!isSelecting) return;
    isSelecting = false;
    
    const color = getRandomRGBAColor();
    const selection = document.getElementById('selection');
    const width = parseInt(selection.style.width);
    const height = parseInt(selection.style.height);
    const left = parseInt(selection.style.left);
    const top = parseInt(selection.style.top);

    const area = document.createElement('div');
    area.className = 'area bg-gray-300 rounded-md';
    area.style.width = `${width}px`;
    area.style.height = `${height}px`;
    area.style.left = `${left}px`;
    area.style.top = `${top}px`;
    area.style.backgroundColor = color;
    area.innerHTML = `<span class="area-info">${width}x${height}<br>${left},${top}</span>`;
    
    const canvas = document.getElementById('canvas');
    canvas.appendChild(area);
    areas.push(area);

    selection.remove();
}

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

// Load the workflow JSON files
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

// Call loadWorkflowFiles when the page loads
document.addEventListener('DOMContentLoaded', loadWorkflowFiles);

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

let floatingBar = document.getElementById('floating-bar');
let isDraggingFloatingBar = false;
let floatingBarInitialX;
let floatingBarInitialY;

// Define debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce the floatingBarDrag function
const debouncedFloatingBarDrag = debounce(floatingBarDrag, 10);

function floatingBarDragStart(e) {
    const floatingBar = document.getElementById('floating-bar');
    if (floatingBar) {
        isDraggingFloatingBar = true;
        floatingBarInitialX = e.clientX - floatingBar.offsetLeft;
        floatingBarInitialY = e.clientY - floatingBar.offsetTop;

        // Capture mousemove event globally
        document.addEventListener('mousemove', debouncedFloatingBarDrag);
    }
}

function floatingBarDrag(e) {
    if (isDraggingFloatingBar) {
        let newX = e.pageX - floatingBarInitialX;
        let newY = e.pageY - floatingBarInitialY;

        floatingBar.style.left = newX + 'px';
        floatingBar.style.top = newY + 'px';
    }
}

function floatingBarDragEnd() {
    isDraggingFloatingBar = false;

    // Remove global mousemove event listener
    document.removeEventListener('mousemove', debouncedFloatingBarDrag);
}

let areas = [];
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let isSelecting = false;
let startX;
let startY;

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', startSelection);
    canvas.addEventListener('mousemove', updateSelection);
    canvas.addEventListener('mouseup', endSelection);

    document.getElementById('bgImageOpacity').addEventListener('mousedown', function(e) {
      // Prevent floating bar dragging when interacting with the opacity slider
      e.stopPropagation();
    });

    // Set the initial canvas size to 1024 x 1024
    document.getElementById('canvasWidth').value = 1024;
    document.getElementById('canvasHeight').value = 1024;
    setCanvasSize();

    // Your code here
    let floatingBar = document.getElementById('floating-bar');
    floatingBar.addEventListener('mousedown', floatingBarDragStart);
    floatingBar.addEventListener('mousemove', floatingBarDrag);
    floatingBar.addEventListener('mouseup', floatingBarDragEnd);
    floatingBar.addEventListener('mouseleave', floatingBarDragEnd);
});

function setCanvasSize() {
    const canvasWidth = document.getElementById('canvasWidth').value;
    const canvasHeight = document.getElementById('canvasHeight').value;
    const canvas = document.getElementById('canvas');
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
}

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

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

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


function removeArea() {
    const canvas = document.getElementById('canvas');
    if (areas.length > 0) {
        canvas.removeChild(areas.pop());
    }
}

function getRandomRGBAColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    // Set alpha value to 0.5
    const a = 0.5;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
