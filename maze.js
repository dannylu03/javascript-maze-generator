let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");

// Global variable to keep track of current cell
let current;

// Parent Class
class Maze {
    constructor(size, rows, cols) {
        this.size = size;
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.stack = [];
    }

    setup() {
        for (let r = 0; r < this.rows; r++) {
            let row = [];

            for (let c = 0; c < this.cols; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        current = this.grid[0][0];
    }

    draw() {
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black";
        // Starting cell will be automatically visted
        current.visted = true;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.cols);
            }
        }

        let next = current.checkNeighbours();

        if (next) {
            next.visted = true;
            this.stack.push(current);

            current.highlight(this.cols);

            current.removeWalls(current, next);

            current = next;
        } else if (this.stack.length > 0) {
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.cols);
        }

        if (this.stack.length == 0) {
            return;
        }

        window.requestAnimationFrame(() => {
            this.draw();
        });
    }
}

class Cell {
    constructor(rowNum, colNum, parentGrid, parentSize) {
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visted = false; // All cells originally false
        this.walls = {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true,
        };
    }

    checkNeighbours() {
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;

        // Holds all unvisted neighbours
        let neighbours = [];

        let top = row != 0 ? grid[row - 1][col] : undefined;
        let right = col != grid.length - 1 ? grid[row][col + 1] : undefined;
        let bottom = row != grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col != 0 ? grid[row][col - 1] : undefined;

        if (top && !top.visted) neighbours.push(top);
        if (right && !right.visted) neighbours.push(right);
        if (bottom && !bottom.visted) neighbours.push(bottom);
        if (left && !left.visted) neighbours.push(left);

        if (neighbours.length !== 0) {
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        } else {
            return undefined;
        }
    }

    drawTopWall(x, y, size, rows, cols) {
        ctx.beginPath();
        // Begin cell at top left hand denoted by x and y coords
        ctx.moveTo(x, y);

        // Move the cell from the top left to the top right; drawing a top wall
        ctx.lineTo(x + size / cols, y);
        ctx.stroke();
    }

    drawRightWall(x, y, size, rows, cols) {
        ctx.beginPath();
        // Begin cell at top right
        ctx.moveTo(x + size / cols, y);

        // Move Cell to bottom right
        ctx.lineTo(x + size / cols, y + size / rows);
        ctx.stroke();
    }

    drawBottomWall(x, y, size, rows, cols) {
        ctx.beginPath();
        // Begin cell at Bottom Right
        ctx.moveTo(x + size / cols, y + size / rows);

        // Move cell to Bottom left
        ctx.lineTo(x, y + size / rows);
    }

    drawLeftWall(x, y, size, rows, cols) {
        ctx.beginPath();
        // Begin cell at top left
        ctx.moveTo(x, y);

        // Move cell to bottom left
        ctx.lineTo(x, y + size / rows);
    }

    removeWalls(cell1, cell2) {
        let x = cell1.colNum - cell2.colNum;
        let y = cell1.rowNum - cell2.rowNum;

        if (x == 1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        } else if (x == -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }

        if (y == 1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        } else if (y == -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
    }

    highlight(cols) {
        let x = (this.colNum * this.parentSize) / cols + 1;
        let y = (this.rowNum * this.parentSize) / cols + 1;

        ctx.fillStyle = "green";
        ctx.fillRect(
            x,
            y,
            this.parentSize / cols - 3,
            this.parentSize / cols - 3
        );
    }

    show(size, rows, cols) {
        let x = (this.colNum * size) / cols;
        let y = (this.rowNum * size) / rows;

        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;

        if (this.walls.topWall) this.drawTopWall(x, y, size, cols, rows);
        if (this.walls.rightWall) this.drawRightWall(x, y, size, cols, rows);
        if (this.walls.bottomWall) this.drawBottomWall(x, y, size, cols, rows);
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, cols, rows);

        if (this.visted) {
            ctx.fillRect(x + 1, y + 1, size / cols - 2, size / rows - 2);
        }
    }
}

let newMaze = new Maze(500, 20, 20);
newMaze.setup();
newMaze.draw();
