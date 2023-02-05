<template>
  <v-card class="pa-6">
    <valueChips />
    <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="myRoster" item-value="name">
      <template v-slot:item.actions="{ item }">
        <v-btn icon="mdi-cash-fast" class="me-2" @click="sellPlayer(item.raw)" variant="text" />
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="dialogSell">
    <v-card title="Sell player">
      <v-card-text>Are you sure you want to sell {{ playerToSell? playerMap[playerToSell].name : null}}?
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
  { title: 'Value', align: 'end', key: 'price' },
  { title: 'Sell', align: 'end', key: 'actions', sortable: false },
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

async function sellPlayerConfirm() {
  dialogSell.value = false
  if (playerToSell.value) {
    const playerPrice = playerMap.value[playerToSell.value].price
    await updateDoc(userRef, {
      cash: increment(playerPrice)
    });
    await updateDoc(userRef, {
      roster: arrayRemove(playerToSell.value)
    });
  }
  playerToSell.value = null
}
</script>
