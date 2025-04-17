let playerMoves = [];
let currentPlayer = 1;
let totalPlayers = 0;
let playerNames = [];
let moveTimeout = 30;  // Time limit for each player in seconds

// Sound Effects
const moveSound = new Audio('assets/move-sound.mp3');
const winSound = new Audio('assets/win-sound.mp3');
const loseSound = new Audio('assets/lose-sound.mp3');
const drawSound = new Audio('assets/draw-sound.mp3');

// Start the game by selecting the number of players
function startGame() {
  totalPlayers = parseInt(document.getElementById('num-players').value);
  playerMoves = [];
  currentPlayer = 1;
  
  // Get player names
  playerNames[0] = document.getElementById('player1-name').value || `Player 1`;
  playerNames[1] = document.getElementById('player2-name').value || `Player 2`;
  if (totalPlayers > 2) {
    playerNames[2] = document.getElementById('player3-name').value || `Player 3`;
  }
  if (totalPlayers > 3) {
    playerNames[3] = document.getElementById('player4-name').value || `Player 4`;
  }

  // Hide player setup screen and show game screen
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('status').innerText = `${playerNames[0]}: Choose your move`;

  // Start countdown timer for each player
  startCountdown();
}

// Countdown timer
let countdownInterval;
function startCountdown() {
  let timeLeft = moveTimeout;
  document.getElementById('status').innerText = `${playerNames[currentPlayer - 1]}: Time left: ${timeLeft} seconds`;

  countdownInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('status').innerText = `${playerNames[currentPlayer - 1]}: Time left: ${timeLeft} seconds`;
    
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      makeMove('timeout');
    }
  }, 1000);
}

// Player move
function makeMove(move) {
  if (move !== 'timeout') {
    moveSound.play(); // Play sound for move
  }
  playerMoves[currentPlayer - 1] = move;

  if (currentPlayer < totalPlayers) {
    currentPlayer++;
    document.getElementById('status').innerText = `${playerNames[currentPlayer - 1]}: Choose your move`;
    startCountdown();
  } else {
    decideWinner();
  }
}

// ✅ FIXED: Decide winner based on moves
function decideWinner() {
  clearInterval(countdownInterval);  // Stop countdown once all players have made their move
  const result = document.getElementById("result");

  // Filter valid moves (remove timeouts)
  const validMoves = playerMoves.filter(move => move !== 'timeout');

  // If not all players made a valid move
  if (validMoves.length < totalPlayers) {
    loseSound.play();
    result.innerText = "Not all players made a move. Round cancelled!";
    document.getElementById('reset').style.display = 'inline-block';
    return;
  }

  const uniqueMoves = [...new Set(validMoves)];

  // Draw cases
  if (uniqueMoves.length === 1 || uniqueMoves.length === 3) {
    drawSound.play();
    result.innerText = "It's a draw!";
  } else {
    // Determine the winning move
    let winningMove = "";
    if (uniqueMoves.includes("rock") && uniqueMoves.includes("scissors")) {
      winningMove = "rock";
    } else if (uniqueMoves.includes("scissors") && uniqueMoves.includes("paper")) {
      winningMove = "scissors";
    } else if (uniqueMoves.includes("paper") && uniqueMoves.includes("rock")) {
      winningMove = "paper";
    }

    // Find the players who chose the winning move
    const winners = playerMoves
      .map((move, index) => (move === winningMove ? playerNames[index] : null))
      .filter(name => name !== null);

    result.innerText = `${winningMove.charAt(0).toUpperCase() + winningMove.slice(1)} wins! Winner(s): ${winners.join(", ")}`;
    winSound.play();
  }

  document.getElementById('reset').style.display = 'inline-block';
}
// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Reset the game
function resetGame() {
  document.getElementById('game').style.display = 'none';
  document.getElementById('intro-screen').style.display = 'block';
  document.getElementById('reset').style.display = 'none';
}
