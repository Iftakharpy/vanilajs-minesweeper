import Cell from "./cell.js";
import Random from "./random/index.js";

window.cell = Cell;

export default class Board {
	SIZE = {
		height: 9,
		width: 9,
	};
	CELLS = new Map();
	rows = [];
	mines = 9;
	visitedCells = new Set();

	constructor(boardContainer, height = 9, width = 9, mines = 10) {
		this.BOARD = boardContainer;
		this.SIZE.height = height;
		this.SIZE.width = width;
		this.mines = mines;
		this.generateRows(this.SIZE.height, this.SIZE.width);
		this.setMines();
		this.updateCellValues();
	}

	getCellById(id) {
		return this.CELLS.get(parseInt(id));
	}

	generateRows(height, width) {
		this.rows = [];
		let ids = cellIdGenerator();
		for (let h = 0; h < height; h++) {
			let row = [];
			for (let w = 0; w < width; w++) {
				let id = ids.next().value;
				let cell = new Cell(id);
				cell.id = id;
				this.CELLS.set(id, cell);
				row.push(cell);
			}
			this.rows.push(row);
		}
	}
	setMines() {
		let cellIds = [...this.CELLS.keys()];
		let pickedIds = new Set();

		while (pickedIds.size < this.mines && pickedIds.size !== cellIds.length) {
			let randomId = Random.pickFromArray(cellIds);
			if (pickedIds.has(randomId)) continue;

			pickedIds.add(randomId);
			let mine = this.CELLS.get(randomId);
			mine.makeMine();
		}
	}

	rowFromCell(cell) {
		return Math.floor(cell.id / this.SIZE.height);
	}
	columnFromCell(cell) {
		return cell.id % this.SIZE.width;
	}

	getCellsAroundCell(cell) {
		let cells = [];
		let checkCells = 3;
		let ignoreRight = cell.id % this.SIZE.width === 0; // cell is on the right column
		let ignoreLeft = cell.id % this.SIZE.width === 1; // cell is on the left column
		if (ignoreRight) checkCells--;

		// check top row
		let topLeftCellId = cell.id - this.SIZE.width - 1;
		for (let id = topLeftCellId; id < topLeftCellId + checkCells; id++) {
			let topRowCell = this.CELLS.get(id);
			if (
				topRowCell == null ||
				(ignoreLeft && this.columnFromCell(topRowCell) === 0)
			)
				continue;
			cells.push(topRowCell);
		}

		// check same row
		let sameLeftCellId = cell.id - 1;
		for (let id = sameLeftCellId; id < sameLeftCellId + checkCells; id++) {
			let middleRowCell = this.CELLS.get(id);

			if (
				middleRowCell == null ||
				cell.id === id ||
				(ignoreLeft && this.columnFromCell(middleRowCell) === 0)
			)
				continue;
			cells.push(middleRowCell);
		}
		// check bottom row
		let bottomLeftCellId = cell.id + this.SIZE.width - 1;
		for (
			let id = bottomLeftCellId;
			id < bottomLeftCellId + checkCells;
			id++
		) {
			let bottomRowCell = this.CELLS.get(id);

			if (
				bottomRowCell == null ||
				(ignoreLeft && this.columnFromCell(bottomRowCell) === 0)
			)
				continue;
			cells.push(bottomRowCell);
		}
		return cells;
	}

	countMinesAroundCell(cell) {
		let mines = 0;
		for (let c of this.getCellsAroundCell(cell)) {
			if (c.isMine) mines++;
		}
		return mines;
	}

	updateCellValues() {
		for (let [id, cell] of this.CELLS.entries()) {
			if (cell?.isMine) continue;
			let minesAroundCell = this.countMinesAroundCell(cell);
			if (minesAroundCell === 0) cell.makeEmpty();
			else cell.makeCount(minesAroundCell);
		}
	}

	getEmptyCells() {
		let emptyCells = [];
		for (let [id, cell] of this.CELLS.entries()) {
			if (cell.isEmpty) emptyCells.push(cell);
		}
		return emptyCells;
	}

	revealEmptyCellsAroundEmptyCell(cell) {
		if (cell == null || !cell.isEmpty || this.visitedCells.has(cell.id || 0))
			return null;
		this.visitedCells.add(cell.id);

		let neighbors = this.getCellsAroundCell(cell);
		for (let neighbor of neighbors) {
			if (neighbor.isEmpty) neighbor.isHidden = false;

			if (!this.visitedCells.has(neighbor.id) && neighbor.isEmpty) {
				this.revealEmptyCellsAroundEmptyCell(neighbor);
			}
		}
	}

	renderCell(cell) {
		let span = document.createElement("span");
		span.classList.add("cell");
		span.dataset.id = cell.id;
		span.dataset.type = "hidden";
		span.innerText = cell.value;

		if (cell.isCount && !cell.isHidden) span.dataset.type = "count";
		if (cell.isMine && !cell.isHidden) span.dataset.type = "mine";
		if (cell.isEmpty && !cell.isHidden) span.dataset.type = "";
		return span;
	}

	fillBoard(board = null, showall = false) {
		if (!board) board = this.BOARD;
		board.innerHTML = "";
		for (let row of this.rows) {
			let div = document.createElement("div");
			div.classList.add("row");

			for (let cell of row) {
				if (showall === true) cell.isHidden = false;
				div.appendChild(this.renderCell(cell));
			}
			board.appendChild(div);
		}
	}
}

function* cellIdGenerator() {
	let id = 1;
	while (true) {
		yield id;
		id++;
	}
}

export function copyObject(object) {
	Object.assign(Object.create(Object.getPrototypeOf(object)), object);
	return object;
}
