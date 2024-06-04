function startGame() {
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, snakeSpeed);
}

function updateGame() {
    clearCanvas();
    moveSnake();
    moveObstacles();
    drawElements();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawElements() {
    drawSnake();
    drawFood();
    drawObstacles('black', obstacles);
    drawObstacles('blue', movingObstacles);
    updateScore();
}

function updateScore() {
    header.innerHTML = `${foodEaten}🔴 Niveau: ${level}`;
}