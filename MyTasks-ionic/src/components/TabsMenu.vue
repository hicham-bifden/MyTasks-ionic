<template>
  <nav class="tab-bar">
    <button @click="$router.push('/mytasks')" :class="{active: $route.path === '/mytasks'}">
      <ion-icon name="list-outline" />
      <span>Mes tâches</span>
    </button>
    <button @click="$router.push('/othertasks')" :class="{active: $route.path === '/othertasks'}">
      <ion-icon name="people-outline" />
      <span>Autres tâches</span>
    </button>
    <button @click="$router.push('/archive')" :class="{active: $route.path === '/archive'}">
      <ion-icon name="archive-outline" />
      <span>Archives</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
</script>

<style scoped>
.tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: #fff;
  border-top: 1px solid #eee;
  z-index: 100;
}
.tab-bar button {
  flex: 1;
  padding: 10px 0 6px 0;
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #888;
}
.tab-bar button.active {
  color: #3880ff;
}
.tab-bar ion-icon {
  font-size: 22px;
}
</style> 