import { defineStore } from 'pinia'
import { useCurrentUser } from 'vuefire'

export const useAppStore = defineStore('app', {
  state: () => ({
    rosterValue: 0,
    drawer: false,
    curUserId: ''
  })
})
