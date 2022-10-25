
/**
 * @param {number[][]} matrix
 * @return {boolean}
 */
var hasValidPath = function (matrix) {

    //Type of path on a point in matrix
    this.HORIZONTAL = 1;
    this.VERTICAL = 2;
    this.UP_LEFT = 3;
    this.UP_RIGHT = 4;
    this.DOWN_LEFT = 5;
    this.DOWN_RIGHT = 6;

    this.Direction = {LEFT: 0, RIGHT: 1, UP: 2, DOWN: 3};

    //Map<Direction, number[]> 
    this.nextMove = new Map([
        [this.Direction.LEFT, [0, -1]],
        [this.Direction.RIGHT, [0, 1]],
        [this.Direction.UP, [-1, 0]],
        [this.Direction.DOWN, [1, 0]]]);

    // Map<Direction, Map<number, Direction>>
    this.nextDirection = new Map([
        [this.Direction.LEFT, new Map([[HORIZONTAL, this.Direction.LEFT], [UP_RIGHT, this.Direction.DOWN], [DOWN_RIGHT, this.Direction.UP]])],
        [this.Direction.RIGHT, new Map([[HORIZONTAL, this.Direction.RIGHT], [UP_LEFT, this.Direction.DOWN], [DOWN_LEFT, this.Direction.UP]])],
        [this.Direction.UP, new Map([[VERTICAL, this.Direction.UP], [UP_LEFT, this.Direction.LEFT], [UP_RIGHT, this.Direction.RIGHT]])],
        [this.Direction.DOWN, new Map([[VERTICAL, this.Direction.DOWN], [DOWN_LEFT, this.Direction.LEFT], [DOWN_RIGHT, this.Direction.RIGHT]])]]);

    this.rows = matrix.length;
    this.columns = matrix[0].length;
    this.matrix = matrix;
    return validPathFound();
};

/**
 * @param {number} row
 * @param {number} column
 * @param {Direction} direction
 */
function Point(row, column, direction) {
    this.row = row;
    this.column = column;
    this.direction = direction;
}

/**
 * @return {boolean}
 */
function validPathFound() {

    //Queue<Point>
    const queue = new Queue();
    initializeQueueWithStartPoint(queue);
    const visited = Array.from(new Array(this.rows), () => new Array(this.columns).fill(false));
    visited[0][0] = true;

    while (!queue.isEmpty()) {

        const current = queue.dequeue();
        if (current.row === this.rows - 1 && current.column === this.columns - 1) {
            return true;
        }

        const nextRow = current.row + this.nextMove.get(current.direction)[0];
        const nextColumn = current.column + this.nextMove.get(current.direction)[1];

        if (isInMatrix(nextRow, nextColumn) && !visited[nextRow][nextColumn] && isValidNextDirection(current, nextRow, nextColumn)) {
            const nextDir = this.nextDirection.get(current.direction).get(this.matrix[nextRow][nextColumn]);
            visited[nextRow][nextColumn] = true;
            queue.enqueue(new Point(nextRow, nextColumn, nextDir));
        }
    }
    return false;
}

/**
 * @param {number} row
 * @param {number} column
 * @return {boolean}
 */
function isInMatrix(row, column) {
    return row < this.rows && row >= 0 && column < this.columns && column >= 0;
}

/**
 * @param {Direction} current
 * @param {number} row
 * @param {number} column
 * @return {boolean}
 */
function isValidNextDirection(current, row, column) {
    return this.nextDirection.get(current.direction).has(this.matrix[row][column]);
}

/*
 If the path on the start point is of type UP_RIGHT, then the queue will be initialized
 with to start points: one with direction DOWN and one with direction RIGHT.
 */
/**
 * @param {Queue<Point>} queue
 * @return {void}
 */
function initializeQueueWithStartPoint(queue) {
    if (this.matrix[0][0] === this.DOWN_LEFT) {
        return;
    }
    if (this.matrix[0][0] === this.HORIZONTAL || this.matrix[0][0] === this.DOWN_RIGHT || this.matrix[0][0] === this.UP_RIGHT) {
        queue.enqueue(new Point(0, 0, this.Direction.RIGHT));
    }
    if (this.matrix[0][0] === this.VERTICAL || this.matrix[0][0] === this.UP_LEFT || this.matrix[0][0] === this.UP_RIGHT) {
        queue.enqueue(new Point(0, 0, this.Direction.DOWN));
    }
}
