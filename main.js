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