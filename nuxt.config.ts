// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		"@nuxt/ui",
		"@nuxt/a11y",
		"@nuxt/hints",
		"@nuxt/image",
		"@nuxt/scripts",
		"@nuxt/test-utils",
		"nuxt-open-fetch",
	],

	devtools: {
		enabled: true,
	},

	openFetch: {
		clients: {
			vvz: {
				baseURL: "/vvzProxy",
				schema: "https://vvzapi.ch/openapi.json",
			},
		},
	},

	css: ["~/assets/css/main.css"],

	routeRules: {
		"/": { prerender: true },
		"/dash/**": { ssr: false, appLayout: "dash" },
		"/vvzProxy/**": { proxy: "https://vvzapi.ch/**" },
	},

	compatibilityDate: "2025-01-15",
});
