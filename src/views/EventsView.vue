<template>
  <v-card>

    <v-toolbar title="Events" />

    <v-table>
      <thead>
        <tr>
          <th class="text-left">
            Title
          </th>

          <th class="text-left">
            Start date
          </th>
          <th class="text-left">
            End date
          </th>
          <th class="text-left">
            Result
          </th>
          <th class="text-left">
            PDGA
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in sortedEvents" :key="item.Title">
          <td>{{ item.Title }} {{ item.Subtitle }}</td>
          <td>{{ item.Date_start?.toDate().toLocaleDateString() }}</td>
          <td>{{ item.Date_end?.toDate().toLocaleDateString() }}</td>
          <td>
            <v-btn :value="item.id" :to="`/events/${item.id}`" icon="mdi-file-chart-check" variant="text"
              :disabled="item.Date_start?.toDate() > new Date()" />
          </td>
          <td>
            <eventBtn :eventNo="item.Event_no" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
import eventBtn from '@/components/eventBtn.vue'
import { computed } from 'vue'
import { useFirestore, useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'

const db = useFirestore()
const events = useCollection(collection(db, 'events'))
const sortedEvents = computed(() => {
  return events.value.sort((a, b) => a.Date_start - b.Date_start);
}
)
</script>
