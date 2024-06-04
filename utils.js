function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function getRandomValidPosition() {
    let position;
    do {
        position = getRandomPosition();
    } while (isPositionOnArray(position, snake) || isPositionOnArray(position, obstacles) || isPositionOnArray(position, movingObstacles));
    return position;
}

function isCollision(position) {
    return (
        isCollisionWithWall(position) || isCollisionWithSelf(position) ||
        isPositionOnArray(position, obstacles) || isPositionOnArray(position, movingObstacles)
    );
}

function isCollisionWithWall(position) {
    return (
        position.x < 0 || position.x >= canvas.width ||
        position.y < 0 || position.y >= canvas.height
    );
}

function isCollisionWithSelf(position) {
    return snake.some((part, index) => index !== 0 && part.x === position.x && part.y === position.y);
}

function isPositionOnArray(position, array) {
    return array.some(item => item.x === position.x && item.y === position.y);
}

function resetGame(keepObstacles = false) {
    snake = [{ x: 0, y: 0 }];
    dx = 0;
    dy = 0;
    foodEaten = 0;
    snakeSpeed = 100;
    level = 1;
    if (!keepObstacles) {
        obstacles = [];
        movingObstacles = [];
    }
    food = getRandomValidPosition();
    if (keepObstacles) {
        generateObstacles(obstacles, 5);
        generateObstacles(movingObstacles, 3, true);
    }
    startGame();
}

function increaseSnakeSpeed() {
    snakeSpeed -= 10;
    startGame();
}