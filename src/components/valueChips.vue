<template>
    <div class="text-center">
        <v-chip class="ma-2" color="success" variant="outlined">
            <v-icon start icon="mdi-cash"></v-icon>
            Cash: {{ userData?.cash }}
        </v-chip>

        <v-chip class="ma-2" color="primary" variant="outlined">
            <v-icon start icon="mdi-currency-usd"></v-icon>
            My roster worth: {{ rosterValue }}
        </v-chip>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc } from 'firebase/firestore'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const db = useFirestore()

const userRef = doc(db, 'users', appStore.curUserId)
const userData = useDocument(userRef)

const players = useCollection(collection(db, 'players'))
const playerMap = computed(() => {
    return players.value.reduce((acc, player) => {
        acc[player.id] = player;
        return acc;
    }, {});
})

const rosterValue = computed(() => {
    if (userData.value) {
        return userData.value.roster.reduce((acc, playerId) => {
            acc += playerMap.value[playerId].price
            return acc;
        }, 0);
    }
})
</script>