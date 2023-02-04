// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    cash: 10000000,
    rosterValue: 0,
    drawer: false,
  }),
})
