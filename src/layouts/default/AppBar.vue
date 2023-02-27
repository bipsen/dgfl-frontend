<template>
  <v-app-bar>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="localStore.drawer = !localStore.drawer"></v-app-bar-nav-icon>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useLocalStore } from '@/store/local'

const localStore = useLocalStore()
</script>
