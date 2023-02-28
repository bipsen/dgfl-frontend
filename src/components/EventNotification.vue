<template>
    <v-dialog v-model="dialog">
        <v-card>
            <div v-if="lastEvent.data">
                <v-card-title>
                    {{ lastEvent.data.Title }}
                    <v-btn :to="`/events/${lastEventId}`" icon="mdi-open-in-new" variant="text" @click="dialog = false" />
                </v-card-title>

                <v-card-subtitle>
                    Your player performance
                </v-card-subtitle>

                <v-card-text>
                    <v-list lines="one">
                        <v-list-item v-for="item in changedPlayers" :key="item.pdgaNumber">
                            <v-list-item-title>
                                {{ item.name }}
                                <v-chip :color="item.score > 0 ? 'success' : 'error'">
                                    {{ item.score.toLocaleString() }}
                                </v-chip>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </div>
            <div v-else>
                Loading...
            </div>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useFirestore } from 'vuefire'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const db = useFirestore()

const dialog = ref(false)

const { baseInfo, userRef, userData, myRoster, playerMap } = storeToRefs(appStore)

const lastEventId = computed(() => baseInfo.value?.lastEvent)
const lastEvent = ref({})
const changedPlayers = ref([])
const myRosterIds = computed(() => myRoster.value.map((player: any) => player.pdgaNumber))

// If the user hasn't seen the notification, show it
watch(userData, () => {
    if (userData.value?.seenNotification === false) {
        dialog.value = true
    }
})

// If the user closes the dialog, mark it as seen in firestore
watch(dialog, async (newVal) => {
    if (!newVal && userRef.value) {
        await updateDoc(userRef.value, {
            seenNotification: true
        });
    }
})

// Get my roster's scores from the last event. Compound query not supported in vuefire yet.
watchEffect(async () => {
    if (lastEventId.value) {
        const eventDoc = await getDoc(doc(db, 'events', lastEventId.value))
        lastEvent.value = { id: eventDoc.id, data: eventDoc.data() }
        for (const [playerId, score] of Object.entries(eventDoc.data()?.data || {})) {
            if (myRosterIds.value.includes(parseInt(playerId))) {
                const changedPlayer = playerMap.value[playerId]
                changedPlayer.score = score
                changedPlayers.value.push(changedPlayer)
            }
        }
    } else {
        lastEvent.value = {}
    }
})

</script>
