<template>
  <v-card class="pa-6">
    <valueChips />

    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

    <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="unboughtPlayers" item-value="name"
      :search="search">
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.columns.name }}</td>
          <td>{{ item.columns.team }}</td>
          <td>{{ item.columns.price.toLocaleString() }}</td>
          <td>
            <v-btn icon="mdi-cart-outline" :disabled="item.columns.price > userData?.cash" class="me-2"
              @click="buyPlayer(item.raw)" variant="text" />
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>


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
import valueChips from '@/components/valueChips.vue'
import { ref, computed } from 'vue'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc, updateDoc, arrayUnion, increment } from 'firebase/firestore'
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
const search = ref("")
const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Team', align: 'start', key: 'team' },
  { title: 'Price', align: 'start', key: 'price' },
  { title: 'Buy', align: 'start', key: 'actions', sortable: false },
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
    const playerPrice = playerMap.value[playerToBuy.value].price
    if (playerPrice <= userData.value.cash) {
      await updateDoc(userRef, {
        cash: increment(-playerPrice)
      });
      await updateDoc(userRef, {
        roster: arrayUnion(playerToBuy.value)
      });
    } else {
      console.log("Too expensive")
    }
  }

  playerToBuy.value = null
}
</script>
