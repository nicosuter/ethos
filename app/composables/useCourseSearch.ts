import {
	isSearchSuccessResponse,
	type SearchResponse,
	type SearchSuccessResponse,
} from "~~/schema/vvz";

export function useCourseSearch() {
	async function search(
		term: string,
	): Promise<SearchSuccessResponse["results"] | null> {
		if (term.length <= 4) return null;

		try {
			const data = await $fetch<SearchResponse>("/vvzProxy/api/v2/search", {
				query: { q: term },
			});
			if (!isSearchSuccessResponse(data))
				throw new Error(`API validation error: ${JSON.stringify(data)}`);
			return data.results;
		} catch (err) {
			console.error("Course search failed", err);
			return null;
		}
	}

	return { search };
}
