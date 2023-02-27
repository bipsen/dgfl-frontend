<template>
    <v-card :title="event.Title">
        <v-list lines="one">
            <v-list-item v-for="player in players" :key="player.name">
                <v-list-item-title>
                    {{ player.name }}
                    <v-chip :color="player.score > 0 ? 'success' : 'error'">
                        {{ player.score.toLocaleString() }}
                    </v-chip>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFirestore, useDocument } from 'vuefire';
import { doc } from '@firebase/firestore';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const { playerMap } = storeToRefs(appStore)
const route = useRoute();
const db = useFirestore();

const event = useDocument(doc(db, 'events', route.params.id));
const players = computed(() => {
    const acc = [];
    for (const [playerId, score] of Object.entries(event.value?.data || {})) {
        const player = playerMap.value[playerId]
        if (player) {
            acc.push({
                name: player.name,
                score: score
            })
        }
    }
    return acc.sort((a, b) => b.score - a.score);;
});

</script>