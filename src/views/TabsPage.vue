<template>
  <ion-tabs>
    <ion-router-outlet></ion-router-outlet>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="mytasks" href="/tabs/mytasks">
        <ion-icon name="checkmark-circle-outline" />
        <ion-label>Mes tâches</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="alltasks" href="/tabs/alltasks">
        <ion-icon name="people-outline" />
        <ion-label>Tâches globales</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup>
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/vue';
</script>