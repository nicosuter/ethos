<script setup lang="ts">
const route = useRoute();
const id = String(route.params.id ?? "");
const links = getLinksForCourse(id);

const { data: course, pending } = await useAsyncData<Course | null>(
	`course-${id}`,
	async () => {
		const raw = coursesStorage.value?.courses?.[id];
		return raw ? ({ id, ...raw } as Course) : null;
	},
);
</script>

<template>
  <div>
    <div v-if="pending" class="text-center py-12">Loading course…</div>

    <div v-else-if="!course">
      <h1 class="text-2xl font-semibold">Course not found</h1>
      <p class="text-muted mt-2">We couldn't find a course with id "{{ $route.params.id }}".</p>
    </div>

    <div v-else class="prose lg:prose-lg prose-invert max-w-none">
      <header class="mb-6">
        <h2 class="text-3xl font-bold mt-0! mb-2!">{{ course.title }}</h2>
        <h6>{{ course.description }}</h6>
        <div v-if="links" class="flex gap-2 mt-4">
          <UButton
            v-if="links.moodle"
            :to="links.moodle"
            target="_blank"
            icon="i-heroicons-academic-cap"
            color="neutral"
            size="sm"
          >
            Moodle
          </UButton>
          <UButton
            v-if="links.examRepo"
            :to="links.examRepo"
            target="_blank"
            icon="i-heroicons-document-text"
            color="neutral"
            size="sm"
          >
            Exam Repo
          </UButton>
        </div>
      </header>
    </div>
  </div>
</template>
