import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/sunning'
  },
  {
    path: '/sunning',
    name: 'Sunning',
    component: () => import('../views/Sunning/Sunning.vue')
  },
  {
    path: '/elegant',
    name: 'Elegant',
    component: () => import('../views/Elegant/Elegant.vue')
  },
  {
    path: '/pretty',
    name: 'Pretty',
    component: () => import('../views/Pretty/Pretty.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
