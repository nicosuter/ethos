import { ref } from "vue";
import { useStorage } from "@vueuse/core";
import ICAL from "ical.js";
import { type EventItem, useGlobalData } from "~/composables/useGlobalData";

export function useIcsCalendar() {
	// persisted Moodle ICS URL (user provided)
	const icsUrl = useStorage<string>("moodleIcsUrl", "");
	const loading = ref(false);
	const error = ref<string | null>(null);

	async function fetchAndParse() {
		if (!icsUrl.value) {
			error.value = "No ICS URL configured";
			return [] as EventItem[];
		}

		loading.value = true;
		error.value = null;

		try {
			let query = "";
			try {
				// If user provided a full URL, extract its search params
				const u = new URL(icsUrl.value);
				query = u.search; // includes leading `?` or empty string
			} catch (e) {
				// If it's not a full URL, accept either a leading `?` query or a bare query string like `userid=...&authtoken=...`
				if (icsUrl.value.startsWith("?")) query = icsUrl.value;
				else if (icsUrl.value.includes("=")) query = `?${icsUrl.value}`;
				else throw new Error("Invalid ICS URL or query parameters");
			}

			const proxyUrl = `/moodleCalProxy/export_execute.php${query}`;

			const res = await fetch(proxyUrl);
			if (!res.ok) throw new Error(`Failed to fetch ICS: ${res.status}`);
			const text = await res.text();

			// parse with ical.js
			const jcal = ICAL.parse(text);
			const comp = new ICAL.Component(jcal);
			const vevents = comp.getAllSubcomponents("vevent");

			const parsed: EventItem[] = vevents.map((v) => {
				const ev = new ICAL.Event(v);
				const start = ev.startDate
					? ev.startDate.toJSDate().toISOString()
					: new Date().toISOString();
				// Try to read CATEGORY or CATEGORIES property from the component
				let category: string | undefined = undefined;
				try {
					// some ICS exports use 'categories' property; getFirstPropertyValue handles both single/multi
					const rawCat = v.getFirstPropertyValue("categories") as
						| string
						| string[]
						| undefined;
					if (Array.isArray(rawCat)) category = rawCat[0];
					else if (typeof rawCat === "string") category = rawCat;
				} catch (e) {
					// ignore if property missing
				}
				return {
					id: ev.uid || `${start}-${Math.random().toString(36).slice(2, 8)}`,
					title: ev.summary || "(no title)",
					date: start,
					type: "calendar",
					location: ev.location || undefined,
					category: category,
				};
			});

			// Write into global data's events (replace existing calendar-sourced events)
			const gd = useGlobalData();
			// remove previous events that have type === 'calendar' then append parsed
			gd.events.value = [
				...gd.events.value.filter((e) => e.type !== "calendar"),
				...parsed,
			];

			return parsed;
		} catch (err: unknown) {
			error.value = err instanceof Error ? err.message : String(err);
			return [] as EventItem[];
		} finally {
			loading.value = false;
		}
	}

	return { icsUrl, loading, error, fetchAndParse };
}
