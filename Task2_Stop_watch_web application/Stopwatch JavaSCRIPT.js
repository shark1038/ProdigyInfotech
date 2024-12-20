>let startTime;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCounter = 0;

const display = document.getElementById('display');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapTimes = document.getElementById('lapTimes');

function startTimer() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 10);
        isRunning = true;
        startButton.disabled = true;
        pauseButton.disabled = false;
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    display.textContent = '00:00:00';
    elapsedTime = 0;
    isRunning = false;
    lapTimes.innerHTML = '';
    lapCounter = 0;
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function updateDisplay() {
    const currentTime = Date.now() - startTime;
    const minutes = Math.floor(currentTime / 60000);
    const seconds = Math.floor((currentTime % 60000) / 1000);
    const milliseconds = Math.floor((currentTime % 1000) / 10);

    display.textContent =
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds + ':' +
        (milliseconds < 10 ? '0' : '') + milliseconds;
}

function recordLap() {
    if (isRunning) {
        lapCounter++;
        const lapTime = display.textContent;
        const lapElement = document.createElement('div');
        lapElement.classList.add('lap-item');
        lapElement.innerHTML = `
            <span>
                <i class="fas fa-flag lap-icon"></i>
                Lap ${lapCounter}
            </span>
            <span>${lapTime}</span>
        `;
        lapTimes.prepend(lapElement);
    }
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
lapButton.addEventListener('click', recordLap);

// Initial state
pauseButton.disabled = true;