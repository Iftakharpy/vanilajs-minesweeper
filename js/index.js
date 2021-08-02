/*
Minesweeper rules
  - when clicked on empty cell reveal all the adjacent empty cells recursively
  - the cell value in the middle tells how many cells around that cell has mines
  - the cells which are empty can be shown without number in the cell
  - when clicked on a mine reveal all the mines and show end screen
  - when all the tiles are revealed except the mines show the wining screen


Minesweeper ui
  - cell colors for different type of cell
    marked - yellow
    boom/mine - red
    number - green
    hidden - theme color
  - right mouse click to mark cell
  - left mouse click to reveal cell
*/
import Board, { copyObject } from "./board.js";
const BOARD = document.querySelector(".board");

let boardConfig = {
	container: BOARD,
	height: 6,
	width: 6,
	mines: 8,
};

let jsBoard = new Board(BOARD);
jsBoard.fillBoard(BOARD);

document.addEventListener("keydown", (e) => {
	e.preventDefault();
	if (e.code === "F5") {
		jsBoard = new Board(...Object.values(boardConfig));
		jsBoard.fillBoard();
	}
});

BOARD.addEventListener("click", (e) => {
	let clickedCell = e.target;
	if (!clickedCell.matches(".row > .cell")) return;

	let cellId = clickedCell.dataset.id;
	let cell = jsBoard.getCellById(cellId);
	cell.isHidden = false;

	if (cell.isCount) clickedCell.dataset.type = "count";
	if (cell.isEmpty) {
		clickedCell.dataset.type = "";
		jsBoard.revealEmptyCellsAroundEmptyCell(cell);
		jsBoard.fillBoard();
	}
	if (cell.isMine) {
		jsBoard.fillBoard(null, true);
	}
});
BOARD.addEventListener("contextmenu", (e) => {
	let clickedCell = e.target;
	if (!clickedCell.matches(".row > .cell")) return;
	e.preventDefault();

	let cellId = clickedCell.dataset.id;
	let cell = jsBoard.getCellById(cellId);

	let cellType = clickedCell.dataset.type;
	if (cellType === "hidden") clickedCell.dataset.type = "marked";
	if (cellType === "marked") clickedCell.dataset.type = "hidden";
});
