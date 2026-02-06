import type { CourseDTO } from "~/composables/useGlobalData";
import type { SearchSuccessResponse, UnitSuccessResponse } from "~~/schema/vvz";

export type VvzUnitLike =
	| SearchSuccessResponse["results"][number]["units"][number]
	| Exclude<UnitSuccessResponse, null>;

export function parseVVZUnit(unit: VvzUnitLike): CourseDTO {
	const id = String(unit.id);
	const title =
		(unit.title_english && String(unit.title_english).trim()) ??
		(unit.title && String(unit.title).trim());
	if (!title) throw new Error("ParseError for VVZ unit: missing title");

	const code = unit.number ? String(unit.number) : undefined;
	const semester = unit.semkez ?? undefined;
	const description = unit.abstract_english ?? unit.abstract ?? undefined;

	const links: Record<string, string> = {};
	const lm = unit.learning_materials;
	if (lm && Array.isArray(lm) && lm.length > 0) {
		const links: Record<string, string> = {};
		lm.forEach((material) => {
			if (material.url && material.title) {
				links[material.title] = material.url;
			}
		});
	}

	return {
		id,
		code,
		semester,
		title,
		description,
		lecturers: undefined,
		links,
	};
}
