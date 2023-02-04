<template>
  <v-app>
    <default-bar />
    <NavBar />

    <default-view />

    <BotNav />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from './AppBar.vue'
import NavBar from './NavBar.vue'
import DefaultView from './View.vue'
import BotNav from './BotNav.vue'
</script>
