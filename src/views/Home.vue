<template>
  <div class="px-12 py-6">
    <v-card class="mx-auto" color="purple" elevation="20">
      <div class="d-flex justify-between">
        <v-card-title class="flex-grow-1 flex-column align-start">
          <div class="text-h5">
            {{ userData?.name }}
          </div>
          <div class="text-h6 font-weight-thin">{{ userData?.team }}</div>
        </v-card-title>
      </div>
    </v-card>
  </div>
  <valueChips />
</template>

<script lang="ts" setup>
import valueChips from '@/components/valueChips.vue'
import { useFirestore, useDocument } from 'vuefire'
import { doc } from 'firebase/firestore'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const db = useFirestore()

const userRef = doc(db, 'users', appStore.curUserId)
const userData = useDocument(userRef)
</script>
