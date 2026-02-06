import type { CourseDTO, Lecturer } from "~/composables/useGlobalData";
import { createCourse } from "~/models/Course";
import {
	isUnitSuccessResponse,
	type LecturerProfileResponse,
	type UnitLecturersResponse,
	type UnitResponse,
} from "~~/schema/vvz";

export function useVvzApi() {
	async function fetchCourse(unitId: number): Promise<CourseDTO | null> {
		try {
			const data = await $fetch<UnitResponse>(
				`/vvzProxy/api/v1/unit/${unitId}/get`,
			);
			if (!isUnitSuccessResponse(data)) return null;
			return data
				? ({
						...data,
						id: data.id.toString(),
						code: data.number,
						description: data.abstract_english ?? data.abstract,
						semester: data.semkez,
					} as CourseDTO)
				: null;
		} catch (e) {
			console.error("Failed to fetch course data", e);
			return null;
		}
	}

	async function fetchLecturer(id: number): Promise<Lecturer | null> {
		try {
			const data = await $fetch<LecturerProfileResponse>(
				`/vvzProxy/api/v1/lecturer/get/${id}`,
			);
			const l = Array.isArray(data) ? data[0] : data;
			if (!l) return null;
			return {
				firstname: l.name,
				lastname: l.surname,
				title: l.title,
			};
		} catch (e) {
			console.error("Failed to fetch lecturer", e);
			return null;
		}
	}

	async function fetchLecturersByUnitId(unitId: number): Promise<Lecturer[]> {
		try {
			const lecturerRefs = await $fetch<UnitLecturersResponse>(
				`/vvzProxy/api/v1/unit/${unitId}/lecturers`,
			);

			if (!Array.isArray(lecturerRefs)) return [];

			// Fetch details for each lecturer and filter out nulls
			const results = await Promise.all(
				lecturerRefs.map(async (l: number) => fetchLecturer(l)),
			);
			return results.filter((x): x is Lecturer => x !== null);
		} catch (err) {
			console.error("Failed to fetch lecturers", err);
			return [];
		}
	}

	/**
	 * Convenience: returns a CourseModel instance wrapping the fetched DTO.
	 * This should be used client-side (models with methods are not safe to serialize over SSR).
	 */
	async function fetchCourseModel(unitId: number) {
		const dto = await fetchCourse(unitId);
		if (!dto) return null;
		return createCourse(dto, useVvzApi());
	}

	return {
		fetchCourseById: fetchCourse,
		fetchLecturersByUnitId,
		fetchCourseModel,
	};
}
