<template>
  <v-card class="px-6" title="Rules">
    <v-card-text>
      <v-list density="compact">
        <v-list-item>Goal: to increase your roster value by owning players who perform well at events.</v-list-item>
        <v-list-item>After each event, players values increase by the system below.</v-list-item>
        <v-list-item>If you sell a player, you can only buy them back after next event.</v-list-item>
        <v-list-item>You get a 10% discount on players from your team.</v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
  <v-card class="px-6" title="Scoring System">
    <v-card-text>
      <v-list density="compact">
        <v-list-subheader>Per Hole Scoring</v-list-subheader>
        <v-list-item>Albatross: 5.000</v-list-item>
        <v-list-item>Eagle: 1.000</v-list-item>
        <v-list-item>Birdie: 500</v-list-item>
        <v-list-item>Par: 250</v-list-item>
        <v-list-item>Bogey: -250</v-list-item>
        <v-list-item>Double Bogey: -500</v-list-item>
        <v-list-item>Worse than Double Bogey: -1.000</v-list-item>
      </v-list>

      <v-list density="compact">
        <v-list-subheader>Tournament Finish Scoring</v-list-subheader>
        <v-list-item>1st: 30.000</v-list-item>
        <v-list-item>2nd: 20.000</v-list-item>
        <v-list-item>3rd: 18.000</v-list-item>
        <v-list-item>4th: 16.000</v-list-item>
        <v-list-item>5th: 14.000</v-list-item>
        <v-list-item>6th: 12.000</v-list-item>
        <v-list-item>7th: 10.000</v-list-item>
        <v-list-item>8th: 9.000</v-list-item>
        <v-list-item>9th: 8.000</v-list-item>
        <v-list-item>10th: 7.000</v-list-item>
        <v-list-item>11th–15th: 6.000</v-list-item>
        <v-list-item>16th–20th: 5.000</v-list-item>
        <v-list-item>21st–25th: 4.000</v-list-item>
        <v-list-item>26th–30th: 3.000</v-list-item>
        <v-list-item>31st–40th: 2.000</v-list-item>
        <v-list-item>41st-50th: 1.000</v-list-item>
      </v-list>

      <v-list density="compact">
        <v-list-subheader>Streaks and Bonuses</v-list-subheader>
        <v-list-item>Streak of 3 Birdies of Better (Max 1 Per Round): 3.000</v-list-item>
        <v-list-item>Bogey Free Round: 3.000</v-list-item>
        <v-list-item>Ace: 10.000</v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>

</script>