<template>
  <div class="pt-12 px-12" style="text-align: center;" align-center>
    <h1 class="font-weight-black">DISC GOLF FANTASY LEAGUE</h1>
  </div>
  <div class="pt-6 px-6">
    <v-card class="mx-auto">
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

  <div class="pt-6 px-6">
    <v-card class="mx-auto">
      <div class="d-flex justify-between">
        <v-card-title class="flex-grow-1 flex-column align-start">
          <div class="text-h6 font-weight-thin">Next event:</div>
          <div class="text-h5">
            {{ nextEvent?.Title }}
            <eventBtn :eventNo="nextEvent?.Event_no" />
          </div>
        </v-card-title>
      </div>
    </v-card>
  </div>

  <valueChips class="mt-12" />

</template>


<script lang="ts" setup>
import valueChips from '@/components/valueChips.vue'
import eventBtn from '@/components/eventBtn'
import { computed } from 'vue'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc } from 'firebase/firestore'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const db = useFirestore()

const userRef = doc(db, 'users', appStore.curUserId)
const userData = useDocument(userRef)

const events = useCollection(collection(db, 'events'))
const nextEvent = computed(() => {
  const today = new Date();
  const filteredDates = events.value.filter(date => new Date(date.Date_end.seconds * 1000) >= today);
  const sortedEvents = filteredDates.sort((a, b) => a.Date_start - b.Date_start);
  return sortedEvents[0]
})
</script>