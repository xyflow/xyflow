export const round = (x: number, multiple = 10) =>
	Math.round(x / multiple) * multiple;

export const roundDown = (x: number, multiple = 10) =>
	Math.floor(x / multiple) * multiple;

export const roundUp = (x: number, multiple = 10) =>
	Math.ceil(x / multiple) * multiple;
