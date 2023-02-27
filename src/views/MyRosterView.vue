<template>
  <v-alert closable type="error" icon="mdi-currency-usd-off" v-model="sellAlert">
    You bought this player this season. Please wait until after next
    event.
  </v-alert>

  <v-card class="pa-6">
    <valueChips />
    <div v-if="!compatabilityMode">
      <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="myRoster" item-value="name">
        <template v-slot:item.price="{ item }">
          {{ item.columns.price?.toLocaleString() }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-cash-fast" class="me-2" @click="sellPlayer(item.raw)" variant="text" />
        </template>
      </v-data-table>

      <v-card-text class="text-center">
        <v-btn variant="text" @click="compatabilityMode = !compatabilityMode">
          I don't see any players
          <v-icon icon="mdi-chevron-right"></v-icon>
        </v-btn>
      </v-card-text>
    </div>

    <div v-if="compatabilityMode">
      <v-table>
        <thead>
          <tr>
            <th v-for="header in headers" class="text-left">
              {{ header.title }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in myRoster" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.price.toLocaleString() }}</td>
            <td>
              <v-btn icon="mdi-cash-fast" class="me-2" @click="sellPlayer(item)" variant="text" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-card>

  <v-dialog v-model="dialogSell">
    <v-card title="Sell player">
      <v-card-text>
        Are you sure you want to sell {{ playerToSell ? playerMap[playerToSell].name : null }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="cancelSellPlayer">Cancel</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="sellPlayerConfirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import valueChips from '@/components/valueChips.vue'
import { ref, computed } from 'vue'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc, updateDoc, arrayRemove, increment } from 'firebase/firestore'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const { userRef, userData, playerMap, myRoster } = storeToRefs(appStore)

const itemsPerPage = ref(10)
const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Value', align: 'start', key: 'price' },
  { title: 'Sell', align: 'start', key: 'actions', sortable: false },
]

const dialogSell = ref(false)
const playerToSell = ref(null)
const sellAlert = ref(false)
const compatabilityMode = ref(false)

function sellPlayer(player: any) {
  playerToSell.value = player.id
  dialogSell.value = true
}

function cancelSellPlayer() {
  dialogSell.value = false
  playerToSell.value = null
}

async function sellPlayerConfirm() {
  dialogSell.value = false
  if (playerToSell.value && userData.value) {
    if (userData.value.justBought.includes(playerToSell.value)) {
      sellAlert.value = true
    } else {
      const playerPrice = playerMap.value[playerToSell.value].price
      await updateDoc(userRef.value, {
        cash: increment(playerPrice)
      });
      await updateDoc(userRef.value, {
        roster: arrayRemove(playerToSell.value)
      });
    }
  }
  playerToSell.value = null
}
</script>
