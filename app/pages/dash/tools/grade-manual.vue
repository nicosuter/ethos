<script setup lang="ts">
import { colorCodeGrade } from "~/utils/ui/ColorCoding";

type LocalCourse = {
	id: string;
	name: string;
	grade: number | null;
	bonus: number | null;
};

const rows = ref<LocalCourse[]>([
	{ id: "c1", name: "", grade: null, bonus: 0 },
]);

const targetGrade = ref<number | null>(null);

function addRow() {
	const i = rows.value.length + 1;
	rows.value.push({ id: `c${i}`, name: "", grade: null, bonus: 0 });
}

function removeRow(id: string) {
	rows.value = rows.value.filter((r) => r.id !== id);
}

function getValue(e: Event) {
	const val = (e.target as HTMLInputElement).value;
	return val === "" ? null : Number(val);
}

function updateRow(
	r: LocalCourse,
	[grade, bonus]: [number | null | undefined, number | null | undefined],
) {
	if (grade !== undefined) r.grade = grade;
	if (bonus !== undefined) r.bonus = bonus;
}

function finalForKnown(r: LocalCourse): number | null {
	if (r.grade === null) return null;
	const g = Number(r.grade ?? 0);
	const b = Number(r.bonus ?? 0);
	let result = g + b;
	if (result > MAX_GRADE) result = MAX_GRADE;
	if (result < MIN_GRADE) result = MIN_GRADE;
	return result;
}

function finalFor(r: LocalCourse): number {
	const g = Number(r.grade ?? 0);
	const b = Number(r.bonus ?? 0);
	let result = g + b;
	if (result > MAX_GRADE) result = MAX_GRADE;
	if (result < MIN_GRADE) result = MIN_GRADE;
	return result;
}

const totals = computed(() => {
	const finals = rows.value
		.map((r) => finalForKnown(r))
		.filter((v): v is number => v !== null);
	const knownSum = finals.reduce((s, v) => s + v, 0);
	const avgKnownOnly = finals.length ? knownSum / finals.length : 0;
	const min = finals.length ? Math.min(...finals) : 0;
	const max = finals.length ? Math.max(...finals) : 0;
	return {
		avgKnownOnly,
		min,
		max,
		count: rows.value.length,
		knownCount: finals.length,
		knownSum,
	};
});

const needed = computed(() => {
	const t = targetGrade.value;
	if (t === null) return null;
	const totalCourses = rows.value.length;
	if (totalCourses === 0) return null;
	const unknownCount = rows.value.filter((r) => r.grade === null).length;
	if (unknownCount === 0) return null;

	// total points required to reach target average (t) across all courses
	const requiredTotal = t * totalCourses;
	const neededSum = requiredTotal - totals.value.knownSum;
	const neededAvg = neededSum / unknownCount;

	return {
		neededAvg,
		impossible: neededAvg > MAX_GRADE,
	};
});

function formatGrade(n: number) {
	return `${Math.round(n * 4) / 4}`;
}
</script>

<template>
  <div>
    <header class="flex items-center justify-between mb-4 gap-4">
      <div>
        <h1 class="text-lg font-semibold">Grade Calculator</h1>
        <div class="text-sm text-muted">Quick, local-only calculations</div>
      </div>

      <div class="flex items-center gap-2">
        <UInput v-model.number="targetGrade" type="number" :min="MIN_GRADE" :max="MAX_GRADE" step="0.01" placeholder="Target Grade" class="w-32" />
        <UButton @click="addRow">Add Course</UButton>
      </div>
    </header>

    <div class="space-y-3">
      <div v-for="r in rows" :key="r.id" class="flex gap-2 items-center">
        <input v-model="r.name" placeholder="Course" class="flex-1 p-2 border rounded" />
        <input :value="r.grade" @input="(e) => updateRow(r, [getValue(e), undefined])" type="number" :min="MIN_GRADE" :max="MAX_GRADE" step="0.01" placeholder="Grade" class="w-20 p-2 border rounded text-right" />
        <input :value="r.bonus" @input="(e) => updateRow(r, [undefined, getValue(e)])" type="number" :min="0" :max="MAX_GRADE" step="0.01" placeholder="Bonus" class="w-20 p-2 border rounded text-right" />
        <div class="w-28 text-right font-semibold">{{ r.grade === null ? '—' : formatGrade(finalFor(r)) }}</div>
        <UButton @click="removeRow(r.id)" color="error" variant="soft">Remove</UButton>
      </div>
    </div>

    <div class="mt-4 p-3 border rounded bg-zinc-900">
      <div class="text-sm text-muted">Summary ({{ totals.count }} courses; {{ totals.knownCount }} known)</div>
      <div class="mt-2 flex gap-4 items-center flex-wrap">
        <span>Average (known only): <strong :class="colorCodeGrade(totals.avgKnownOnly)">{{ formatGrade(totals.avgKnownOnly) }}</strong></span>
        <span>Min: <strong :class="colorCodeGrade(totals.min)">{{ formatGrade(totals.min) }}</strong></span>
        <span>Max: <strong :class="colorCodeGrade(totals.max)">{{ formatGrade(totals.max) }}</strong></span>

        <div v-if="needed" class="ml-4">
          <div class="text-sm text-muted">Needed average across unknown courses to reach target {{ formatGrade(Number(targetGrade)) }}:</div>
          <div v-if="needed.impossible" class="text-red-400 font-semibold">Impossible</div>
          <div v-else class="font-semibold" :class="colorCodeGrade(needed.neededAvg)">{{ formatGrade(needed.neededAvg) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
