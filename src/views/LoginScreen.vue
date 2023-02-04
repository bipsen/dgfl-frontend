<template>
    <v-sheet class="pa-12" rounded>
        <v-card class="mx-auto px-6 py-8" max-width="344" title="Log in">
            <v-form v-model="form" @submit.prevent="onLogIn">
                <v-text-field v-model="email" :readonly="loading" class="mb-2" clearable label="Email"></v-text-field>

                <v-text-field v-model="password" :readonly="loading" clearable label="Password"
                    placeholder="Enter your password" type="password"></v-text-field>
                <br>
                <v-btn :disabled="!form" :loading="loading" block size="large" type="submit" variant="elevated">
                    Sign In
                </v-btn>
                <br>
                <span>Don't have an account yet? </span>
                <span style="font-weight:bold" @click="router.push('/signup')">Sign up!</span>
            </v-form>
        </v-card>
    </v-sheet>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const router = useRouter()
const auth = useFirebaseAuth()
const form = ref(false)
const email = ref(null)
const password = ref(null)
const loading = ref(false)

function onLogIn() {
    loading.value = true
    signInWithEmailAndPassword(auth!, email.value!, password.value!)
        .then((userCredential) => {
            loading.value = false
            const user = userCredential.user;
            router.push('/home')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            loading.value = false
        });
}
</script>
