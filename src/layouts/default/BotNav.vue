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

        <v-btn @click="appStore.drawer = !appStore.drawer">
            <v-icon>mdi-menu</v-icon>
            More
        </v-btn>

    </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
</script>
