<template>
  <v-app class="bg">
    <NavBar />
    <BotNav />
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import NavBar from './NavBar.vue'
import DefaultView from './View.vue'
import BotNav from './BotNav.vue'
</script>

<style scoped>
.bg {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://source.unsplash.com/h2P_QmHvL-Y");
  background-size: cover;
  background-position: center;
}
</style>

