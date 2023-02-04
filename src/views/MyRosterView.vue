<template>
  <div class="text-center">
    <v-chip class="ma-2" color="primary" variant="outlined">
      <v-icon start icon="mdi-currency-usd"></v-icon>
      My roster worth: {{ appStore.rosterValue }}
    </v-chip>
  </div>
  <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="myRoster" item-value="name">
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" @click="sellPlayer(item.raw)">
        mdi-cart-outline
      </v-icon>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogSell">
    <v-card title="Sell player">
      <v-card-text>Are you sure you want to buy {{ playerToSell? playerMap[playerToSell].name : null}}?
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
import { ref, computed } from 'vue'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc } from 'firebase/firestore'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const db = useFirestore()

const userData = useDocument(doc(db, 'users', appStore.curUserId))
const players = useCollection(collection(db, 'players'))
const playerMap = computed(() => {
  return players.value.reduce((acc, player) => {
    acc[player.id] = player;
    return acc;
  }, {});
})

const myRoster = computed(() => {
  if (userData.value) {
    return userData.value.roster.reduce((acc, playerId) => {
      acc.push(playerMap.value[playerId]);
      return acc;
    }, []);
  }
})

const itemsPerPage = ref(10)
const headers = [
  { title: 'Name', align: 'end', key: 'name' },
  { title: 'Price', align: 'end', key: 'price' },
  { title: 'Actions', align: 'end', key: 'actions', sortable: false },
]

const dialogSell = ref(false)
const playerToSell = ref(null)

function sellPlayer(player: any) {
  playerToSell.value = player.id
  dialogSell.value = true
}

function cancelSellPlayer() {
  dialogSell.value = false
  playerToSell.value = null
}

function sellPlayerConfirm() {
  if (playerToSell.value) {
    console.log(playerMap.value[playerToSell.value].name)
    console.log(playerMap.value[playerToSell.value].price)
  }
  dialogSell.value = false
  playerToSell.value = null
}
</script>
