// Pattern Generation Code
const canvas = document.getElementById("patternCanvas");
const ctx = canvas.getContext("2d");

// Set the canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;
}

// Generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Draw a random pattern
function drawPattern() {
    const patternSize = 50;
    for (let x = 0; x < canvas.width; x += patternSize) {
        for (let y = 0; y < canvas.height; y += patternSize) {
            ctx.fillStyle = getRandomColor();
            ctx.fillRect(x, y, patternSize, patternSize);
        }
    }
}

// Initial setup
resizeCanvas();
drawPattern();

// Redraw the pattern on resize
window.addEventListener('resize', () => {
    resizeCanvas();
    drawPattern();
});
