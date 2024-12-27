const canvas = document.querySelector('.particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Game Logic
const board = document.getElementById('board');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');
let currentPlayer = 'square';
let gameState = Array(9).fill('');
let gameActive = true;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function createSquare() {
    return `<svg class="symbol" viewBox="0 0 50 50">
        <rect x="5" y="5" width="40" height="40" fill="none" stroke="#ff6b6b" stroke-width="4">
            <animate attributeName="stroke-dasharray" from="0 160" to="160 160" dur="0.5s" fill="freeze"/>
        </rect>
    </svg>`;
}

function createTriangle() {
    return `<svg class="symbol" viewBox="0 0 50 50">
        <polygon points="25,5 45,45 5,45" fill="none" stroke="#4ecdc4" stroke-width="4">
            <animate attributeName="stroke-dasharray" from="0 160" to="160 160" dur="0.5s" fill="freeze"/>
        </polygon>
    </svg>`;
}

function drawWinLine(combination) {
    const startCell = document.querySelector(`[data-index="${combination[0]}"]`);
    const endCell = document.querySelector(`[data-index="${combination[2]}"]`);
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const line = document.createElement('div');
    line.className = 'win-line';

    const deltaX = endRect.left - startRect.left;
    const deltaY = endRect.top - startRect.top;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    line.style.width = `${length}px`;
    line.style.height = '8px';
    line.style.position = 'absolute';
    line.style.left = `${startRect.left - boardRect.left + startRect.width / 2}px`;
    line.style.top = `${startRect.top - boardRect.top + startRect.height / 2}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = 'left';

    board.appendChild(line);
}

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;

    if (gameState[index] !== '' || !gameActive) return;

    gameState[index] = currentPlayer;
    const symbol = currentPlayer === 'square' ? createSquare() : createTriangle();
    cell.innerHTML = symbol;

    setTimeout(() => {
        cell.querySelector('.symbol').classList.add('show');
    }, 50);

    if (checkWin()) {
        const winner = currentPlayer === 'square' ? 'Square' : 'Triangle';
        status.textContent = `${winner} wins!`;
        status.style.background = currentPlayer === 'square' ?
            'linear-gradient(45deg, #ff6b6b, #ff8e8e)' :
            'linear-gradient(45deg, #4ecdc4, #6ee7df)';
        gameActive = false;

        const winningCombo = winningCombinations.find(combination =>
            combination.every(index => gameState[index] === currentPlayer)
        );

        if (winningCombo) {
            setTimeout(() => drawWinLine(winningCombo), 100);
        }
        return;
    }

    if (gameState.every(cell => cell !== '')) {
        status.textContent = "It's a draw!";
        status.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'square' ? 'triangle' : 'square';
    status.textContent = `${currentPlayer === 'square' ? 'Square' : 'Triangle'}'s turn`;
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
}

function restartGame() {
    gameState = Array(9).fill('');
    gameActive = true;
    currentPlayer = 'square';
    status.textContent = "Square's turn";
    status.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';

    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = '';
    });

    const winLine = document.querySelector('.win-line');
    if (winLine) winLine.remove();

    restartButton.classList.add('pulse');
    setTimeout(() => restartButton.classList.remove('pulse'), 500);
}

board.addEventListener('click', handleCellClick);
restartButton.addEventListener('click', restartGame);