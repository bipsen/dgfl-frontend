<template>
  <v-alert closable type="error" icon="mdi-currency-usd-off" v-model="buyAlert">
    You cannot afford this player
  </v-alert>

  <v-card class="pa-6">
    <valueChips />

    <div v-if="!compatabilityMode">
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
              <div class="d-flex justify-space-between">
                <v-btn :href="`https://www.pdga.com/player/${item.raw.pdgaNumber}`" target="_blank"
                  icon="mdi-information-outline" variant="text" />
                <v-btn icon="mdi-cart" @click="buyPlayer(item.raw)" variant="text" />
              </div>
            </td>
          </tr>
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
          <tr v-for="item in unboughtPlayers" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.team }}</td>
            <td v-if="item.team != userData?.team">
              {{ item.price.toLocaleString() }}
            </td>
            <td v-else>
              <s>{{ item.price.toLocaleString() }}</s><br />
              <span>{{ discountPrice(item.price).toLocaleString() }}</span>
            </td>
            <td>
              <v-btn :href="`https://www.pdga.com/player/${item.pdgaNumber}`" target="_blank"
                icon="mdi-information-outline" variant="text" />
              <v-btn icon="mdi-cart" class="me-2" @click="buyPlayer(item)" variant="text" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-card>

  <v-dialog v-model="dialogBuy">
    <v-card title="Buy player">
      <v-card-text>
        Are you sure you want to buy {{ playerToBuy ? playerMap[playerToBuy].name : null }}?
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

const compatabilityMode = ref(false)
const itemsPerPage = ref(10)
const search = ref("")
const sortBy = ref([{ key: 'price', order: 'desc' }],)
const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Team', align: 'start', key: 'team' },
  { title: 'Price', align: 'start', key: 'price' },
  { title: 'Actions', align: 'start', key: 'actions', sortable: false },
]

const dialogBuy = ref(false)
const playerToBuy = ref(null)
const buyAlert = ref(false)

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
      buyAlert.value = true
    }
  }

  playerToBuy.value = null
}

function discountPrice(price: number) {
  return Math.round(price * .9)
}
</script>