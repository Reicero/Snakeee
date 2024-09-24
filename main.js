const box = 20;
let snake = [{ x: 200, y: 200 }];
let dx = box, dy = 0;  // Direction initiale du serpent (vers la droite)
let food = getRandomValidPosition();
let gameInterval;
let foodEaten = 0;
let snakeSpeed = 100;
let level = 1;

document.addEventListener('keydown', handleDirectionChange);
startGame();

function startGame() {
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, snakeSpeed);
}

function updateGame() {
    clearCanvas();
    moveSnake();
    drawElements();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}