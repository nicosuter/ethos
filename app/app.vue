<script setup>
useHead({
	meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
	link: [{ rel: "icon", href: "/favicon.ico" }],
	htmlAttrs: {
		lang: "en",
	},
});

const title = "Ethos";
const description = "Ethos — One Tab.";

useSeoMeta({
	title,
	description,
	ogTitle: title,
	ogDescription: description,
	ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
	twitterImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
	twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          &copy; {{ new Date().getFullYear() }}, The Ethos Contributors.
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/nicosuter/ethos"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
