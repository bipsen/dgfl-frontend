<template>
    <v-bottom-navigation>
        <v-btn value="my-roster" to="/my-roster">
            <v-icon>mdi-account-group</v-icon>
            My roster
        </v-btn>

        <v-btn value="transfer" to="/transfer">
            <v-icon>mdi-cart</v-icon>
            Transfer
        </v-btn>

        <v-btn value="leaderboard" to="/leaderboard">
            <v-icon>mdi-podium-gold</v-icon>
            Leaderboard
        </v-btn>
    </v-bottom-navigation>
</template>

