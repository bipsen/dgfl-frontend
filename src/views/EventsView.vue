<template>
  <v-card class="pa-6">
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in sortedEvents" :key="item.Title">
          <td>{{ item.Title }} {{ item.Subtitle }}</td>
          <td>{{ item.Date_start.toDate().toLocaleDateString() }}</td>
          <td>{{ item.Date_end.toDate().toLocaleDateString() }}</td>
          <td>
            <v-btn :href="`https://www.pdga.com/tour/event/${item.Event_no}`" target="_blank" icon="mdi-open-in-new"
              variant="text" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
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
