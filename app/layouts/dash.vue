<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/components/NavigationMenu.vue";
import { coursesStorage } from "~/composables/useLocalStorage";

const items: NavigationMenuItem[] = [
	{
		label: "Home",
		to: "/dash",
		icon: "i-heroicons-home-20-solid",
	},
	{
		label: "Courses",
		icon: "i-heroicons-book-open-20-solid",
		children: [
			...Object.entries(coursesStorage.value?.courses).map(([id, course]) => ({
				label: course.title,
				to: `/dash/course/${id}`,
			})),
			{
				label: "Add Course",
				icon: "heroicons:plus",
				to: "/dash/course/new",
			},
		],
	},
	{
		label: "Tools",
		icon: "i-heroicons-wrench-screwdriver-20-solid",
		children: [
			{
				label: "Grade Calculator (Manual)",
				to: "/dash/tools/grade-manual",
			},
		],
	},
	{
		label: "Food",
		icon: "material-symbols:fork-spoon",
	},
];
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar class="my-4">
      <NuxtLink to="/dash">
        <h1 class="font-bold uppercase text-muted text-xl select-none">Ethos</h1>
      </NuxtLink>
      <UNavigationMenu :items="items" orientation="vertical"/>
    </UDashboardSidebar>
    <div class="w-full p-6">
      <slot/>
    </div>
  </UDashboardGroup>
</template>
