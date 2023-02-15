<template>
  <v-app>
    <NavBar />

    <default-view />

    <BotNav />
  </v-app>
</template>

<script lang="ts" setup>
import NavBar from './NavBar.vue'
import DefaultView from './View.vue'
import BotNav from './BotNav.vue'
</script>
