<template>
    <v-sheet class="pa-12" rounded>
        <v-card class="mx-auto px-6 py-8" rounded="lg">
            <form @submit.prevent="submit">

                <v-text-field v-model="name.value.value" :error-messages="name.errorMessage.value" density="compact"
                    placeholder="Name" prepend-inner-icon="mdi-account" variant="outlined" />

                <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value" density="compact"
                    placeholder="Email address" prepend-inner-icon="mdi-email-outline" variant="outlined" />

                <v-text-field v-model="password.value.value" :counter="10" :error-messages="password.errorMessage.value"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Enter a password" prepend-inner-icon="mdi-lock-outline"
                    variant="outlined" @click:append-inner="visible = !visible" />

                <v-select v-model="team.value.value" :error-messages="team.errorMessage.value" :items="teams"
                    variant="underlined" density="compact" />

                <v-btn type="submit" block class="mb-8" size="large" variant="tonal">
                    Sign Up
                </v-btn>

                <v-card-text class="text-center">
                    <a class="text-blue text-decoration-none" href="/login" rel="noopener noreferrer">
                        I already have an account
                        <v-icon icon="mdi-chevron-right"></v-icon>
                    </a>
                </v-card-text>
            </form>
        </v-card>
</v-sheet>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useFirestore, useFirebaseAuth, useCollection } from 'vuefire'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'
import { useField, useForm } from 'vee-validate'
import { object, string } from 'yup';

const appStore = useAppStore()

const router = useRouter()
const db = useFirestore()
const auth = useFirebaseAuth()

const form = ref(false)
const visible = ref(false)


const loading = ref(false)
const teams = [
    'DGA, Gateway',
    'Discmania',
    'Discraft',
    'Dynamic Discs',
    'Infinite, Clash, Thought Space',
    'Innova',
    'Kastaplast, Westside, Albatross',
    'Latitude 64',
    'Lone Star Discs',
    'MVP',
    'Prodigy'
]

const schema = object({
    name: string().required().min(2),
    email: string().required().email(),
    password: string().required().min(6),
    team: string().required(),
});

const { handleSubmit, handleReset } = useForm({
    validationSchema: schema,
})

const name = useField('name')
const email = useField('email')
const password = useField('password')
const team = useField('team')

const submit = handleSubmit(values => {
    loading.value = true
    createUserWithEmailAndPassword(auth!, values.email, values.password)
        .then((userCredential) => {
            const user = userCredential.user
            createUserEntry(user.uid, values)
            loading.value = false
            router.push('/')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            loading.value = false
        });
})

interface userInfo {
    cash: number,
    roster: string[],
    name: string,
    team: string
}

async function createUserEntry(uid: string, userInfo: userInfo) {
    // Add a new document in collection "cities"
    await setDoc(doc(db, "users", uid), {
        cash: 1000000,
        roster: [],
        name: userInfo.name,
        team: userInfo.team
    });
}
</script>
