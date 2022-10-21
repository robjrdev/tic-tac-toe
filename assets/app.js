'use strict';

const winCondition = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let playHistory = [];
let prevHistory = [];
let playerTurn;
let gameActive;

const playerX = 'X';
const playerO = 'O';
const board = document.querySelector('.board');
const cellBox = document.querySelectorAll('.cell');
const winMessage = document.querySelector('.winningMessage');
const restart = document.getElementById('restart');
const nextMove = document.getElementById('next');
const prevMove = document.getElementById('prev');
const surpMessage = document.querySelector('.addMessage');
const gameControl = document.querySelector('.controls');
const just = document.querySelector('.just');

//Next Prev Move

//Check Winner
const checkWin = function (currentPlayer) {
  return winCondition.some(combination => {
    return combination.every(index => {
      return cellBox[index].classList.contains(currentPlayer);
    });
  });
};

//Switch Turn
const switchPlayer = function () {
  playerTurn = !playerTurn;
};

//Place Player
const cellMark = function (cell, currentPlayer) {
  cell.classList.add(currentPlayer);
  cell.textContent = currentPlayer;
};

//Check Draw
const endGame = function (draw) {
  if (draw) {
    winMessage.textContent = 'Draw';
    surpMessage.classList.remove('hide');
    gameActive = false;
  } else {
    winMessage.textContent = `${playerTurn ? "O's" : "X's"} Wins`;
    surpMessage.classList.remove('hide');
    gameActive = false;
  }
};

const isDraw = function () {
  return [...cellBox].every(cell => {
    return cell.classList.contains(playerO) || cell.classList.contains(playerX);
  });
};

//Watch Click
const handleClick = function (e) {
  const cell = e.target;
  const currentPlayer = playerTurn ? playerO : playerX;

  //mark
  if (gameActive) {
    cellMark(cell, currentPlayer);

    if (checkWin(currentPlayer)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      switchPlayer();
    }
    playHistory.push({ cell: cell.dataset.id, player: currentPlayer });
    gameControl.classList.remove('hide');
    just.classList.remove('hide');
  }
};

//Restart Game
const startGame = function () {
  playerTurn = false;
  cellBox.forEach(box => {
    box.classList.remove(playerO);
    box.classList.remove(playerX);
    box.textContent = '';
    surpMessage.classList.add('hide');
    box.removeEventListener('click', handleClick);
    box.addEventListener('click', handleClick, { once: true });
  });
  winMessage.textContent = '';
  playHistory = [];
  prevHistory = [];
  gameActive = true;
  gameControl.classList.add('hide');
  just.classList.add('hide');
};
startGame();
restart.addEventListener('click', startGame);

prevMove.addEventListener('click', () => {
  const popHistory = playHistory.pop();
  if (popHistory !== undefined) {
    prevHistory.push(popHistory);
    const box = document.querySelector(`[data-id='${popHistory.cell}']`);
    box.classList.remove(popHistory.player);
    box.textContent = '';
  }
});

nextMove.addEventListener('click', () => {
  const popHistory = prevHistory.pop();
  if (popHistory !== undefined) {
    playHistory.push(popHistory);
    const box = document.querySelector(`[data-id='${popHistory.cell}']`);
    box.classList.add(popHistory.player);
    box.textContent = popHistory.player;
  }
});
