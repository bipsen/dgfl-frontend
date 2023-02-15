<template>
    <div class="text-center px-12 py-6">
        <v-card color="secondary">
            <div>
                <v-icon icon="mdi-cash" />
                Cash: {{ userData?.cash.toLocaleString() }}
            </div>
            <div>
                <v-icon icon="mdi-currency-usd" />
                Roster: {{ rosterValue?.toLocaleString() }}
            </div>
        </v-card>
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
            acc += playerMap.value[playerId]?.price
            return acc;
        }, 0);
    }
})
</script>