<template>
  <ion-tabs>
    <ion-router-outlet></ion-router-outlet>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="actives" href="/tabs/actives">
        <ion-icon name="checkmark-circle-outline" />
        <ion-label>Actives</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="fermees" href="/tabs/fermees">
        <ion-icon name="close-circle-outline" />
        <ion-label>Fermées</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="archivees" href="/tabs/archivees">
        <ion-icon name="archive-outline" />
        <ion-label>Archivées</ion-label>
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