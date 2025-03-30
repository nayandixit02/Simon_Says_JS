let gameSeq = [];
let userSeq = [];
let btns = ["pink", "blue", "orange", "purple"];
let started = false;
let level = 0;
let highestScore = localStorage.getItem("simonHighScore") || 0;
let flashSpeed = 500;
let timeoutId;

const levelDisplay = document.getElementById("level");
const highScoreDisplay = document.getElementById("highScore");
const messageDisplay = document.querySelector(".message");
const startBtn = document.getElementById("startBtn");
const difficultySelect = document.getElementById("difficulty");
const timerBar = document.querySelector(".timer-bar");

// Initialize high score display
highScoreDisplay.textContent = highestScore;

// Event Listeners
document.addEventListener("keypress", handleStart);
startBtn.addEventListener("click", handleStart);
difficultySelect.addEventListener("change", () => {
  flashSpeed = parseInt(difficultySelect.value);
});

let allBtns = document.querySelectorAll(".square");
for (let btn of allBtns) {
  btn.addEventListener("click", btnPress);
}

function handleStart() {
  if (!started) {
    started = true;
    startBtn.disabled = true;
    difficultySelect.disabled = true;
    messageDisplay.textContent = "";
    levelUp();
  }
}

function playSound(color) {
  const sound = document.getElementById(`${color}-sound`);
  sound.currentTime = 0;
  sound.play();
}

function btnFlash(btn) {
  btn.classList.add("flash");
  playSound(btn.id);
  setTimeout(() => {
    btn.classList.remove("flash");
  }, flashSpeed / 2);
}

function updateTimer(duration) {
  timerBar.style.transition = `width ${duration / 1000}s linear`;
  timerBar.style.width = "100%";

  setTimeout(() => {
    timerBar.style.transition = "none";
    timerBar.style.width = "0%";
  }, duration);
}

function levelUp() {
  userSeq = [];
  level++;
  levelDisplay.textContent = level;
  levelDisplay.classList.add("pulse");
  setTimeout(() => levelDisplay.classList.remove("pulse"), 500);

  let randomInd = Math.floor(Math.random() * btns.length);
  let randomColor = btns[randomInd];
  gameSeq.push(randomColor);

  let randBtn = document.querySelector(`.${randomColor}`);

  // Show sequence with delay between flashes
  let delay = 0;
  gameSeq.forEach((color, index) => {
    setTimeout(() => {
      let btn = document.querySelector(`.${color}`);
      btnFlash(btn);

      // Update timer for the last button in sequence
      if (index === gameSeq.length - 1) {
        updateTimer(flashSpeed * (gameSeq.length + 1));
      }
    }, delay);
    delay += flashSpeed;
  });
}

function btnPress() {
  if (!started) return;

  let btn = this;
  btnFlash(btn);

  let btnColor = btn.getAttribute("id");
  userSeq.push(btnColor);

  checkColor(userSeq.length - 1);
}

function checkColor(ind) {
  if (gameSeq[ind] === userSeq[ind]) {
    if (userSeq.length === gameSeq.length) {
      // Play success sound
      document.getElementById("success-sound").play();

      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Show success message
      messageDisplay.textContent = "Great job! Next level...";
      messageDisplay.style.color = "#4CAF50";

      setTimeout(() => {
        messageDisplay.textContent = "";
        levelUp();
      }, 1500);
    }
  } else {
    gameOver();
  }
}

function gameOver() {
  document.getElementById("fail-sound").play();

  // Update high score if needed
  if (level > highestScore) {
    highestScore = level;
    localStorage.setItem("simonHighScore", highestScore);
    highScoreDisplay.textContent = highestScore;
  }

  // Flash screen red
  document.body.style.backgroundColor = "#ff4444";
  setTimeout(() => {
    document.body.style.backgroundColor = "";
  }, 150);

  // Show game over message
  messageDisplay.innerHTML = `Game Over!<br>Your score: <strong>${level}</strong>`;
  messageDisplay.style.color = "#fff";

  reset();
}

function reset() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  levelDisplay.textContent = level;
  startBtn.disabled = false;
  difficultySelect.disabled = false;
  clearTimeout(timeoutId);
}
