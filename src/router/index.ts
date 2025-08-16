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
    path: '/actives',
    component: () => import('../views/ActivesPage.vue')
  },
  {
    path: '/fermees',
    component: () => import('../views/FermeesPage.vue')
  },
  {
    path: '/archivees',
    component: () => import('../views/ArchivePage.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
