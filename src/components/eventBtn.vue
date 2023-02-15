<template>
    <v-btn :href="`https://www.pdga.com/tour/event/${props.eventNo}`" target="_blank" icon="mdi-open-in-new"
        variant="text" />
</template>

<script setup lang="ts">
const props = defineProps({
    eventNo: String
})
</script>