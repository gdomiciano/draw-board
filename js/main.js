const board = document.querySelector('.Board');
const resetButton = document.querySelector('.Reset');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const blue = '#005293';
const yellow = '#FECB00';
const pointRadius = 11;
const pointColor = '#FF0000';
const info = {
    points: []
};
let parallelogramInfo = {};
let circleInfo = {};

canvas.width = board.clientWidth || board.offsetWidth;
canvas.height = board.clientHeight || board.offsetHeight;

const  handleMouseClick = (e) => {
    let x = e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    let y = e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    info.points.push({
        x: x,
        y: y
    });

    drawPoint(x, y, pointRadius, pointColor);
    context.fillText(info.points.length, x, y-25, 80);
    if (info.points.length === 3) {
        console.log(info);
        drawParallelogram(info.points);
        canvas.removeEventListener('mousedown', handleMouseClick);
    }
}

canvas.addEventListener('mousedown', handleMouseClick);
resetButton.addEventListener('mousedown', resetBoard);

function drawParallelogram(points) {
    console.log(points)
    points.push({
        x: points[0].x + points[2].x -points[1].x,
        y: points[0].y + points[2].y -points[1].y,
    });
    const centerX = (points[0].x + points[1].x +points[2].x + points[3].x) / 4;
    const centerY = (points[0].y + points[1].y +points[2].y + points[3].y) / 4;
    // const // base = Math.sqrt(Math.pow((points[1].x - points[0].x),2)+Math.pow((points[1].y - [points[0].y]),2));
    // const // base = Math.sqrt(Math.pow((points[3].x - points[0].x),2)+Math.pow((points[3].y - [points[0].y]),2));
    const base = Math.max(Math.sqrt(Math.pow((points[3].x - points[0].x), 2)+Math.pow((points[3].y - [points[0].y]), 2)), Math.sqrt(Math.pow((points[1].x - points[0].x), 2)+Math.pow((points[1].y - [points[0].y]), 2)));
    const AC = Math.sqrt(Math.pow((points[3].x - points[0].x),2)+Math.pow((points[3].y - [points[0].y]),2));
    const BD = Math.sqrt(Math.pow((points[2].x - points[1].x),2)+Math.pow((points[2].y - [points[1].y]),2));
    const area = (AC * BD)/2;
    const height = area/base;
    const radius = (height/2).toFixed();

    context.strokeStyle = blue;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(points[1].x, points[1].y);
    context.lineTo(points[2].x, points[2].y);
    context.lineTo(points[3].x, points[3].y);
    context.closePath();
    context.lineWidth=3;
    context.stroke();

    info.parallelogram = {
        area: area.toFixed(),
    }
    // console.log(area);
    drawCircle(centerX, centerY, radius, yellow);
}

function drawCircle(cx, cy, radius, color) {
    context.strokeStyle=color;
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2, true);
    context.stroke();
    console.log(radius);
    info.circle = {
        area: (Math.PI*Math.pow(radius,2)).toFixed(),
    };
    showInfo(info);
}

function drawPoint(cx, cy, radius, color) {
    context.fillStyle = color
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2, true);
    context.fill();
}

function showInfo(){
    console.log(info)
    document.querySelector('.Info-content--pointOne').textContent = `${info.points[0].x}, ${info.points[0].y}`;
    document.querySelector('.Info-content--pointTwo').textContent = `${info.points[1].x}, ${info.points[1].y}`;
    document.querySelector('.Info-content--pointThree').textContent = `${info.points[2].x}, ${info.points[2].y}`;
    document.querySelector('.Info-content--parallelogramArea').textContent += ` ${info.parallelogram.area}`;
    document.querySelector('.Info-content--circleArea').textContent += ` ${info.circle.area}`;
    document.querySelector('.Info-none').classList.add('u-hidden');
    document.querySelector('.Info-content').classList.remove('u-hidden');
}


function resetBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearInfo();
    canvas.addEventListener('mousedown', handleMouseClick);
}


function clearInfo(){

    document.querySelector('.Info-none').classList.remove('u-hidden');
    document.querySelector('.Info-content').classList.add('u-hidden');
    console.log(info.points);
    info.points.length = 0;
    delete info.parallelogram;
    delete info.circle;
    console.log(info)
    document.querySelector('.Info-content--pointOne').textContent = '';
    document.querySelector('.Info-content--pointTwo').textContent = '';
    document.querySelector('.Info-content--pointThree').textContent = '';
    document.querySelector('.Info-content--parallelogramArea').textContent = 'Parallelogram: ';
    document.querySelector('.Info-content--circleArea').textContent = 'Circle: ';
}
