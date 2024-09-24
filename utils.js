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
    } while (isPositionOnArray(position, snake)); // Vérifie seulement par rapport au serpent
    return position;
}

function isCollision(position) {
    return (
        isCollisionWithWall(position) || isCollisionWithSelf(position)
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

function increaseSnakeSpeed() {
    snakeSpeed -= 10;
    startGame();
}