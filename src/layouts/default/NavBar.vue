<template>
  <v-navigation-drawer v-model="localStore.drawer" location="bottom" temporary>
    <v-list nav>
      <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-calendar" title="Events" to="/events"></v-list-item>
      <v-list-item prepend-icon="mdi-script" title="Rules" to="/rules"></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="px-4 py-2">
        <v-btn block @click="logout">
          Logout
        </v-btn>
      </div>
    </template> </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import { useLocalStore } from '@/store/local'
import { useRouter } from 'vue-router'
import { signOut } from "firebase/auth";
import { useFirebaseAuth } from 'vuefire'

const appStore = useAppStore()
const localStore = useLocalStore()
const router = useRouter()
const auth = useFirebaseAuth()

function logout() {
  signOut(auth!).then(() => {
    appStore.drawer = false
    appStore.curUserId = ''
    router.push({ path: '/login' })
  }).catch((error) => {
    // An error happened.
  });
}



</script>