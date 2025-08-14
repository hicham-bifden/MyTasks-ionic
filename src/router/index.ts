import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/register',
    component: () => import('../views/RegisterPage.vue')
  },
  {
    path: '/mytasks',
    component: () => import('../views/MyTasksPage.vue')
  },
  {
    path: '/othertasks',
    component: () => import('../views/OtherTasksPage.vue')
  },
  {
    path: '/archive',
    component: () => import('../views/ArchivePage.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
