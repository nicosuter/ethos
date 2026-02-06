<script setup lang="ts">
const route = useRoute();
const id = String(route.params.id ?? "");

const { data: course, pending } = await useAsyncData<CourseDTO | null>(
	`course-${id}`,
	async () => {
		const raw = coursesStorage.value?.courses?.[id];
		return raw ? ({ id, ...raw } as CourseDTO) : null;
	},
);

import { computed } from "vue";
import { coursesStorage } from "~/composables/useLocalStorage";
const router = useRouter();

// Compute any remaining links that are not handled explicitly (moodle, examRepo)
const extraLinks = computed(() => {
	const links = course?.value?.links ?? {};
	return Object.entries(links).filter(
		([k]) => !["moodle", "examRepo"].includes(k),
	);
});

function prettyKey(key: string) {
	return String(key)
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, (m) => m.toUpperCase());
}

function deleteCourse() {
	const name = course?.value?.title ?? id;
	if (!confirm(`Delete course "${name}"? This cannot be undone.`)) return;

	const existing = coursesStorage.value?.courses ?? {};
	if (Object.hasOwn(existing, id)) {
		const next = { ...existing };
		delete next[id];
		coursesStorage.value = { ...(coursesStorage.value ?? {}), courses: next };
	}

	router.push("/dash");
}
</script>

<template>
  <div>
    <div v-if="pending" class="text-center py-12">Loading course…</div>

    <div v-else-if="!course">
      <h1 class="text-2xl font-semibold">Course not found</h1>
      <p class="text-muted mt-2">We couldn't find a course with ID "{{ $route.params.id }}".</p>
    </div>

    <div v-else class="prose lg:prose-lg prose-invert max-w-none">
      <header class="mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-3xl font-bold mt-0! mb-2!">{{ course.title }}</h2>
            <div class="flex items-center gap-4 text-sm text-zinc-400 mb-2">
              <div>
                <span class="font-medium text-zinc-300">Course ID:</span>
                <span class="ml-1">{{ course.id }} <span v-if="course.code">({{ course.code }})</span></span>
              </div>
              <div v-if="course.lecturers">
                <span class="font-medium text-zinc-300">Lecturer<span v-if="course.lecturers.length > 1">s</span>:</span>
                <span class="ml-1">
                  <span v-for="(l, idx) in course.lecturers" :key="idx">
                    {{ l.title ? l.title + ' ' : '' }}{{ l.firstname }} {{ l.lastname.toUpperCase() }}<span
                    v-if="idx < course.lecturers.length - 1">, </span>
                  </span>
                </span>
              </div>
            </div>

            <h6>{{ course.description }}</h6>

            <h3>Assignment Grade Average</h3>
            <p>Not implemented yet.</p>

            <h4>Estimated Bonus</h4>
            <p>Not implemented yet.</p>
          </div>

          <div class="flex items-start gap-2">
            <div v-if="course.links" class="flex gap-2 mt-0">
              <NuxtLink v-if="course.links.moodle" :to="course.links.moodle" target="_blank">
                <UButton icon="i-heroicons-academic-cap" color="neutral" size="sm" class="cursor-pointer whitespace-nowrap">
                  Moodle
                </UButton>
              </NuxtLink>
              <NuxtLink target="_blank" external :to="course.links.examRepo" v-if="course.links.examRepo">
                <UButton icon="i-heroicons-document-text" color="neutral" size="sm" class="cursor-pointer whitespace-nowrap">
                  Exam Repo
                </UButton>
              </NuxtLink>
              <NuxtLink v-for="([key, url]) in extraLinks" :key="key" :to="url as string" target="_blank" rel="noopener" external>
                <UButton icon="i-heroicons-link-20-solid" color="neutral" size="sm" class="cursor-pointer whitespace-nowrap">
                  {{ prettyKey(key) }}
                </UButton>
              </NuxtLink>
            </div>

            <UButton variant="ghost" color="error" @click="deleteCourse" class="cursor-pointer whitespace-nowrap">
              Delete
            </UButton>
          </div>
        </div>
      </header>

      <h2>Resources</h2>
      <p>None yet. Feel free to add useful resources by opening an issue on <NuxtLink external target="_blank" to="https://github.com/nicosuter/ethos/issues">GitHub</NuxtLink>!</p>

      <h2>Upcoming Assignments</h2>
      <p>Not implemented yet.</p>

      <h2>Past Assignments</h2>
      <p>Not implemented yet.</p>
    </div>
  </div>
</template>
