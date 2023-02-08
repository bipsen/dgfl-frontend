<template>
  <v-card class="pa-6" title="Leaderboard">
    <Bar :data="userWorth" :options="options" />
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
        backgroundColor: '#f87979',
        data: []
      }
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
  })

  return chartData
})

const options = {
  plugins: {
    legend: {
      display: false
    }
  }
}

</script>
