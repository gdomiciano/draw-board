const board = document.querySelector('.Board');
const resetButton = document.querySelector('.Reset');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const blue = '#005293';
const yellow = '#FECB00';
const pointRadius = 5.5;
const pointColor = '#FF0000';
const info = {
    points: []
};
let parallelogramInfo = {};
let circleInfo = {};
// **** Keep track of state! ****

let valid = false; // when set to false, the canvas will redraw everything
const shapes = [];  // the collection of things to be drawn
let dragging = false; // Keep track of when we are dragging
// the current selected object. In the future we could turn const into an array for multiple selection
let selection = null;
let dragoffx = 0; // See mousedown and mousemove events for explanation
let dragoffy = 0;
let updatePoint = null

//All ABout initial setups
canvas.width = board.clientWidth || board.offsetWidth;
canvas.height = board.clientHeight || board.offsetHeight;

// All About handleing events
const getMouse = (e) => {
    let x = e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    let y = e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    // console.log(x,y)
    return {x: x, y: y};
}

const  handleMouseClick = (e) => {
    const position = getMouse(e)
    info.points.push({
        x: position.x,
        y:position.y,
    });

    drawPoint(position.x, position.y, pointRadius, pointColor);
    context.fillText(info.points.length, position.x, position.y-25, 80);
    if (info.points.length === 3) {
        console.log(info);
        drawParallelogram(info.points);
        canvas.removeEventListener('mousedown', handleMouseClick);
        // Up, down, and move are for dragging
        canvas.addEventListener('mousedown', mouseDown, true);
        canvas.addEventListener('mousemove', mouseMove, true);
        canvas.addEventListener('mouseup', mouseUp, true);
    }
}

Object.prototype.contains = function(mx, my, i) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Width) and its Y and (Y + Height)
    console.log('return', (this.x <= mx) && (this.x + pointRadius*2 >= mx) && (this.y <= my) && (this.y + pointRadius*2 >= my));
    return (this.x <= mx) && (this.x + pointRadius*2 >= mx) && (this.y <= my) && (this.y + pointRadius*2 >= my);
}
const mouseDown = (e) => {
    console.log('got mouse down event', e)
    var mouse = getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var shapes = info.points;
    var l = shapes.length;
    for (var i = l-2; i >= 0; i--) {
        // console.log(shapes[i]);
        if (shapes[i].contains(mx, my, i)) {
            var mySel = shapes[i];
            // Keep track of where in the object we clicked
            // so we can move it smoothly (see mousemove)
            updatePoint = i;
            dragoffx = mx - mySel.x;
            dragoffy = my - mySel.y;
            dragging = true;
            selection = mySel;
            valid = false;
            return;
        }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (selection) {
        selection = null;
        valid = false; // Need to clear the old selection border
    }
}
const mouseMove = (e) => {
    // console.log('got mouse move event', e)

    if (dragging){

    context.clearRect(0, 0, canvas.width, canvas.height);
        var mouse = getMouse(e);
        // We don't want to drag the object by its top-left corner, we want to drag it
        // from where we clicked. Thats why we saved the offset and use it here
        selection.x = mouse.x - dragoffx;
        selection.y = mouse.y - dragoffy;
        console.log('selection', selection);
        updateView(selection, updatePoint);
        valid = false; // Something's dragging so we must redraw
    }

}
const mouseUp = (e) => {
    // console.log('got mouse up event', e)
    dragging = false;
}

// All about drawing
function updateView(newPoint, index){
    info.points[index] = newPoint;

    context.strokeStyle = blue;
    context.beginPath();
    context.moveTo(info.points[0].x, info.points[0].y);
    context.lineTo(info.points[1].x, info.points[1].y);
    context.lineTo(info.points[2].x, info.points[2].y);
    context.lineTo(info.points[3].x, info.points[3].y);
    context.closePath();
    context.lineWidth=3;
    context.stroke();
}

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
    
    // this.shapes.push(shape);
    // this.valid = false;
}

// All about show info
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

// All About Reset

function resetBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearInfo();
    canvas.removeEventListener('mousedown', mouseDown, true);
    canvas.removeEventListener('mousemove', mouseMove, true);
    canvas.removeEventListener('mouseup', mouseUp, true);
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

//Add event listeners
canvas.addEventListener('mousedown', handleMouseClick);
resetButton.addEventListener('mousedown', resetBoard);