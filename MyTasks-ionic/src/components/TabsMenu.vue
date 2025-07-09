<template>
  <nav class="tab-bar fade-in">
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
.fade-in {
  animation: fadeIn 0.7s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: linear-gradient(90deg, #e3f0ff 0%, #f8fcff 100%);
  border-top: 1px solid #b3d1fa;
  z-index: 100;
  box-shadow: 0 -2px 8px #3880ff11;
}
.tab-bar button {
  flex: 1;
  padding: 10px 0 6px 0;
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  color: #3880ff;
  transition: background 0.2s, color 0.2s;
}
.tab-bar button.active {
  color: #fff;
  background: #3880ff;
  border-radius: 8px 8px 0 0;
}
.tab-bar button:hover {
  background: #d0e6ff;
  color: #222;
}
.tab-bar ion-icon {
  font-size: 22px;
  margin-bottom: 2px;
}
</style> 