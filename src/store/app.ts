import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc } from 'firebase/firestore'


export const useAppStore = defineStore('app', () => {
  const db = useFirestore()

  const rosterValue = ref(0)
  const curUserId = ref('')
  const baseInfo = useDocument(doc(db, 'base', 'base'))

  const userRef = computed(() => {
    if (curUserId && curUserId.value) {
      return doc(db, 'users', curUserId.value)
    }
  })
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

  return { baseInfo, rosterValue, curUserId, userRef, userData, players, playerMap, myRoster }
})
