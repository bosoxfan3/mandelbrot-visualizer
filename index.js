const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

function getIsBounded(x, y) {
    let zReal = 0;
    let zImaginary = 0;

    for (let i = 0; i < 100; i++) {
        const tempZReal = zReal * zReal - zImaginary * zImaginary + x;
        const tempZImaginary = 2 * zReal * zImaginary + y;

        zReal = tempZReal;
        zImaginary = tempZImaginary;

        const magnitude = Math.sqrt(zReal * zReal + zImaginary * zImaginary);
        if (magnitude > 2) {
            return false;
        }
    }

    return true;
}

function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

window.onload = async function () {
    for (let i = -2; i <= 2; i += 0.01) {
        for (let j = -2; j <= 2; j += 0.01) {
            const isBounded = getIsBounded(i, j);
            ctx.fillStyle = isBounded ? 'lightblue' : 'black';
            ctx.fillRect(
                Math.floor(((i + 2) / 4) * 500),
                Math.floor(((j + 2) / 4) * 500),
                1,
                1
            );
        }
        await delay(0);
    }
};
