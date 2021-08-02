export function getRandom() {
	return Math.random();
}

export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

export function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export function pickRandomFromArray(array) {
	let randomIdx = getRandomInt(0, array.length);
	return array[randomIdx];
}

const Random = {
	random: getRandom,
	float: getRandomArbitrary,
	int: getRandomInt,
	intInclusive: getRandomIntInclusive,
	pickFromArray: pickRandomFromArray,
};

export default Random;
