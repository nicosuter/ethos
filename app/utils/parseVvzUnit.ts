import type { CourseDTO } from "~/composables/useGlobalData";
import type { SearchSuccessResponse, UnitSuccessResponse } from "~~/schema/vvz";

type VvzUnitLike =
	| SearchSuccessResponse["results"][number]["units"][number]
	| Exclude<UnitSuccessResponse, null>;

type LectureMaterialEntry = {
	url?: unknown;
	name?: unknown;
};

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
	const lm = (unit as { learning_materials?: unknown }).learning_materials;

	if (lm) {
		function addLink(baseTitle: string | undefined, url: string) {
			const titleBase = String(baseTitle ?? "resource");
			let key = titleBase;
			let idx = 1;
			while (links[key] !== undefined) {
				idx += 1;
				key = `${titleBase} (${idx})`;
			}
			links[key] = url;
		}

		if (Array.isArray(lm)) {
			for (const raw of lm) {
				const material = raw as LectureMaterialEntry;
				const url = material.url;
				if (!url) continue;
				addLink(material.name as string, material.url as string);
			}
		} else if (typeof lm === "object") {
			for (const [_groupKey, maybeArr] of Object.entries(lm)) {
				if (!Array.isArray(maybeArr)) continue;
				for (const raw of maybeArr) {
					const material = raw as LectureMaterialEntry;
					const url = material.url;
					if (!url) continue;
					addLink(material.name as string, url as string);
				}
			}
		}
	}

	return {
		id,
		code,
		semester,
		title,
		description,
		links,
	};
}
