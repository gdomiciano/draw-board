{
    class Shape {
        constructor(color, position) {
            // code
            this.color = color;
            this.position = position;
        }
        getArea() {return this.setArea();}
        getInfo() {return this.setInfo();}

        setArea() {return 0};
        setInfo() {return {}};

        drawShape() {}
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

        setInfo() {
            const points = this.position.points;
            const centerX = (points[0].x + points[1].x + points[2].x + points[3].x) / 4;
            const centerY = (points[0].y + points[1].y + points[2].y + points[3].y) / 4;
            const base = Math.max(Math.sqrt(Math.pow((points[3].x - points[0].x), 2) + Math.pow((points[3].y - [points[0].y]), 2)), Math.sqrt(Math.pow((points[1].x - points[0].x), 2) + Math.pow((points[1].y - [points[0].y]), 2)));
            const area = this.getArea();
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

        setArea() {
            const points = this.position.points;
            const AC = Math.sqrt(Math.pow((points[3].x - points[0].x), 2) + Math.pow((points[3].y - [points[0].y]), 2));
            const BD = Math.sqrt(Math.pow((points[2].x - points[1].x), 2) + Math.pow((points[2].y - [points[1].y]), 2));
            const area = ((AC * BD)/2).toFixed();
            return area;
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

        setInfo() {
            return {area: this.getArea()};
        };

        setArea() {
            return (Math.PI * Math.pow(this.radius, 2)).toFixed();
        };
    };

    class Info {
        constructor(info) {
            this.info = info;
        }

        render() {
            document.querySelector('.Info-content--pointOne').textContent = `${this.info.parallelogram.points[0].x}, ${this.info.parallelogram.points[0].y}`;
            document.querySelector('.Info-content--pointTwo').textContent = `${this.info.parallelogram.points[1].x}, ${this.info.parallelogram.points[1].y}`;
            document.querySelector('.Info-content--pointThree').textContent = `${this.info.parallelogram.points[2].x}, ${this.info.parallelogram.points[2].y}`;
            document.querySelector('.Info-content--parallelogramArea').textContent = `Parallelogram: ${this.info.parallelogram.area}`;
            document.querySelector('.Info-content--circleArea').textContent = `Circle: ${this.info.circle.area}`;
            document.querySelector('.Info-none').classList.add('u-hidden');
            document.querySelector('.Info-content').classList.remove('u-hidden');
        }

        clear() {
            document.querySelector('.Info-none').classList.remove('u-hidden');
            document.querySelector('.Info-content').classList.add('u-hidden');
            document.querySelector('.Info-content--pointOne').textContent = '';
            document.querySelector('.Info-content--pointTwo').textContent = '';
            document.querySelector('.Info-content--pointThree').textContent = '';
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
    const dotRadius = 5.5;
    const red = '#FF0000';
    const textPosition = 15;

    // Vars for draggable elements
    let dragging = false;
    let selection = null;
    let dragoffx = 0;
    let dragoffy = 0;
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

        return {x: x, y: y};
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
                dragoffx = mouseX - dot.x;
                dragoffy = mouseY - dot.y;
                dragging = true;
                selection = dot;
                return;
            }
        }

        if (selection) selection = null;
    };

    // get the mouse movement and call function to update the coordinates
    const mouseMove = function(e) {
        if (dragging) {

            context.clearRect(0, 0, canvas.width, canvas.height);
            const mouse = getMousePosition(e);

            selection.x = mouse.x - dragoffx;
            selection.y = mouse.y - dragoffy;

            updateView(selection, updatePoint);
        }
    };

    // stop view updates
    const mouseUp = function(e) {
        dragging = false;
    };

    const updateView = function() {
        context.clearRect(0, 0, canvas.width, canvas.height)

        const parallelogram = new Parallelogram(blue, {points}, null);
        parallelogram.drawShape();

        for (let i = points.length - 2; i >= 0; i--) {
            const dot = new Circle(red, points[i], dotRadius, false, true);
            dot.drawShape();
            context.fillText(i+1, points[i].x, points[i].y - textPosition, 80);
        };

        let info = { parallelogram: parallelogram.getInfo() };

        const innerCircle = new Circle(yellow, info.parallelogram.center, info.parallelogram.radius, true, false);
        innerCircle.drawShape();

        info = {...info, circle: innerCircle.getInfo() }
        information = new Info(info);
        information.render();
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

    // Call the mouse position, verify how many dots are in the screen, call the dots/parallelogram draw function. Manage events
    const handleMouseClick = function(e) {
        const position = getMousePosition(e);
        if(points.length <= 3){
            points.push({
                x: position.x,
                y: position.y,
            });
            const dot = new Circle(red, position, dotRadius, false, true);
            dot.drawShape();
            context.fillText(points.length, position.x, position.y - textPosition, 80);
        }

        if (points.length === 3) {
            canvas.removeEventListener('click', handleMouseClick);
            updateView();
            canvas.addEventListener('mousedown', mouseDown, true);
            canvas.addEventListener('mousemove', mouseMove, true);
            canvas.addEventListener('mouseup', mouseUp, true);
        }
    };

    const initBoard = function() {
        canvas.width = window.screen.availWidth;
        canvas.height = window.screen.availHeight;

        canvas.addEventListener('click', handleMouseClick);
        resetButton.addEventListener('click', resetBoard);
    };

    initBoard();
}
