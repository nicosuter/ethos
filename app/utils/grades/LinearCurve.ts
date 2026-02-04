import { MAX_GRADE, MIN_GRADE } from "~/utils/constants";
import { GradeCurveType, type IGradeCurve } from "~/utils/grades/IGradeCurve";

export class LinearCurve implements IGradeCurve {
	public readonly type = GradeCurveType.LINEAR;
	public readonly m: number;
	public readonly c: number;

	constructor(m: number, c: number) {
		this.m = m;
		this.c = c;
	}
	getGrade(rawScore: number): number {
		return Math.min(Math.max(this.m * rawScore + this.c, MIN_GRADE), MAX_GRADE);
	}
}
