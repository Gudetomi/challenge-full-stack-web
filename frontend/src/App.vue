<template>
  <app-layout v-if="isAuthenticatedPage" />
  <router-view v-else />
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const noLayoutRoutes = ['Login', 'Register', 'NotFound']
const isAuthenticatedPage = computed(() => {
  return !noLayoutRoutes.includes(route.name as string)
})
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
}
</style>