
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");
const resetScoreButton = document.getElementById("reset-score");
const xScoreText = document.getElementById("x-wins");
const oScoreText = document.getElementById("o-wins");
const xScoreBox = document.getElementById("x-score");
const oScoreBox = document.getElementById("o-score");

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let scores = { X: 0, O: 0 };

cells.forEach((cell) => {
    cell.addEventListener("click", () => {
        const index = Number(cell.dataset.index);

        if (!gameActive || board[index] !== "") {
            return;
        }

        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        cell.disabled = true;
        cell.setAttribute("aria-label",
            `Cell ${index + 1}: ${currentPlayer}`);

        if (checkWinner()) {
            statusText.textContent = `Player ${currentPlayer} wins! 🎉`;
            scores[currentPlayer]++;
            updateScores();
            gameActive = false;
            cells.forEach((c) => c.disabled = true);
            return;
        }

        if (board.every((value) => value !== "")) {
            statusText.textContent = "It's a draw! 🤝";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s turn`;
        updateActivePlayer();
    });
});

function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            combination.forEach((index) => {
                cells[index].classList.add("winner");
            });
            return true;
        }
    }

    return false;
}

function updateScores() {
    xScoreText.textContent = scores.X;
    oScoreText.textContent = scores.O;
}

function updateActivePlayer() {
    xScoreBox.classList.toggle("active", currentPlayer === "X");
    oScoreBox.classList.toggle("active", currentPlayer === "O");
}

function restartRound() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    cells.forEach((cell, index) => {
        cell.textContent = "";
        cell.disabled = false;
        cell.classList.remove("x", "o", "winner");
        cell.setAttribute("aria-label", `Cell ${index + 1}`);
    });

    statusText.textContent = "Player X's turn";
    updateActivePlayer();
}

restartButton.addEventListener("click", restartRound);

resetScoreButton.addEventListener("click", () => {
    scores = { X: 0, O: 0 };
    updateScores();
    restartRound();
});