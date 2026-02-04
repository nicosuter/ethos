export function colorCodeGrade(grade: number) {
	if (grade === 6) return "text-green-400";
	if (grade < 4) return "text-red-400";
	return "";
}
