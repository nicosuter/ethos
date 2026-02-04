// Extend with other types of grade curves as needed
export enum GradeCurveType {
	LINEAR,
}

export interface IGradeCurve {
	type: GradeCurveType;
	getGrade(rawScore: number): number;
}
