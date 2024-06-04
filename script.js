const header = document.getElementById('header');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [{ x: 0, y: 0 }];
let food = getRandomPosition();
let dx = 0, dy = 0;
let gameInterval;
let obstacles = [], movingObstacles = [];
let foodEaten = 0, snakeSpeed = 100, level = 1;

document.addEventListener('keydown', handleDirectionChange);
startGame();

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

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x, part.y, box, box));
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawObstacles(color, obsArray) {
    ctx.fillStyle = color;
    obsArray.forEach(obstacle => ctx.fillRect(obstacle.x, obstacle.y, box, box));
}

function updateScore() {
    header.innerHTML = `${foodEaten}🔴 Niveau: ${level}`;
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (isCollision(head)) {
        resetGame();
        return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        foodEaten++;
        handleLevelProgression();
        food = getRandomValidPosition();
    } else {
        snake.pop();
    }
}

function handleLevelProgression() {
    switch (foodEaten) {
        case 2: level = 2; increaseSnakeSpeed(); break;
        case 4: level = 3; generateObstacles(obstacles, 5); break;
        case 6: level = 4; generateObstacles(movingObstacles, 5, true); break;
    }
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

function isPositionOnArray(position, array) {
    return array.some(item => item.x === position.x && item.y === position.y);
}

function generateObstacles(array, count, isMoving = false) {
    array.length = 0;
    for (let i = 0; i < count; i++) {
        let position = getRandomValidPosition();
        if (isMoving) {
            let direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            array.push({ ...position, direction, steps: 0 });
        } else {
            array.push(position);
        }
    }
}

function moveObstacles() {
    movingObstacles.forEach(obstacle => {
        if (obstacle.direction === 'horizontal') {
            obstacle.x += (obstacle.steps < 3 ? box : -box);
        } else {
            obstacle.y += (obstacle.steps < 3 ? box : -box);
        }
        obstacle.steps = (obstacle.steps + 1) % 6;
    });
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

function handleDirectionChange(event) {
    const direction = event.key.replace('Arrow', '');
    switch (direction) {
        case 'Up': if (dy === 0) { dx = 0; dy = -box; } break;
        case 'Down': if (dy === 0) { dx = 0; dy = box; } break;
        case 'Left': if (dx === 0) { dx = -box; dy = 0; } break;
        case 'Right': if (dx === 0) { dx = box; dy = 0; } break;
    }
}