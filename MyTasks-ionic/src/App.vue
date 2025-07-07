<template>
  <ion-app>
    <ion-router-outlet />
    <TabsMenu v-if="!hideTabs" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import TabsMenu from './components/TabsMenu.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const hideTabs = computed(() => ['/login', '/register'].includes(route.path));
</script>
