const board = document.querySelector('.Board');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const blue = '#005293';
const yellow = '#FECB00';
const pointRadius = 11;
const pointColor = '#FF0000';
let points = [];
// let points = [
//     {x: 6, y: 7},
//     {x: 18, y: 26},
//     {x: 48, y: 26},
//     {x: 36, y: 7},
// ];

canvas.width = board.clientWidth || board.offsetWidth;
canvas.height = board.clientHeight || board.offsetHeight;


function handleMouseClick(e) {
    // console.log(e, document.body.scrollLeft, document.documentElement.scrollLeft)
    let x = e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    let y = e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    console.log(x,y);
    points.push({
        x: x,
        y: y
    });
    // console.log(points);
    drawPoint(x, y, pointRadius, pointColor);
    if (points.length === 3) {
        drawParallelogram(points);
        canvas.removeEventListener('mousedown', handleMouseClick);
    }
}

canvas.addEventListener('mousedown', handleMouseClick);

function drawParallelogram(points) {
    context.strokeStyle = blue;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(points[1].x, points[1].y);
    context.lineTo(points[2].x, points[2].y);
    points.push({
        x: points[0].x + points[2].x -points[1].x,
        y: points[0].y + points[2].y -points[1].y,
    })
    context.lineTo(points[3].x, points[3].y);
    context.closePath();
    context.lineWidth=3;
    context.stroke();
    let centerX = (points[0].x + points[1].x +points[2].x + points[3].x) / 4
    let centerY = (points[0].y + points[1].y +points[2].y + points[3].y) / 4

    let base = Math.sqrt(Math.pow((points[3].x - points[0].x),2)+Math.pow((points[3].y - [points[0].y]),2));
    let height = (points[0].y - points[1].y);
    let radius = height/2;
    let area = height*base;
    drawCircle(centerX, centerY, radius, yellow);
}

function drawCircle(cx, cy, radius, color) {
    context.strokeStyle=color;
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2, true);
    context.stroke();
}

function drawPoint(cx, cy, radius, color) {
    context.fillStyle = color
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2, true);
    context.fill();
}
// drawParallelogram(points);
console.log(points);
function reset() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points.length = 0;
    canvas.addEventListener('mousedown', handleMouseClick);
}