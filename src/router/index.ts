// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire'
import { useAppStore } from '@/store/app'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: 'my-roster',
        name: 'My Roster',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/MyRosterView.vue'),
      },
      {
        path: 'transfer',
        name: 'Transfer',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/TransferView.vue'),
      },
      {
        path: 'leaderboard',
        name: 'Leaderboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/LeaderboardView.vue'),
      },
      {
        path: 'rules',
        name: 'Rules',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/RulesView.vue'),
      },
      {
        path: 'events',
        name: 'Events',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/EventsView.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/LoginScreen.vue'),
  }, {
    path: '/signup',
    component: () => import('@/views/SignUpScreen.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const appStore = useAppStore()
  // routes with `meta: { requiresAuth: true }` will check for the users, others won't
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser()
    appStore.curUserId = currentUser ? currentUser.uid : ''
    // if the user is not logged in, redirect to the login page
    if (!currentUser) {
      return {
        path: '/login',
        query: {
          // we keep the current path in the query so we can redirect to it after login
          // with `router.push(route.query.redirectTo || '/')`
          redirectTo: to.fullPath,
        },
      }
    }
  }
})


export default router
