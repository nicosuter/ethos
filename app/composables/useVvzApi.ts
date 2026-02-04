export const useVvzApi = () => {
	const fetchCourseById = async (unitId: number) => {
		try {
			const data = await $fetch<any>(`/vvzProxy/api/v1/unit/${unitId}/get`);
			// Handle potential array or single object response
			const courseData = Array.isArray(data) ? data[0] : data;
			return courseData || null;
		} catch (e) {
			console.error("Failed to fetch course data", e);
			return null;
		}
	};

	const fetchLecturers = async (id: number) => {
		try {
			return await $fetch<never>(`/vvzProxy/api/v1/lecturer/get/${id}`);
		} catch {
			return id;
		}
	};

	const fetchLecturersByUnitId = async (unitId: number) => {
		try {
			const lecturerRefs = await $fetch<any[]>(
				`/vvzProxy/api/v1/unit/${unitId}/lecturers`,
			);

			if (!Array.isArray(lecturerRefs)) return [];

			// Fetch details for each lecturer
			return await Promise.all(
				lecturerRefs.map(async (l: number) => fetchLecturers(l)),
			);
		} catch (err) {
			console.error("Failed to fetch lecturers", err);
			return [];
		}
	};

	return {
		fetchCourseById,
		fetchLecturersByUnitId,
	};
};
