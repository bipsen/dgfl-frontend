<template>
    <v-sheet class="pa-12" rounded>
        <v-card class="mx-auto px-6 py-8" max-width="344" title="Sign up">
            <v-form v-model="form" @submit.prevent="onSignUp">
                <v-text-field v-model="email" :readonly="loading" class="mb-2" clearable label="Email"></v-text-field>

                <v-text-field v-model="password" :readonly="loading" clearable label="Password"
                    placeholder="Enter your password" type="password"></v-text-field>
                <br>
                <v-btn :disabled="!form" :loading="loading" block size="large" type="submit" variant="elevated">
                    Sign Up
                </v-btn>
                <br>
                <span>Already have an account? </span>
                <span style="font-weight:bold" @click="router.push('/login')">Log in!</span>
            </v-form>
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
const email = ref(null)
const password = ref(null)
const loading = ref(false)

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
    });
}


</script>
