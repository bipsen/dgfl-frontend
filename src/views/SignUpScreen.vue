<template>
    <v-sheet class="pa-12" rounded>
        <v-card class="mx-auto px-6 py-8" rounded="lg">

            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field v-model="email" density="compact" placeholder="Email address"
                prepend-inner-icon="mdi-email-outline" variant="outlined" />

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password
            </div>

            <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter a password"
                prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible" />

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Team
            </div>

            <v-select :items="teams" variant="underlined" density="compact" />

            <v-btn block class="mb-8" size="large" variant="tonal" @click="onSignUp">
                Sign Up
            </v-btn>

            <v-card-text class="text-center">
                <a class="text-blue text-decoration-none" href="/login" rel="noopener noreferrer">
                    Sign up now
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </a>
            </v-card-text>
        </v-card>
    </v-sheet>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useFirestore, useFirebaseAuth } from 'vuefire'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const router = useRouter()
const db = useFirestore()
const auth = useFirebaseAuth()

const form = ref(false)
const visible = ref(false)
const email = ref(null)
const password = ref(null)
const loading = ref(false)
const teams = ref(['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming'])

function onSignUp() {
    loading.value = true
    createUserWithEmailAndPassword(auth!, email.value!, password.value!)
        .then((userCredential) => {
            const user = userCredential.user
            createUserEntry(user.uid)
            loading.value = false
            router.push('/home')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            loading.value = false
        });
}

async function createUserEntry(uid: string) {
    // Add a new document in collection "cities"
    await setDoc(doc(db, "users", uid), {
        cash: 1000000,
        roster: []
    });
}


</script>
