import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useLocalStore = defineStore('local', () => {
  const drawer = ref(false)
  return { drawer }
})
