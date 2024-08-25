// tetris_python.js

window.onload = function() {
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas width to match the container's width
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 100;  // You can adjust the height if needed

    const blockSize = 5;  // Size of each "Tetris block"
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF1', '#FFF333'];  // Array of colors for each block
    let offsetX = 0;  // Horizontal offset for animation
    let direction = -1;  // 1 for right, -1 for left
    const speed = 0.1;  // Adjust this value to control the speed

    // Tetris-style representation of "PYTHON MORE!" (simplified)
    const pythonShape = [
        "####  #   #  ######  #  #    ##    #   #   #    #     ##    ####  ####  #",
        "#  #   # #      #    #  #   #  #  # #  #  # #  ##    #  #   #  #  #     #",
        "####    #       #    ####   #  #  #  # #  #  ##  #   #  #   ####  ####  #",
        "#       #       #    #  #   #  #  #   ##  #   #  #   #  #   #  #  #      ",
        "#       #       #    #  #    ##   #    #  #   #   #   ##    #   # ####  #"
    ];

    function drawTetrisText() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pythonShape.forEach((row, y) => {
            row.split('').forEach((block, x) => {
                if (block !== ' ') {
                    ctx.fillStyle = colors[(x + y) % colors.length];
                    const posX = (x + offsetX) * blockSize;
                    const posY = y * blockSize;

                    // Wrap around logic to make text continuous
                    const wrappedX = (posX % canvas.width + canvas.width) % canvas.width;
                    ctx.fillRect(wrappedX, posY, blockSize, blockSize);
                    ctx.strokeRect(wrappedX, posY, blockSize, blockSize);
                }
            });
        });
    }

    function updateAnimation() {
        offsetX += direction * speed;

        // Reverse direction if the text reaches the edge of the canvas
        // if (offsetX > canvas.width / blockSize || offsetX < -pythonShape[0].length) {
        //     direction *= -1;
        // }

        drawTetrisText();
        requestAnimationFrame(updateAnimation);  // Continue animation
    }

    updateAnimation();  // Start the animation
};
