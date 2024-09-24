const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{ x: getRandomPosition().x, y: getRandomPosition().y }];
let dx = 0, dy = 0;  // Le serpent ne bouge pas au début
let food = getRandomPosition();
let gameInterval;
let foodEaten = 0;
let snakeSpeed = 100;  // Vitesse initiale
let level = 1;
let isGameRunning = false;  // Indicateur de démarrage du jeu

// Démarrage du jeu
document.addEventListener('keydown', handleDirectionChange);

// Affiche immédiatement le serpent et la nourriture au début
drawElements();
startGame();

function startGame() {
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, snakeSpeed);
}

// Mise à jour du jeu
function updateGame() {
    if (!isGameRunning) return;  // Le jeu ne démarre que quand une direction est choisie

    clearCanvas();
    moveSnake();
    drawElements();
    updateScore();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Dessine le serpent et la nourriture
function drawElements() {
    drawSnake();
    drawFood();
    drawGameBorder();
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, box, box);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
}

function drawGameBorder() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function updateScore() {
    const header = document.getElementById('header');
    header.innerHTML = `${foodEaten} 🔴 Niveau: ${level}`;
}

// Déplace le serpent
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
        food = getRandomPosition();
    } else {
        snake.pop();
    }
}

// Gère les directions
function handleDirectionChange(event) {
    const direction = event.key.replace('Arrow', '');
    switch (direction) {
        case 'Up': if (dy === 0) { dx = 0; dy = -box; isGameRunning = true; } break;
        case 'Down': if (dy === 0) { dx = 0; dy = box; isGameRunning = true; } break;
        case 'Left': if (dx === 0) { dx = -box; dy = 0; isGameRunning = true; } break;
        case 'Right': if (dx === 0) { dx = box; dy = 0; isGameRunning = true; } break;
    }
}

// Vérifie les collisions
function isCollision(position) {
    return (
        position.x < 0 || position.x >= canvas.width ||
        position.y < 0 || position.y >= canvas.height ||
        snake.some((part, index) => index !== 0 && part.x === position.x && part.y === position.y)
    );
}

// Réinitialise le jeu
function resetGame() {
    alert('Game Over');
    snake = [{ x: getRandomPosition().x, y: getRandomPosition().y }];  // Réapparition aléatoire du serpent
    dx = 0;
    dy = 0;
    foodEaten = 0;
    level = 1;
    snakeSpeed = 100;  // Vitesse initiale après réinitialisation
    food = getRandomPosition();  // Réapparition aléatoire de la nourriture
    isGameRunning = false;  // Le jeu ne démarre pas automatiquement
    drawElements();  // Affiche les éléments avant que le jeu ne recommence
    startGame();
}

// Augmente la difficulté
function handleLevelProgression() {
    if (foodEaten % 5 === 0) {
        level++;
        snakeSpeed = Math.max(50, snakeSpeed - 10);  // Réduit la vitesse jusqu'à un minimum de 50 ms
        startGame();
    }
}

// Génère une position aléatoire pour la nourriture
function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}