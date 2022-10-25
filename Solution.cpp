
#include <queue>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
    
    //Type of path on a point in matrix
    inline static const int HORIZONTAL = 1;
    inline static const int VERTICAL = 2;
    inline static const int UP_LEFT = 3;
    inline static const int UP_RIGHT = 4;
    inline static const int DOWN_LEFT = 5;
    inline static const int DOWN_RIGHT = 6;

    enum class Direction {LEFT, RIGHT, UP, DOWN};

    struct Point {
        int row;
        int column;
        Direction direction;
        Point(int row, int column, Direction direction) : row{row}, column{column}, direction{direction}{}
    };

    unordered_map<Direction, array<int, 2 >> nextMove{
        {Direction::LEFT,{ 0, -1}},
        {Direction::RIGHT,{ 0, 1}},
        {Direction::UP,{ -1, 0}},
        {Direction::DOWN,{ 1, 0}}};

    unordered_map <Direction, unordered_map<int, Direction>> nextDirection = {
        {Direction::LEFT,{{HORIZONTAL, Direction::LEFT}, {UP_RIGHT, Direction::DOWN}, {DOWN_RIGHT, Direction::UP}}},
        {Direction::RIGHT,{{HORIZONTAL, Direction::RIGHT}, {UP_LEFT, Direction::DOWN}, {DOWN_LEFT, Direction::UP}}},
        {Direction::UP,{{VERTICAL, Direction::UP}, {UP_LEFT, Direction::LEFT}, {UP_RIGHT, Direction::RIGHT}}},
        {Direction::DOWN,{{VERTICAL, Direction::DOWN}, {DOWN_LEFT, Direction::LEFT}, {DOWN_RIGHT, Direction::RIGHT}}}};

    size_t rows;
    size_t columns;
    vector<vector<int>> matrix;

public:
    bool hasValidPath(vector<vector<int>>& matrix) {
        rows = matrix.size();
        columns = matrix[0].size();
        this->matrix = move(matrix);
        return validPathFound();
    }
    
private:
    bool validPathFound() {

        queue<Point> queue;
        initializeQueueWithStartPoint(queue);
        vector < vector<bool>> visited(rows, vector<bool>(columns));
        visited[0][0] = true;

        while (!queue.empty()) {

            Point current = queue.front();
            queue.pop();
            if (current.row == rows - 1 && current.column == columns - 1) {
                return true;
            }

            int nextRow = current.row + nextMove[current.direction][0];
            int nextColumn = current.column + nextMove[current.direction][1];

            if (isInMatrix(nextRow, nextColumn) && !visited[nextRow][nextColumn] && isValidNextDirection(current, nextRow, nextColumn)) {
                Direction nextDir = nextDirection[current.direction][matrix[nextRow][nextColumn]];
                visited[nextRow][nextColumn] = true;
                queue.push(Point(nextRow, nextColumn, nextDir));
            }
        }
        return false;
    }

    bool isInMatrix(int row, int column) const {
        return row < rows && row >= 0 && column < columns && column >= 0;
    }

    bool isValidNextDirection(const Point& current, int row, int column) {
        //C++20: nextDirection[current.direction].contains(matrix[row][column]), done the old way for compatibility
        return nextDirection[current.direction].find(matrix[row][column]) != nextDirection[current.direction].end();
    }

    /*
    If the path on the start point is of type UP_RIGHT, then the queue will be initialized
    with to start points: one with direction DOWN and one with direction RIGHT.
     */
    void initializeQueueWithStartPoint(queue<Point>& queue) {
        if (matrix[0][0] == DOWN_LEFT) {
            return;
        }
        if (matrix[0][0] == HORIZONTAL || matrix[0][0] == DOWN_RIGHT || matrix[0][0] == UP_RIGHT) {
            queue.push(Point(0, 0, Direction::RIGHT));
        }
        if (matrix[0][0] == VERTICAL || matrix[0][0] == UP_LEFT || matrix[0][0] == UP_RIGHT) {
            queue.push(Point(0, 0, Direction::DOWN));
        }
    }
};
