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
    path: '/tabs',
    component: () => import('../views/TabsPage.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs/actives'
      },
      {
        path: 'actives',
        component: () => import('../views/ActivesPage.vue')
      },
      {
        path: 'fermees',
        component: () => import('../views/FermeesPage.vue')
      },
      {
        path: 'archivees',
        component: () => import('../views/ArchiveesPage.vue')
      }
    ]
  },
  {
    path: '/mytasks',
    redirect: '/tabs/actives'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
