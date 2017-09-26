{
    // Genetal vars
    const board = document.querySelector('.Board');
    const resetButton = document.querySelector('.Button--reset');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const blue = '#005293';
    const yellow = '#FECB00';
    const pointRadius = 5.5;
    const pointColor = '#FF0000';

    // Vars for calc
    let centerX = null;
    let centerY = null;
    let base = null;
    let AC = null;
    let BD = null;
    let area = null;
    let height = null;
    let radius = null;

    //Var for Info
    const info = {
        points: []
    };

    // Vars for draggable elements
    let dragging = false;
    let selection = null;
    let dragoffx = 0;
    let dragoffy = 0;
    let updatePoint = null;

    // SetUp Board
    canvas.width = board.clientWidth || board.offsetWidth;
    canvas.height = board.clientHeight || board.offsetHeight;

    // Check if click coordnates contain a dot
    Object.prototype.contains = function(mx, my) {
        return (this.x <= mx) && (this.x + pointRadius*2 >= mx) && (this.y <= my) && (this.y + pointRadius*2 >= my);
    };

    // User Interaction
    // Gets the mouse position acording to the event it was called
    const getMouse = (e) => {
        let x = e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        let y = e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop;

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;

        return {x: x, y: y};
    };

    // Call the mouse position, verify how many dots are in the screen, call the dots/parallelogram draw function. Manage events
    const handleMouseClick = (e) => {
        const position = getMouse(e);
        info.points.push({
            x: position.x,
            y:position.y,
        });

        drawPoint(position.x, position.y, pointRadius, pointColor);
        context.fillText(info.points.length, position.x, position.y-15, 80);

        if (info.points.length === 3) {
            drawParallelogram(info.points);
            canvas.removeEventListener('mousedown', handleMouseClick);
            canvas.addEventListener('mousedown', mouseDown, true);
            canvas.addEventListener('mousemove', mouseMove, true);
            canvas.addEventListener('mouseup', mouseUp, true);
        }
    };

    // get the initial click moment and check it this click is on a dot
    const mouseDown = (e) => {
        var mouse = getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var shapes = info.points;
        var l = shapes.length;
        for (var i = l-2; i >= 0; i--) {

            if (shapes[i].contains(mx, my)) {
                var mySel = shapes[i];
                updatePoint = i;
                dragoffx = mx - mySel.x;
                dragoffy = my - mySel.y;
                dragging = true;
                selection = mySel;
                return;
            }
        }

        if (selection) {
            selection = null;
        }
    };

    // get the mouse movement and call function to update the coordinates
    const mouseMove = (e) => {
        if (dragging) {

            context.clearRect(0, 0, canvas.width, canvas.height);
            var mouse = getMouse(e);

            selection.x = mouse.x - dragoffx;
            selection.y = mouse.y - dragoffy;

            updateView(selection, updatePoint);
        }
    };

    // stop view updates
    const mouseUp = (e) => {
        dragging = false;
    };

    // redraw everything into the canvas accordingly user's drag movement, clear and update the information
    const updateView = (newPoint, index) => {
        clearInfo();
        info.points[index] = newPoint;

        for(let i = 0; i < info.points.length - 1; i++) {
            drawPoint(info.points[i].x, info.points[i].y, pointRadius, pointColor);
            context.fillText(i + 1, info.points[i].x, info.points[i].y-15, 80);
        }

        context.strokeStyle = blue;
        context.beginPath();
        context.moveTo(info.points[0].x, info.points[0].y);
        context.lineTo(info.points[1].x, info.points[1].y);
        context.lineTo(info.points[2].x, info.points[2].y);
        context.lineTo(info.points[3].x, info.points[3].y);
        context.closePath();
        context.lineWidth=3;
        context.stroke();

        info.parallelogram = createInfo(info.points);
        drawCircle(info.parallelogram.centerX, info.parallelogram.centerY, info.parallelogram.radius, yellow);

    };

    // Draw
    const drawParallelogram = (points) => {
        points.push({
            x: points[0].x + points[2].x -points[1].x,
            y: points[0].y + points[2].y -points[1].y,
        });

        context.strokeStyle = blue;
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.lineTo(points[2].x, points[2].y);
        context.lineTo(points[3].x, points[3].y);
        context.closePath();
        context.lineWidth=3;
        context.stroke();

        info.parallelogram = createInfo(info.points);
        drawCircle(info.parallelogram.centerX, info.parallelogram.centerY, info.parallelogram.radius, yellow);
    };

    const drawCircle = (cx, cy, radius, color) => {
        context.strokeStyle=color;
        context.beginPath();
        context.arc(cx, cy, radius, 0, Math.PI * 2, true);
        context.stroke();
        info.circle = {
            area: (Math.PI*Math.pow(radius,2)).toFixed(),
        };
        
        showInfo(info);
    };

    const drawPoint = (cx, cy, radius, color) => {
        context.fillStyle = color;
        context.beginPath();
        context.arc(cx, cy, radius, 0, Math.PI * 2, true);
        context.fill();
    };

    // Info
    const createInfo = (points) => {
        centerX = (points[0].x + points[1].x +points[2].x + points[3].x) / 4;
        centerY = (points[0].y + points[1].y +points[2].y + points[3].y) / 4;
        base = Math.max(Math.sqrt(Math.pow((points[3].x - points[0].x), 2)+Math.pow((points[3].y - [points[0].y]), 2)), Math.sqrt(Math.pow((points[1].x - points[0].x), 2)+Math.pow((points[1].y - [points[0].y]), 2)));
        AC = Math.sqrt(Math.pow((points[3].x - points[0].x),2)+Math.pow((points[3].y - [points[0].y]),2));
        BD = Math.sqrt(Math.pow((points[2].x - points[1].x),2)+Math.pow((points[2].y - [points[1].y]),2));
        area = ((AC * BD)/2).toFixed();
        height = area/base;
        radius = (height/2).toFixed();
        return {
            centerX: centerX,
            centerY: centerY,
            base: base,
            AC: AC,
            BD: BD,
            area: area,
            height: height,
            radius: radius,
        };
    };

    const showInfo = () => {
        document.querySelector('.Info-content--pointOne').textContent = `${info.points[0].x}, ${info.points[0].y}`;
        document.querySelector('.Info-content--pointTwo').textContent = `${info.points[1].x}, ${info.points[1].y}`;
        document.querySelector('.Info-content--pointThree').textContent = `${info.points[2].x}, ${info.points[2].y}`;
        document.querySelector('.Info-content--parallelogramArea').textContent += ` ${info.parallelogram.area}`;
        document.querySelector('.Info-content--circleArea').textContent += ` ${info.circle.area}`;
        document.querySelector('.Info-none').classList.add('u-hidden');
        document.querySelector('.Info-content').classList.remove('u-hidden');
    };

    const clearInfo = () => {
        document.querySelector('.Info-none').classList.remove('u-hidden');
        document.querySelector('.Info-content').classList.add('u-hidden');
        document.querySelector('.Info-content--pointOne').textContent = '';
        document.querySelector('.Info-content--pointTwo').textContent = '';
        document.querySelector('.Info-content--pointThree').textContent = '';
        document.querySelector('.Info-content--parallelogramArea').textContent = 'Parallelogram: ';
        document.querySelector('.Info-content--circleArea').textContent = 'Circle: ';
    };

    // Reset
    const resetBoard = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        info.points.length = 0;
        delete info.parallelogram;
        delete info.circle;
        clearInfo();
        canvas.removeEventListener('mousedown', mouseDown, true);
        canvas.removeEventListener('mousemove', mouseMove, true);
        canvas.removeEventListener('mouseup', mouseUp, true);
        canvas.addEventListener('mousedown', handleMouseClick);

    };

    canvas.addEventListener('mousedown', handleMouseClick);
    resetButton.addEventListener('mousedown', resetBoard);
}