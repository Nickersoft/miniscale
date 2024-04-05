/**
 * Miniscale -> A tiny package to work with modular scale
 * https://github.com/Nickersoft/miniscale
 */

type Step = {
	index: number;
	ratio: number;
	value: number;
	px: string;
	rem: string;
	em: string;
};

type StepFn = (index: number, multiplier?: number) => Step;

type TypeScale =
	| "minor-second"
	| "major-second"
	| "minor-third"
	| "major-third"
	| "perfect-fourth"
	| "augmented-fourth"
	| "perfect-fifth"
	| "golden";

const ratioMap: Record<TypeScale, number> = {
	"minor-second": 1.067,
	"major-second": 1.125,
	"minor-third": 1.2,
	"major-third": 1.25,
	"perfect-fourth": 1.333,
	"augmented-fourth": 1.414,
	"perfect-fifth": 1.5,
	golden: 1.618,
};
/**
 * Sets up a modular scale
 */
export function scale(base: number, scale: TypeScale | number): StepFn {
	const ratio = typeof scale === "string" ? ratioMap[scale] : scale;

	if (ratio <= 0) {
		throw new Error("Ratio must be larger than zero");
	}

	/**
	 * Returns the step at `index`
	 */
	return (index: number, multiplier = 1): Step => {
		const r = ratio ** index * multiplier;
		const v = base * r;

		return {
			index,
			ratio: r,
			value: v,
			px: `${v}px`,
			em: `${r}em`,
			rem: `${r}rem`,
		};
	};
}

/**
 * Generates an array of step values from a scale, between `min` and `max`
 */
export function getArray(ms, { min, max }): readonly Step[] {
	const steps = [];

	if (typeof min !== "number" || typeof max !== "number") {
		throw new Error("Min and max should be defined as numbers");
	}

	if (min <= 0) {
		throw new Error("Min must be larger than zero");
	}

	if (max <= min) {
		throw new Error("Max must be larger than min");
	}

	for (let index = 0; ms(index).value <= max; index++) {
		if (ms(index).value >= min) {
			steps.push(ms(index));
		}
	}

	for (let index = -1; ms(index).value >= min; index--) {
		if (ms(index).value <= max) {
			steps.unshift(ms(index));
		}
	}

	return steps;
}
