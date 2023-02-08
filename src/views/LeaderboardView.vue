<template>
  <v-card class="pa-6" title="Leaderboard">
    <Bar :data="userWorth" :options="options" />
    <v-list class="pa-6">
      <v-toolbar>
        <v-toolbar-title>
          Players
        </v-toolbar-title>
      </v-toolbar>
      <v-list-group v-for="user in users" :key="user.name" :value="user.name">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="`${user.name} (${user.team})`"></v-list-item>
        </template>

        <v-list-item v-for="player in user.roster">{{ playerMap[player].name }}</v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useFirestore } from 'vuefire'
import { useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const db = useFirestore()
const users = useCollection(collection(db, 'users'))

const players = useCollection(collection(db, 'players'))
const playerMap = computed(() => {
  return players.value.reduce((acc, player) => {
    acc[player.id] = player;
    return acc;
  }, {});
})

const userWorth = computed(() => {
  let chartData = {
    labels: [],
    datasets: [
      {
        label: 'Roster worth',
        backgroundColor: '#cf6679',
        data: []
      },
      {
        label: 'Cash',
        backgroundColor: '#4caf50',
        data: []
      },
    ]
  }

  users.value.forEach((user) => {
    const acc_price = user.roster.reduce((acc_price, playerId) => {
      const playerData = playerMap.value[playerId]
      if (playerData) {
        acc_price += playerData.price;
      }
      return acc_price;
    }, 0);
    chartData.labels.push(user.name)
    chartData.datasets[0].data.push(acc_price)
    chartData.datasets[1].data.push(user.cash)
  })

  return chartData
})

const options = {
  plugins: {
    legend: {
      display: false
    }
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true
    }
  }
}

</script>
