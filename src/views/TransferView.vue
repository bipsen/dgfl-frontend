<template>
  <div class="text-center">
    <v-chip class="ma-2" color="success" variant="outlined">
      <v-icon start icon="mdi-cash"></v-icon>
      Cash: {{ userData?.cash }}
    </v-chip>

    <v-chip class="ma-2" color="primary" variant="outlined">
      <v-icon start icon="mdi-currency-usd"></v-icon>
      My roster worth: {{ appStore.rosterValue }}
    </v-chip>
  </div>
  <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="unboughtPlayers" item-value="name">
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" @click="buyPlayer(item.raw)">
        mdi-cart-outline
      </v-icon>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogBuy">
    <v-card title="Buy player">
      <v-card-text>Are you sure you want to buy {{ playerToBuy? playerMap[playerToBuy].name : null}}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="cancelBuyPlayer">Cancel</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="buyPlayerConfirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc, updateDoc, arrayUnion } from 'firebase/firestore'
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

const unboughtPlayers = computed(() => {
  if (userData.value) {
    return players.value.reduce((acc, player) => {
      if (!userData.value.roster.includes(player.id)) {
        acc.push(player);
      }
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

const dialogBuy = ref(false)
const playerToBuy = ref(null)

function buyPlayer(player: any) {
  playerToBuy.value = player.id
  dialogBuy.value = true
}

function cancelBuyPlayer() {
  dialogBuy.value = false
  playerToBuy.value = null
}

async function buyPlayerConfirm() {
  dialogBuy.value = false
  if (playerToBuy.value) {
    await updateDoc(userRef, {
      roster: arrayUnion(playerToBuy.value)
    });
  }

  playerToBuy.value = null
}
</script>