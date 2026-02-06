import { type Ref, readonly, ref } from "vue";

export type Lecturer = {
	firstname: string;
	lastname: string;
	title?: string;
};

export type CourseDTO = {
	id: string;

	code?: string;
	semester?: string;

	title: string;
	description?: string;
	lecturers?: Lecturer[];

	links?: Record<string, string>;
};

export type EventItem = {
	id: string;
	courseId?: string;
	title: string;
	date: string; // ISO date string
	type: string;
	location?: string;
	category?: string; // optional category from ICS (e.g., course code)
};

type FetcherResult = { courses?: CourseDTO[]; events?: EventItem[] };

function createGlobalData() {
	const courses: Ref<CourseDTO[]> = ref([]);
	const events: Ref<EventItem[]> = ref([]);

	function getCourseById(id: string) {
		return courses.value.find((c) => c.id === id) ?? null;
	}

	function getEventsForCourse(courseId: string) {
		return events.value.filter((e) => e.courseId === courseId);
	}

	function addCourse(course: CourseDTO) {
		// simple uniqueness guard — if ID exists, append suffix
		const exists = courses.value.find((c) => c.id === course.id);
		let newCourse = { ...course } as CourseDTO;
		if (exists) {
			let i = 2;
			while (courses.value.find((c) => c.id === `${course.id}-${i}`)) i++;
			newCourse.id = `${course.id}-${i}`;
		}
		courses.value.push(newCourse);
		return newCourse;
	}

	return {
		courses,
		events,
		getCourseById,
		getEventsForCourse,
		addCourse,
	};
}

const globalData = createGlobalData();
export function useGlobalData() {
	return globalData;
}
