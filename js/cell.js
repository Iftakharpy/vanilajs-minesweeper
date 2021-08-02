export default class Cell {
	CELL_TYPES = {
		COUNT: Symbol.for("count"),
		MINE: Symbol.for("mine"),
		EMPTY: Symbol.for("empty"),
	};
	type = null;
	value = null;
	isMine = false;
	isHidden = true;

	constructor(value = null, mine = false) {
		value == null ? this.makeEmpty() : this.makeCount(value);
		if (mine == true) this.makeMine();
	}

	eq(other) {
		return this.value === other.value && this.type == other.type;
	}

	// setters
	makeCount(count) {
		this.value = count;
		this.isMine = false;
		this.type = this.CELL_TYPES.COUNT;
	}
	makeMine() {
		this.value = null;
		this.isMine = true;
		this.type = this.CELL_TYPES.MINE;
	}
	makeEmpty() {
		this.value = null;
		this.isMine = false;
		this.type = this.CELL_TYPES.EMPTY;
	}

	// getters
	get isCount() {
		return this.type == this.CELL_TYPES.COUNT && this.value !== null;
	}
	get isEmpty() {
		return this.type == this.CELL_TYPES.EMPTY && this.value === null;
	}
}
