function drawObstacles(color, obsArray) {
    ctx.fillStyle = color;
    obsArray.forEach(obstacle => ctx.fillRect(obstacle.x, obstacle.y, box, box));
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