import { type Ref, readonly, ref } from "vue";

export type Course = {
	id: string;
	title: string;
	description?: string;
	links?: Record<string, string>;
};

export type EventItem = {
	id: string;
	courseId?: string;
	title: string;
	date: string; // ISO date string
	type: string;
	location?: string;
};

type FetcherResult = { courses?: Course[]; events?: EventItem[] };

function createGlobalData() {
	const mode = ref<"mock" | "live">("mock");
	const courses: Ref<Course[]> = ref([]);
	const events: Ref<EventItem[]> = ref([]);
	const liveFetcher = ref<null | (() => Promise<FetcherResult>)>(null);

	const mockData: FetcherResult = {
		events: [
			{
				id: "e-1",
				courseId: "eth-101",
				title: "Lecture 1: Foundations",
				date: new Date().toISOString(),
				type: "lecture",
				location: "Room 101",
			},
			{
				id: "e-2",
				courseId: "math-201",
				title: "Homework 1 Due",
				date: new Date(Date.now() + 86400000).toISOString(),
				type: "deadline",
				location: "Online",
			},
			{
				id: "e-3",
				courseId: "cs-301",
				title: "Lab: Sorting",
				date: new Date(Date.now() + 2 * 86400000).toISOString(),
				type: "lab",
				location: "Lab B",
			},
		],
	};

	async function fetchData() {
		if (mode.value === "mock") {
			courses.value = mockData.courses ?? [];
			events.value = mockData.events ?? [];
			return;
		}

		if (!liveFetcher.value) {
			console.warn(
				"[useGlobalData] live mode but no liveFetcher registered — falling back to mock",
			);
			courses.value = mockData.courses ?? [];
			events.value = mockData.events ?? [];
			return;
		}

		try {
			const res = await liveFetcher.value();
			courses.value = res.courses ?? [];
			events.value = res.events ?? [];
		} catch (err) {
			console.error(
				"[useGlobalData] live fetcher failed, falling back to mock",
				err,
			);
			courses.value = mockData.courses ?? [];
			events.value = mockData.events ?? [];
		}
	}

	function setLiveFetcher(fn: () => Promise<FetcherResult>) {
		liveFetcher.value = fn;
	}

	async function setMode(m: "mock" | "live") {
		mode.value = m;
		await fetchData();
	}

	function getCourseById(id: string) {
		return courses.value.find((c) => c.id === id) ?? null;
	}

	function getEventsForCourse(courseId: string) {
		return events.value.filter((e) => e.courseId === courseId);
	}

	function addCourse(course: Course) {
		// simple uniqueness guard — if ID exists, append suffix
		const exists = courses.value.find((c) => c.id === course.id);
		let newCourse = { ...course } as Course;
		if (exists) {
			let i = 2;
			while (courses.value.find((c) => c.id === `${course.id}-${i}`)) i++;
			newCourse.id = `${course.id}-${i}`;
		}
		courses.value.push(newCourse);
		return newCourse;
	}

	// initial populate
	void fetchData();

	return {
		mode: readonly(mode),
		courses,
		events,
		setLiveFetcher,
		setMode,
		fetchData,
		getCourseById,
		getEventsForCourse,
		addCourse,
	};
}

const globalData = createGlobalData();
export function useGlobalData() {
	return globalData;
}
