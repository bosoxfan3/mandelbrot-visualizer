const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const form = document.getElementById('form');

function getIsBounded(x, y) {
    let zReal = 0;
    let zImaginary = 0;

    for (let i = 0; i < 100; i++) {
        const tempZReal = zReal * zReal - zImaginary * zImaginary + x;
        const tempZImaginary = 2 * zReal * zImaginary + y;

        zReal = tempZReal;
        zImaginary = tempZImaginary;

        const magnitude = Math.sqrt(zReal * zReal + zImaginary * zImaginary);

        // if the magnitude is over two it is virtually guaranteed to be boundless
        if (magnitude > 2) {
            return false;
        }
    }

    return true;
}

function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

async function fillInGrid(xCanvas, yCanvas, xResolution, yResolution) {
    ctx.imageSmoothingEnabled = false;

    // dividing 4 by the resolution value because difference of -2 and 2 is 4
    // if the range was different we couldn't just hardcode in 4s and 2s below
    const xIncrement = 4 / xResolution;
    const yIncrement = 4 / yResolution;

    for (let i = -2; i <= 2; i += xIncrement) {
        for (let j = -2; j <= 2; j += yIncrement) {
            const isBounded = getIsBounded(i, j);
            ctx.fillStyle = isBounded ? 'lightblue' : 'black';

            // The HTML canvas (0,0) is the top-left corner, but we want (i=0, j=0) to be in the middle of the canvas.
            // The +2 shifts the range from [-2, 2] to [0, 4], making it easier to get a ratio to place the pixel in the grid.
            // Then we divide by the total range (4), giving us a ratio, and multiply by the canvas size to get pixel coordinates.

            // Math.floor ensures staying within the canvas boundaries
            const xValue = Math.floor(((i + 2) / 4) * xCanvas);
            const yValue = Math.floor(((j + 2) / 4) * yCanvas);

            // use Math.ceil here to avoid having whitespace between grid cells
            const fillWidth = Math.ceil(xCanvas / xResolution);
            const fillHeight = Math.ceil(yCanvas / yResolution);

            ctx.fillRect(xValue, yValue, fillWidth, fillHeight);
        }
        // use a delay so you don't overload the browser as it tries to render the grid
        await delay(0);
    }
}

window.onload = function () {
    fillInGrid(500, 500, 500, 500);
};

function changeSizeAndResolution(e) {
    e.preventDefault();

    const xCanvas = Number(e.target.xCanvas.value);
    const yCanvas = Number(e.target.yCanvas.value);
    const xResolution = Number(e.target.xResolution.value);
    const yResolution = Number(e.target.yResolution.value);

    // resizes the html canvas
    canvas.width = xCanvas;
    canvas.height = yCanvas;

    fillInGrid(xCanvas, yCanvas, xResolution, yResolution);
}

form.addEventListener('submit', changeSizeAndResolution);
