export const useCourseSearch = () => {
	const search = async (q: string) => {
		if (q.length <= 4) return [];

		try {
			const data = await $fetch<any[]>("/vvzProxy/api/v2/search", {
				query: { q },
			});
			console.log(data);
			return data || [];
		} catch (err) {
			console.error("Course search failed", err);
			return [];
		}
	};

	return { search };
};
