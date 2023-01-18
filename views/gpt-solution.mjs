const canvas = document.getElementById('sticker_field');
const ctx = canvas.getContext('2d');
let img = GIF();

// img.src = 'path/to/your/gif.gif';

img.src = 'https://storage.cobak.co/uploads/1585038492476558_8eeec6050c.gif';
img.onload = function () {
    ctx.drawImage(img, 0, 0);
};

let dragging = false;
let offsetX, offsetY;

canvas.addEventListener('mousedown', function (e) {
    dragging = true;
    offsetX = e.clientX - img.x;
    offsetY = e.clientY - img.y;
});

canvas.addEventListener('mousemove', function (e) {
    if (dragging) {
        img.x = e.clientX - offsetX;
        img.y = e.clientY - offsetY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, img.x, img.y);
    }
});

canvas.addEventListener('mouseup', function () {
    dragging = false;
});
