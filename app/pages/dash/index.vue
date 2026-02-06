<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";

const { events } = useGlobalData();

// Keep events sorted by earliest date first
const sortedEvents = computed(() => {
	return (events.value ?? [])
		.slice()
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

// ICS calendar integration
import { useIcsCalendar } from "~/composables/useIcsCalendar";
import dayjs from "dayjs";
import { coursesStorage } from "~/composables/useLocalStorage";

const { icsUrl, loading, error, fetchAndParse } = useIcsCalendar();
const inputIcs = ref(icsUrl.value ?? "");

// Helper to find course id by event category (course code). Accept exact match or contains.
function findCourseIdForCategory(cat?: string): string | null {
	if (!cat) return null;
	const courses = coursesStorage.value?.courses ?? {};
	for (const [id, course] of Object.entries(courses)) {
		// Match against course.code or the stored key
		if (course.code === cat) return id;
		if (String(course.code ?? "").includes(cat)) return id;
		if (id === cat) return id;
	}
	return null;
}

// Keep the input in sync with the persisted icsUrl (e.g., when loaded from localStorage)
watch(icsUrl, (v) => {
	inputIcs.value = v ?? "";
});

// On mount, if a Moodle ICS URL is already configured, fetch it so events persist across refreshes
onMounted(() => {
	if (icsUrl.value) {
		fetchAndParse();
	}
});

function saveAndFetch() {
	icsUrl.value = inputIcs.value.trim();
	fetchAndParse();
}
</script>

<template>
  <div>
    <header class="flex flex-col mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-muted">Overview of upcoming events</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <section class="md:col-span-2">
        <h2 class="text-xl font-semibold mb-3">Upcoming Events</h2>

        <UCard v-if="!icsUrl || icsUrl === ''">
          <p class="text-sm">No calendar configured. If you use Moodle, you can paste your personal calendar (ICS) URL here so events appear on your dashboard.</p>
          <div class="mt-3 flex gap-2">
            <UInput v-model="inputIcs" placeholder="https://your.moodle/.../calendar.ics" class="w-full"/>
            <UButton @click="saveAndFetch">Save</UButton>
          </div>
        </UCard>

        <UCard v-if="loading">Loading calendar…</UCard>
        <UCard v-if="error" class="text-red-400">{{ error }}</UCard>

        <UCard v-if="!loading && (!sortedEvents || sortedEvents.length === 0)">No upcoming events</UCard>

        <div v-else class="space-y-3">
          <UCard v-for="e in sortedEvents" :key="e.id" class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">{{ e.title }}</h3>
              <p class="text-sm text-muted">{{ dayjs(e.date).format("dddd, MMMM DD, YYYY") }} &middot; {{ e.location }}</p>
            </div>
            <div>
              <template v-if="findCourseIdForCategory(e.category)">
                <NuxtLink :to="`/dash/course/${findCourseIdForCategory(e.category)}`">View course</NuxtLink>
              </template>
              <template v-else>
                <span class="text-sm text-muted">Unknown Course</span>
              </template>
            </div>
          </UCard>
        </div>
      </section>
    </div>
  </div>
</template>
