const header = document.getElementById('header');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [{ x: 0, y: 0 }];
let food = { x: 0, y: 0 }; // Initialisation de la nourriture à des valeurs arbitraires
let dx = 0;
let dy = 0;
let gameInterval;

let obstacles = [];

// Génère la première nourriture
generateFood();

let foodEaten = 0;
let snakeSpeed = 100; // Vitesse initiale du serpent
let isLevelTwo = false;

function generateFood() {
    let x = Math.floor(Math.random() * (canvas.width / box)) * box;
    let y = Math.floor(Math.random() * (canvas.height / box)) * box;

    // Vérifie si la nouvelle position de la nourriture n'est pas sur le serpent ou un obstacle
    while (snake.some(part => part.x === x && part.y === y) || obstacles.some(obstacle => obstacle.x === x && obstacle.y === y)) {
        x = Math.floor(Math.random() * (canvas.width / box)) * box;
        y = Math.floor(Math.random() * (canvas.height / box)) * box;
    }

    food = { x: x, y: y };
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = 'green';
        ctx.fillRect(part.x, part.y, box, box);
    });
}

function drawFood() {
    ctx.fillStyle = 'red'; // Couleur de la nourriture
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2); // Dessiner un cercle pour représenter la nourriture
    ctx.fill();
}

function drawScore() {
    header.innerHTML = foodEaten + '🔴'; // Dessine le compteur de nourriture ingurgitée après le cercle rouge
}

function drawObstacles() {
    ctx.fillStyle = 'black'; // Couleur des obstacles
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, box, box); // Dessiner un rectangle pour représenter un obstacle
    });
}

function generateObstacles() {
    obstacles = []; // Vide la liste des obstacles avant de les regénérer
    // Génère une certaine quantité d'obstacles aléatoirement
    for (let i = 0; i < 5; i++) { // Par exemple, générez 5 obstacles
        let x = Math.floor(Math.random() * (canvas.width / box)) * box;
        let y = Math.floor(Math.random() * (canvas.height / box)) * box;

        // Assurez-vous que l'obstacle ne se place pas sur le serpent ou sur la nourriture
        while (snake.some(part => part.x === x && part.y === y) || (food.x === x && food.y === y)) {
            x = Math.floor(Math.random() * (canvas.width / box)) * box;
            y = Math.floor(Math.random() * (canvas.height / box)) * box;
        }

        obstacles.push({ x: x, y: y });
    }
}

function moveSnake() {
    checkObstacleCollision();

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Vérifie si la tête du serpent dépasse les limites du cadre
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        // Réinitialise la position du serpent s'il sort du cadre
        resetGame();
        return;
    }

    // Vérifie si la tête du serpent entre en collision avec son propre corps
    if (snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y)) {
        // Réinitialise la position du serpent s'il entre en collision avec son propre corps
        resetGame();
        return;
    }

    snake.unshift(head);

    // Vérifie si la tête du serpent touche la nourriture
    if (head.x === food.x && head.y === food.y) {
        foodEaten++;
        checkLevelIncrease(); // Vérifie si la vitesse du serpent doit être augmentée
        generateFood(); // Génère une nouvelle position pour la nourriture
        if (isLevelTwo) {
            generateObstacles(); // Génère de nouveaux obstacles si au niveau 2
        }
    } else {
        snake.pop();
    }

    function checkLevelIncrease() {
        if (foodEaten === 2) {
            snakeSpeed -= 20; // Augmente la vitesse du serpent
            console.log("Niveau 1");
            startGame();
        }
        if (foodEaten === 4) {
            isLevelTwo = true;
            console.log("Niveau 2");
            generateObstacles(); // Génère les obstacles au niveau 2
        }
    }
}

function checkObstacleCollision() {
    // Vérifie si la tête du serpent entre en collision avec un obstacle
    if (obstacles.some(obstacle => obstacle.x === snake[0].x && obstacle.y === snake[0].y)) {
        resetGame(false); // Réinitialise le jeu en cas de collision avec un obstacle
    }
}

function resetGame(keepObstacles = false) {
    snake = [{ x: 0, y: 0 }];
    dx = 0;
    dy = 0;
    foodEaten = 0; // Réinitialiser le compteur de nourriture ingurgitée
    snakeSpeed = keepObstacles ? snakeSpeed : 100; // Réinitialise la vitesse du serpent
    if (!keepObstacles) {
        obstacles = []; // Réinitialise les obstacles seulement si nécessaire
        isLevelTwo = false; // Réinitialise l'état du niveau
    }
    generateFood();
    if (keepObstacles) {
        generateObstacles(); // Regénère les obstacles
    }
    startGame();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
    drawObstacles();
    drawScore();
}

document.addEventListener('keydown', event => {
    const direction = event.key.replace('Arrow', '');
    if (direction === 'Up' && dy === 0) {
        dx = 0;
        dy = -box;
    } else if (direction === 'Down' && dy === 0) {
        dx = 0;
        dy = box;
    } else if (direction === 'Left' && dx === 0) {
        dx = -box;
        dy = 0;
    } else if (direction === 'Right' && dx === 0) {
        dx = box;
        dy = 0;
    }
});

function startGame() {
    clearInterval(gameInterval); // Efface l'ancien intervalle avant d'en créer un nouveau
    gameInterval = setInterval(draw, snakeSpeed); // Crée un nouvel intervalle avec la vitesse actuelle du serpent
}

startGame();