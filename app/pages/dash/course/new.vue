<script setup lang="ts">
const router = useRouter();
const { search } = useCourseSearch();
const { fetchCourseById, fetchLecturersByUnitId } = useVvzApi();

const form = ref({
	id: null as null | string | number,
	title: "",
	description: "",
});

type SearchedCourse = {
	id: number;
	title: string;
	[key: string]: any;
};

const selectedCourse = ref<SearchedCourse | null>(null);

watch(selectedCourse, (val) => {
	if (val?.id) {
		// Only update if the values are actually different to prevent loops
		if (form.value.id !== val.id) form.value.id = val.id;
		if (form.value.title !== val.title) form.value.title = val.title;
	}
});

// Watch ID field and call useVvz to fetch title if ID looks valid
watch(
	() => form.value.id,
	async (newId: string | number | null) => {
		if (!newId) return;

		// Cast unit_id to number as required by the API
		const unitId = Number(newId);
		if (Number.isNaN(unitId)) return;

		// If the ID matches what we already selected, don't re-fetch
		if (selectedCourse.value?.id === unitId) return;

		try {
			const courseData = await fetchCourseById(unitId);

			if (courseData?.title) {
				form.value.title = courseData.title_english ?? courseData.title;

				// Fetch lecturers separately
				const lecturers = await fetchLecturersByUnitId(unitId);

				console.log(courseData);

				selectedCourse.value = {
					id: unitId,
					title: courseData.title_english ?? courseData.title,
					description: courseData.objective_english ?? courseData.objective,
					...courseData,
					lecturers,
				};
			}
		} catch (e) {
			console.error("Failed to fetch course data", e);
		}
	},
);

async function handleSubmit() {
	const hasId = !!form.value.id;
	const hasTitle = !!form.value.title;

	if (!hasId && !hasTitle) return;

	// Fallback for ID in explicit-title mode
	const id = hasId ? String(form.value.id) : crypto.randomUUID();
	// Fallback for Title in explicit-id mode
	const title = hasTitle ? form.value.title || "Unknown Course" : id;

	const description = selectedCourse.value?.description || "";

	const newCourse: Course = {
		id,
		title,
		description,
	};

	const existing = coursesStorage.value?.courses ?? {};
	const next = {
		...existing,
		[id]: {
			title: newCourse.title,
			description: newCourse.description,
		},
	};
	coursesStorage.value = { ...(coursesStorage.value ?? {}), courses: next };

	await router.push(`/dash/course/${newCourse.id}`);
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Add New Course</h1>
      <UCard class="mb-8">
        <div v-if="!selectedCourse && !form.id" class="text-zinc-400">
          Enter a Course ID or select a title to see a preview here.
        </div>
        <div v-else-if="!selectedCourse" class="text-zinc-400">
          Loading course data...
        </div>
        <div v-else>
          <div class="font-medium text-white">{{ selectedCourse.title }}</div>
          <div v-if="selectedCourse.lecturers" class="text-zinc-400 mt-1">
          <span v-for="(l, i) in selectedCourse.lecturers" :key="i">
            {{ l.name }} {{ l.surname.toUpperCase() }}<span v-if="i < selectedCourse.lecturers.length - 1">, </span>
          </span>
          </div>
          <div v-if="selectedCourse.description" class="text-zinc-400 mt-2">{{ selectedCourse.description }}</div>
        </div>
      </UCard>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-300">Course ID</label>
        <UInput
          v-model="form.id"
          placeholder="194074"
          required
        />
        <p class="text-xs text-zinc-500 select-none">Unique identifier for the course. This can be obtained from
          "lerneinheitId" in the URL when viewing a course on
          <NuxtLink to="https://vvz.ethz.ch" external target="_blank">VVZ</NuxtLink>
          .
        </p>
      </div>

      <div class="flex items-center py-2">
        <div class="grow border-t border-zinc-700"></div>
        <span class="px-2 text-sm text-zinc-500">OR</span>
        <div class="grow border-t border-zinc-700"></div>
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-300">Title</label>
        <UInputMenu
          v-model="selectedCourse"
          v-model:query="form.title"
          :search="search"
          option-attribute="title"
          placeholder="Diskrete Mathematik"
          :disabled="!!form.id"
          :required="!form.id"
          trailing
        >
          <template #empty="{ searchTerm }">
            &quot;{{ searchTerm }}&quot; not found
          </template>
        </UInputMenu>
      </div>

      <div class="pt-4 flex gap-4">
        <UButton
          type="submit"
        >
          Create Course
        </UButton>
        <UButton variant="ghost" color="neutral"
                 @click="router.push('/dash')"
        >
          Cancel
        </UButton>
      </div>
    </form>
  </div>
</template>
