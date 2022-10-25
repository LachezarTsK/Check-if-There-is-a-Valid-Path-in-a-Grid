
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;

public class Solution {

    //Type of path on a point in matrix
    private static final int HORIZONTAL = 1;
    private static final int VERTICAL = 2;
    private static final int UP_LEFT = 3;
    private static final int UP_RIGHT = 4;
    private static final int DOWN_LEFT = 5;
    private static final int DOWN_RIGHT = 6;

    private enum Direction {LEFT, RIGHT, UP, DOWN}
    private record Point(int row, int column, Direction direction){}
    
    Map<Direction, int[]> nextMove = Map.of(
            Direction.LEFT, new int[]{0, -1},
            Direction.RIGHT, new int[]{0, 1},
            Direction.UP, new int[]{-1, 0},
            Direction.DOWN, new int[]{1, 0});

    Map<Direction, Map<Integer, Direction>> nextDirection = Map.of(
            Direction.LEFT, Map.of(HORIZONTAL, Direction.LEFT, UP_RIGHT, Direction.DOWN, DOWN_RIGHT, Direction.UP),
            Direction.RIGHT, Map.of(HORIZONTAL, Direction.RIGHT, UP_LEFT, Direction.DOWN, DOWN_LEFT, Direction.UP),
            Direction.UP, Map.of(VERTICAL, Direction.UP, UP_LEFT, Direction.LEFT, UP_RIGHT, Direction.RIGHT),
            Direction.DOWN, Map.of(VERTICAL, Direction.DOWN, DOWN_LEFT, Direction.LEFT, DOWN_RIGHT, Direction.RIGHT));

    private int rows;
    private int columns;
    private int[][] matrix;

    public boolean hasValidPath(int[][] matrix) {
        rows = matrix.length;
        columns = matrix[0].length;
        this.matrix = matrix;
        return validPathFound();
    }

    private boolean validPathFound() {

        Queue<Point> queue = new LinkedList<>();
        initializeQueueWithStartPoint(queue);
        boolean[][] visited = new boolean[rows][columns];
        visited[0][0] = true;

        while (!queue.isEmpty()) {

            Point current = queue.poll();
            if (current.row == rows - 1 && current.column == columns - 1) {
                return true;
            }

            int nextRow = current.row + nextMove.get(current.direction)[0];
            int nextColumn = current.column + nextMove.get(current.direction)[1];

            if (isInMatrix(nextRow, nextColumn) && !visited[nextRow][nextColumn] && isValidNextDirection(current, nextRow, nextColumn)) {
                Direction nextDir = this.nextDirection.get(current.direction).get(matrix[nextRow][nextColumn]);
                visited[nextRow][nextColumn] = true;
                queue.add(new Point(nextRow, nextColumn, nextDir));
            }
        }
        return false;
    }

    private boolean isInMatrix(int row, int column) {
        return row < rows && row >= 0 && column < columns && column >= 0;
    }

    private boolean isValidNextDirection(Point current, int row, int column) {
        return nextDirection.get(current.direction).containsKey(matrix[row][column]);
    }

    /*
      If the path on the start point is of type UP_RIGHT, then the queue will be initialized
      with to start points: one with direction DOWN and one with direction RIGHT.
     */
    private void initializeQueueWithStartPoint(Queue<Point> queue) {
        if (matrix[0][0] == DOWN_LEFT) {
            return;
        }
        if (matrix[0][0] == HORIZONTAL || matrix[0][0] == DOWN_RIGHT || matrix[0][0] == UP_RIGHT) {
            queue.add(new Point(0, 0, Direction.RIGHT));
        }
        if (matrix[0][0] == VERTICAL || matrix[0][0] == UP_LEFT || matrix[0][0] == UP_RIGHT) {
            queue.add(new Point(0, 0, Direction.DOWN));
        }
    }
}
