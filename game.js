const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const xWinsDisplay = document.getElementById("xWins");
const oWinsDisplay = document.getElementById("oWins");

let currentPlayer = "X";
let board = Array(9).fill("");
let gameActive = false;
let mode = "";

let xWins = 0;
let oWins = 0;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");
  if (board[index] !== "" || !gameActive || (mode === 'ai' && currentPlayer === 'O')) return;

  makeMove(index, currentPlayer);

  if (mode === "ai" && gameActive) {
    setTimeout(() => {
      const bestMove = getBestMove();
      makeMove(bestMove, "O");
    }, 500);
  }
}

function makeMove(index, player) {
  if (board[index] !== "") return;

  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());

  if (checkWin(player)) {
    statusText.textContent = `Player ${player} wins this round! 🎉`;
    updateScore(player);
    checkChampion();
    gameActive = false;
    setTimeout(resetBoard, 2000);
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw! 🤝";
    gameActive = false;
    setTimeout(resetBoard, 2000);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function getBestMove() {
  return minimax(board, "O").index;
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);

  if (checkWinFor("X", newBoard)) return { score: -10 };
  if (checkWinFor("O", newBoard)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    move.score = minimax(newBoard, player === "O" ? "X" : "O").score;
    newBoard[availSpots[i]] = "";

    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWin(player) {
  return winConditions.some(([a, b, c]) =>
    board[a] === player && board[b] === player && board[c] === player
  );
}

function checkWinFor(player, testBoard) {
  return winConditions.some(([a, b, c]) =>
    testBoard[a] === player && testBoard[b] === player && testBoard[c] === player
  );
}

function updateScore(player) {
  if (player === "X") {
    xWins++;
    xWinsDisplay.textContent = xWins;
  } else {
    oWins++;
    oWinsDisplay.textContent = oWins;
  }
}

function checkChampion() {
  if (xWins === 3) {
    statusText.textContent = "🏆 Player X is the Champion!";
    gameActive = false;
  } else if (oWins === 3) {
    statusText.textContent = "🏆 Player O is the Champion!";
    gameActive = false;
  }
}

function resetBoard() {
  board = Array(9).fill("");
  currentPlayer = "X";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
  xWins = 0;
  oWins = 0;
  xWinsDisplay.textContent = "0";
  oWinsDisplay.textContent = "0";
  resetBoard();
}

restartBtn.addEventListener("click", resetGame);
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
