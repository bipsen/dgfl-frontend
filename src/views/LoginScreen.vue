<template>
    <v-sheet class="pa-12" rounded>
        <v-card class="mx-auto px-6 py-8" rounded="lg">

            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field v-model="email" density="compact" placeholder="Email address"
                prepend-inner-icon="mdi-email-outline" variant="outlined" />

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password
                <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer"
                    target="_blank">
                    Forgot login password?
                </a>
            </div>

            <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible" />

            <v-btn block class="mb-8" size="large" variant="tonal" @click="onLogIn">
                Log In
            </v-btn>

            <v-card-text class="text-center">
                <a class="text-blue text-decoration-none" href="/signup" rel="noopener noreferrer">
                    Sign up now
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </a>
            </v-card-text>
        </v-card>
    </v-sheet>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFirebaseAuth, getCurrentUser } from 'vuefire'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const auth = useFirebaseAuth()
const form = ref(false)
const visible = ref(false)
const email = ref(null)
const password = ref(null)
const loading = ref(false)

// https://vuefire.vuejs.org/guide/auth.html
onMounted(async () => {
    const currentUser = await getCurrentUser()
    if (currentUser) {
        const to =
            route.query.redirectTo && typeof route.query.redirectTo === 'string'
                ? route.query.redirectTo
                : '/'

        router.push(to)
    }
})

function onLogIn() {
    loading.value = true
    signInWithEmailAndPassword(auth!, email.value!, password.value!)
        .then((userCredential) => {
            loading.value = false
            const user = userCredential.user
            router.push('/home')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            loading.value = false
        });
}
</script>
