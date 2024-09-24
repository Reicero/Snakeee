function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x, part.y, box, box));
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

function handleDirectionChange(event) {
    const direction = event.key.replace('Arrow', '');
    switch (direction) {
        case 'Up': if (dy === 0) { dx = 0; dy = -box; } break;
        case 'Down': if (dy === 0) { dx = 0; dy = box; } break;
        case 'Left': if (dx === 0) { dx = -box; dy = 0; } break;
        case 'Right': if (dx === 0) { dx = box; dy = 0; } break;
    }
}