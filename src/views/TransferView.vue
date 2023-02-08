<template>
  <v-card class="pa-6">
    <valueChips />

    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

    <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="unboughtPlayers" item-value="name"
      :search="search" v-model:sort-by="sortBy">
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.columns.name }}</td>
          <td>{{ item.columns.team }}</td>
          <td v-if="item.columns.team != userData?.team">
            {{ item.columns.price.toLocaleString() }}
          </td>
          <td v-else>
            <s>{{ item.columns.price.toLocaleString() }}</s><br />
            <span>{{ discountPrice(item.columns.price).toLocaleString() }}</span>
          </td>
          <td>
            <v-btn icon="mdi-cart" class="me-2" @click="buyPlayer(item.raw)" variant="text" />
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>


  <v-dialog v-model="dialogBuy">
    <v-card title="Buy player">
      <v-card-text>
        Are you sure you want to buy {{ playerToBuy? playerMap[playerToBuy].name : null}}?
        You can only sell after next event.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="cancelBuyPlayer">Cancel</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="buyPlayerConfirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar" :timeout="5000" color="error">
    You cannot afford this player
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
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
      if (!userData.value?.roster.includes(player.id)) {
        acc.push(player);
      }
      return acc;
    }, []);
  }
})

const itemsPerPage = ref(10)
const search = ref("")
const sortBy = ref([{ key: 'price', order: 'desc' }],)
const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Team', align: 'start', key: 'team' },
  { title: 'Price', align: 'start', key: 'price' },
  { title: 'Buy', align: 'start', key: 'actions', sortable: false },
]

const dialogBuy = ref(false)
const playerToBuy = ref(null)
const snackbar = ref(false)

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
    let playerPrice = playerMap.value[playerToBuy.value].price
    if (userData.value?.team == playerMap.value[playerToBuy.value].team) {
      playerPrice = discountPrice(playerPrice)
    }
    if (playerPrice <= userData.value?.cash) {
      await updateDoc(userRef, {
        cash: increment(-playerPrice)
      });
      await updateDoc(userRef, {
        roster: arrayUnion(playerToBuy.value)
      });
      await updateDoc(userRef, {
        justBought: arrayUnion(playerToBuy.value)
      });
    } else {
      snackbar.value = true
    }
  }

  playerToBuy.value = null
}

function discountPrice(price: number) {
  return Math.round(price * .9)
}
</script>
