const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const dvdLogo = document.getElementById('dvd-logo');
const logoPath = document.getElementById('logo-path');

// Set canvas size to match window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initial position and speed
let x = canvas.width / 2 - 100; // Adjust for logo size
let y = canvas.height / 2 - 50; // Adjust for logo size
let dx = 2;
let dy = 2;

let showVector = false;

// Function to draw an arrow from (x1, y1) to (x2, y2)
function drawArrow(x1, y1, x2, y2) {
  const headlen = 10; // Length of head in pixels
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
}

function getRandomColor() {
  // Generate a random color in RGB format
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to draw an arrow from (x1, y1) to (x2, y2)
function drawArrow(x1, y1, x2, y2) {
  const headlen = 20; // Length of head in pixels, increased for a longer arrow
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bounce off the walls
  if (x + 200 + dx > canvas.width || x + dx < 0) { // Adjust for logo size
    dx = -dx;
    logoPath.setAttribute('fill', getRandomColor());
  }
  if (y + 100 + dy > canvas.height || y + dy < 0) { // Adjust for logo size
    dy = -dy;
    logoPath.setAttribute('fill', getRandomColor());
  }

  // Move the logo
  x += dx;
  y += dy;
  dvdLogo.style.left = `${x}px`;
  dvdLogo.style.top = `${y}px`;

  // Draw the vector if showVector is true
  if (showVector) {
    ctx.beginPath();
    drawArrow(x + 100, y + 50, x + 100 + dx * 40, y + 50 + dy * 40); // Start from the middle of the logo and multiply dx and dy by 40 for a longer arrow
    ctx.strokeStyle = 'white'; // Color of the vector
    ctx.lineWidth = 2; // Width of the vector
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}

// Start animation
requestAnimationFrame(draw);

// Toggle showVector when the 'v' key is pressed
window.addEventListener('keydown', function(event) {
  if (event.key === 'v') {
    showVector = !showVector;
  }
});

// Update canvas size if window is resized
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
