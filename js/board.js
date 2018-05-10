{
    class Shape {
        constructor(color, position) {
            // code
            this.color = color;
            this.position = position;
        }

        get area() { return this.calcArea() };
        get shapeInfo() { return this.defineShapeInfo() };

        drawShape() {}
        calcArea() { return 0 };
        defineShapeInfo() { return {} };
    }

    class Parallelogram extends Shape {
        drawShape() {
            const points = this.position.points
            if (points.length === 3) {
                points.push({
                    x: points[0].x + points[2].x - points[1].x,
                    y: points[0].y + points[2].y - points[1].y,
                });
            }

            context.strokeStyle = this.color;
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[1].x, points[1].y);
            context.lineTo(points[2].x, points[2].y);
            context.lineTo(points[3].x, points[3].y);
            context.closePath();
            context.lineWidth = 3;
            context.stroke();
        };

        calcArea() {
            const points = this.position.points;
            const AC = Math.sqrt(Math.pow((points[3].x - points[0].x), 2) + Math.pow((points[3].y - [points[0].y]), 2));
            const BD = Math.sqrt(Math.pow((points[2].x - points[1].x), 2) + Math.pow((points[2].y - [points[1].y]), 2));
            const area = ((AC * BD)/2).toFixed();
            return area;
        };

        defineShapeInfo() {
            const points = this.position.points;
            const centerX = (points[0].x + points[1].x + points[2].x + points[3].x) / 4;
            const centerY = (points[0].y + points[1].y + points[2].y + points[3].y) / 4;
            const base = Math.max(Math.sqrt(Math.pow((points[3].x - points[0].x), 2) + Math.pow((points[3].y - [points[0].y]), 2)), Math.sqrt(Math.pow((points[1].x - points[0].x), 2) + Math.pow((points[1].y - [points[0].y]), 2)));
            const area = this.calcArea();
            const height = area / base;
            const radius = (height / 2).toFixed();

            return {
                center: {
                    x: centerX,
                    y: centerY,
                },
                base,
                area,
                height,
                radius,
                points,
            };
        };
    };

    class Circle extends Shape {
        constructor(color, position, size, stroke, fill) {
            super(color, position);
            this.radius = size;
            this.stroke = stroke;
            this.fill = fill;
        };

        drawShape() {
            context.beginPath();
            context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);

            if (this.stroke) {
                context.strokeStyle = this.color;
                context.lineWidth = 3;
                context.stroke();
            }

            if (this.fill) {
                context.fillStyle = this.color;
                context.fill();
            }
        };

        defineShapeInfo() {
            return { area: this.calcArea() };
        };

        calcArea() {
            return (Math.PI * Math.pow(this.radius, 2)).toFixed();
        };
    };

    class Info {
        constructor(info) {
            this.info = info;
        }

        render() {
            const pointElements = document.querySelectorAll('.Info-content--point');
            const parallelogramPoints = this.info.parallelogram.points;
            const parallelogram = this.info.parallelogram;
            const circle = this.info.circle;

            pointElements.forEach((pointEl, i) => pointEl.textContent = `${ parallelogramPoints[i].x }, ${ parallelogramPoints[i].y }`);

            document.querySelector('.Info-content--parallelogramArea').textContent = `Parallelogram: ${ parallelogram.area }`;
            document.querySelector('.Info-content--circleArea').textContent = `Circle: ${ circle.area }`;
            document.querySelector('.Info-none').classList.add('u-hidden');
            document.querySelector('.Info-content').classList.remove('u-hidden');
        }

        clear() {
            document.querySelector('.Info-none').classList.remove('u-hidden');
            document.querySelector('.Info-content').classList.add('u-hidden');
            document.querySelector('.Info-content--point').textContent = '';
            document.querySelector('.Info-content--parallelogramArea').textContent = 'Parallelogram: ';
            document.querySelector('.Info-content--circleArea').textContent = 'Circle: ';
        }
    }

    Object.prototype.containDot = function(mouseX, mouseY) {
        return (this.x <= mouseX) && (this.x + dotRadius * 2 >= mouseX) && (this.y <= mouseY) && (this.y + dotRadius * 2 >= mouseY);
    };

    // General vars
    const resetButton = document.querySelector('.Button--reset');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const blue = '#005293';
    const yellow = '#FECB00';
    const red = '#FF0000';
    const dotRadius = 5.5;

    // Vars for draggable elements
    let isDragging = false;
    let selection = null;
    let dragOffX = 0;
    let dragOffY = 0;
    let updatePoint = null;

    let points = [];
    let information = null;


    // User Interaction
    // Gets the mouse position acording to the event it was called
    const getMousePosition = (e) => {
        let x = e.pageX || e.clientX || e.x;
        let y = e.pageY || e.clientY || e.y;

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;

        return { x: x, y: y };
    };

    // get the initial click moment and check it this click is on a dot
    const mouseDown = function(e) {
        const mouse = getMousePosition(e);
        const mouseX = mouse.x;
        const mouseY = mouse.y;

        for (let i = points.length - 2; i >= 0; i--) {

            if (points[i].containDot(mouseX, mouseY)) {
                const dot = points[i];
                updatePoint = i;
                dragOffX = mouseX - dot.x;
                dragOffY = mouseY - dot.y;
                isDragging = true;
                selection = dot;
                return;
            }
        }

        if (selection) selection = null;
    };

    // get the mouse movement and call function to update the coordinates
    const mouseMove = function(e) {
        if (isDragging) {

            context.clearRect(0, 0, canvas.width, canvas.height);
            const mouse = getMousePosition(e);

            selection.x = mouse.x - dragOffX;
            selection.y = mouse.y - dragOffY;

            updateView(selection, updatePoint);
        }
    };

    // stop view updates
    const mouseUp = function(e) {
        isDragging = false;
    };

    const writeDotNumber = function(number, position, size) {
        const dotNumberPos = 15;
        context.fillText(number, position.x, position.y - dotNumberPos, size);
    }

    const updateScreen = function() {
        context.clearRect(0, 0, canvas.width, canvas.height)

        const parallelogram = new Parallelogram(blue, {points}, null);
        parallelogram.drawShape();

        const len = points.length - 2;
        for (let i = len; i >= 0; i--) {
            const dot = new Circle(red, points[i], dotRadius, false, true);
            dot.drawShape();
            writeDotNumber(i+1, points[i], 80);
        };

        const innerCircle = new Circle(yellow, parallelogram.shapeInfo.center, parallelogram.shapeInfo.radius, true, false);
        innerCircle.drawShape();

        const info = { parallelogram: parallelogram.shapeInfo , circle: innerCircle.shapeInfo }
        information = new Info(info);
        information.render();
    };

    // Call the mouse position, verify how many dots are in the screen, call the dots/parallelogram draw function. Manage events
    const handleMouseClick = function(e) {
        const position = getMousePosition(e);

        if(points.length <= 3){
            points.push({ x: position.x, y: position.y });

            const dot = new Circle(red, position, dotRadius, false, true);
            dot.drawShape();
            writeDotNumber(points.length, position, 80);
        }

        if (points.length === 3) {
            canvas.removeEventListener('click', handleMouseClick);
            updateScreen();
            canvas.addEventListener('mousedown', mouseDown, true);
            canvas.addEventListener('mousemove', mouseMove, true);
            canvas.addEventListener('mouseup', mouseUp, true);
        }
    };

    // Reset
    const resetBoard = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        information.clear();
        points = [];
        canvas.removeEventListener('mousedown', mouseDown, true);
        canvas.removeEventListener('mousemove', mouseMove, true);
        canvas.removeEventListener('mouseup', mouseUp, true);
        canvas.addEventListener('click', handleMouseClick);
    };

    const initBoard = function() {
        const headerHeight = document.querySelector('.Header').clientHeight * 2;
        const infoSidebarWidth = document.querySelector('.Info').clientWidth;

        canvas.width = window.screen.availWidth - infoSidebarWidth;
        canvas.height = window.screen.availHeight - headerHeight;

        canvas.addEventListener('click', handleMouseClick);
        resetButton.addEventListener('click', resetBoard);
    };

    initBoard();
}
