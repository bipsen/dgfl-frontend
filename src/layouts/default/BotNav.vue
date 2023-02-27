<template>
    <v-bottom-navigation>
        <v-btn value="my-roster" to="/my-roster">
            <v-icon>mdi-account-group</v-icon>
            My roster
        </v-btn>

        <v-btn value="transfer" to="/transfer">
            <v-icon>mdi-swap-horizontal-bold</v-icon>
            Transfer
        </v-btn>

        <v-btn value="leaderboard" to="/leaderboard">
            <v-icon>mdi-podium-gold</v-icon>
            Leaderboard
        </v-btn>

        <v-btn @click="localStore.drawer = !localStore.drawer">
            <v-icon>mdi-menu</v-icon>
            More
        </v-btn>

    </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { useLocalStore } from '@/store/local'

const localStore = useLocalStore()
</script>

