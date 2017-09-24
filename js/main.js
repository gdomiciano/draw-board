const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const blue = '#005293';
const yellow = '#FECB00';
let points = [
    { x: 2, y: 145 },
    { x: 81, y: 2 },
    { x: 235, y: 2 },
];

const drawParallelogram = (points) => {
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

    var centerX = (points[0].x + points[1].x +points[2].x + points[3].x) / 4
    var centerY = (points[0].y + points[1].y +points[2].y + points[3].y) / 4
    context.closePath();
    context.lineWidth=3;
    context.stroke();
    console.log(context);
    drawCircle(centerX, centerY);
}

const drawCircle = (cx, cy) => {
    context.strokeStyle=yellow;

    context.beginPath();
    context.arc(cx, cy, 10, 0, Math.PI * 2, true);
    context.stroke();

}
drawParallelogram(points);
console.log(points);