<template>
    <div class="text-center mx-auto py-6">
        <v-chip class="ma-2" size="large">
            Cash: ${{
                Intl.NumberFormat('en-US', {
                    notation: "compact",
                    maximumFractionDigits: 1
                }).format(userData?.cash)
            }}
            <v-tooltip activator="parent" location="bottom">
                {{ userData?.cash.toLocaleString() }}
            </v-tooltip>
        </v-chip>

        <v-chip class="ma-2" size="large">
            Roster: ${{
                Intl.NumberFormat('en-US', {
                    notation: "compact",
                    maximumFractionDigits: 1
                }).format(rosterValue)
            }}
            <v-tooltip activator="parent" location="bottom">
                {{ rosterValue?.toLocaleString() }}
            </v-tooltip>
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
            acc += playerMap.value[playerId]?.price
            return acc;
        }, 0);
    }
})
</script>