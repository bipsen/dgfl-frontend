<template>
  <v-card class="pa-6">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab value="table">Table</v-tab>
      <v-tab value="chart">Chart</v-tab>
      <v-tab value="players">Players</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="table">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">
                  Rank
                </th>
                <th class="text-left">
                  Name
                </th>
                <th class="text-left">
                  Total
                </th>
                <th class="text-left">
                  Cash
                </th>
                <th class="text-left">
                  Roster worth
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in playerWorths" :key="item.name">
                <td>{{ index+ 1 }}</td>
                <td>{{ item.name }}</td>
                <td style="font-weight: bold;">{{ (item.cash + item.rosterWorth).toLocaleString() }}</td>
                <td>{{ item.cash.toLocaleString() }}</td>
                <td>{{ item.rosterWorth.toLocaleString() }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-window-item>

        <v-window-item value="chart">
          <Bar :data="chartData" :options="options" />
        </v-window-item>

        <v-window-item value="players">
          <v-list>
            <v-list-group v-for="user in users" :key="user.name" :value="user.name">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :title="`${user.name} (${user.team})`"></v-list-item>
              </template>

              <v-list-item v-for="player in user.roster">{{ playerMap[player]?.name }}</v-list-item>
            </v-list-group>
          </v-list>
        </v-window-item>
      </v-window>
      <p class="pt-6">Last Updated: {{ baseInfo?.lastUpdate.toDate().toLocaleString() }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc } from 'firebase/firestore'
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

const tab = ref(null)

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const db = useFirestore()
const users = useCollection(collection(db, 'users'))

const baseInfo = useDocument(doc(db, 'base', 'base'))

const players = useCollection(collection(db, 'players'))
const playerMap = computed(() => {
  return players.value.reduce((acc, player) => {
    acc[player.id] = player;
    return acc;
  }, {});
})

const playerWorths = computed(() => {
  let data = []
  users.value.forEach((user) => {
    const rosterWorth = user.roster.reduce((acc_price, playerId) => {
      const playerData = playerMap.value[playerId]
      if (playerData) {
        acc_price += playerData.price;
      }
      return acc_price;
    }, 0);
    data.push({ "name": user.name, "cash": user.cash, "rosterWorth": rosterWorth }
    )
  })
  data.sort((a, b) => (b.cash + b.rosterWorth) - (a.cash + a.rosterWorth));
  return data
})

const chartData = computed(() => {
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
  playerWorths.value.forEach((user) => {
    chartData.labels.push(user.name)
    chartData.datasets[1].data.push(user.cash)
    chartData.datasets[0].data.push(user.rosterWorth)
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
