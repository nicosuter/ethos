<script setup lang="ts">
import { computed } from "vue";

const { events } = useGlobalData();

// Keep events sorted by earliest date first
const sortedEvents = computed(() => {
	return (events.value ?? [])
		.slice()
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});
</script>

<template>
  <div>
    <header class="flex flex-col mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-muted">Overview of upcoming events and your courses</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <section class="md:col-span-2">
        <h2 class="text-xl font-semibold mb-3">Upcoming Events</h2>

        <div v-if="!sortedEvents || sortedEvents.length === 0" class="p-4 border rounded text-muted">No upcoming events</div>

        <ul v-else class="space-y-3">
          <li v-for="e in sortedEvents" :key="e.id" class="p-4 border rounded flex justify-between items-start">
            <div>
              <h3 class="font-semibold">{{ e.title }}</h3>
              <p class="text-sm text-muted">{{ new Date(e.date).toLocaleString() }} &middot; {{ e.location }}</p>
            </div>
            <div>
              <NuxtLink :to="`/dash/course/${e.courseId}`" v-if="e.courseId" class="u-btn u-btn--ghost">View course</NuxtLink>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
