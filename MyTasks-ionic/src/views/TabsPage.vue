<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <!-- Onglet Mes tâches -->
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="list" />
          <ion-label>Mes tâches</ion-label>
        </ion-tab-button>
        <!-- Onglet Autres -->
        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="people" />
          <ion-label>Autres</ion-label>
        </ion-tab-button>
        <!-- Onglet Archivées -->
        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon aria-hidden="true" :icon="archive" />
          <ion-label>Archivées</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
// Importation des icônes adaptées
import { list, people, archive } from 'ionicons/icons';
</script>
