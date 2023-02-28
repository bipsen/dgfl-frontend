<template>
    <v-card>

        <v-toolbar v-if="event" :title="event.Title" />


        <v-table>
            <thead>
                <tr>
                    <th class="text-left">
                        Name
                    </th>
                    <th class="text-left">
                        Score
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="player in players" :key="player.name">
                    <td>{{ player.name }}</td>
                    <td>{{ player.score.toLocaleString() }}</td>
                </tr>
            </tbody>
        </v-table>
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
    return acc.sort((a, b) => b.score - a.score);
});

</script>