<template>
  <v-app-bar>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="appStore.drawer = !appStore.drawer"></v-app-bar-nav-icon>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
</script>
