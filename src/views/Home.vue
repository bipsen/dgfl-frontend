<template>
  <h1>Home</h1>
  <p v-if="user">Hello {{ user.providerData[0].email }}</p>
</template>

<script lang="ts" setup>
import { useCurrentUser } from 'vuefire'

const user = useCurrentUser()
</script>
