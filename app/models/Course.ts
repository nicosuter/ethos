import type { CourseDTO, Lecturer } from "~/composables/useGlobalData";
import { useVvzApi } from "~/composables/useVvzApi";

/**
 * Lightweight CourseModel that wraps a serializable Course DTO and
 * provides behavior (lazy lecturer loading, caching).
 */
export class Course {
	private readonly dto: CourseDTO;
	private api: ReturnType<typeof useVvzApi>;
	private lecturersCache: Lecturer[] | null = null;
	private lecturersPromise: Promise<Lecturer[]> | null = null;

	constructor(dto: CourseDTO, api?: ReturnType<typeof useVvzApi>) {
		this.dto = dto;
		this.api = api ?? useVvzApi();
	}

	get id() {
		return this.dto.id;
	}

	get title() {
		return this.dto.title;
	}

	get description() {
		return this.dto.description;
	}

	get links() {
		return this.dto.links;
	}

	/**
	 * Returns any lecturers present in the DTO synchronously (may be undefined)
	 */
	get lecturersSync(): Lecturer[] | undefined {
		return this.dto.lecturers;
	}

	/**
	 * Lazy-load lecturers. Uses DTO lecturers if present unless `force` is true.
	 * Caches results per-instance and writes back into the DTO so callers
	 * holding the DTO see the populated data.
	 */
	async getLecturers(force = false): Promise<Lecturer[]> {
		if (!force && this.lecturersCache) return this.lecturersCache;
		if (!force && this.lecturersPromise) return this.lecturersPromise;

		// Prefer DTO-provided lecturers (fast path)
		if (this.dto.lecturers && !force) {
			this.lecturersCache = this.dto.lecturers;
			return this.lecturersCache;
		}

		// Otherwise, try to fetch by numeric unit id
		const unitId = Number(this.dto.id);
		if (!Number.isNaN(unitId)) {
			this.lecturersPromise = this.api.fetchLecturersByUnitId(unitId);
		} else {
			this.lecturersPromise = Promise.resolve([]);
		}

		const res = await this.lecturersPromise;
		this.lecturersCache = res;
		this.lecturersPromise = null;

		this.dto.lecturers = res;

		return res;
	}

	toDTO(): CourseDTO {
		// Return a shallow copy to avoid accidental mutation
		return { ...this.dto };
	}
}

export function createCourse(
	dto: CourseDTO,
	api?: ReturnType<typeof useVvzApi>,
) {
	return new Course(dto, api);
}
