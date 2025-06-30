<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Archivées</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- Liste des tâches archivées (toutes, tous utilisateurs) -->
      <div v-if="archivedTasks.length > 0">
        <TaskItem
          v-for="task in archivedTasks"
          :key="task.taskId"
          :task="task"
          :showOwner="true"  <!-- Affiche le nom du propriétaire -->
        />
      </div>
      <ion-text v-else color="medium">Aucune tâche archivée.</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importation des composants Ionic
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText } from '@ionic/vue';
import TaskItem from '../components/TaskItem.vue';
import { state } from '@/store/state';
import { computed } from 'vue';

// Filtrer toutes les tâches archivées (isDone = true)
const archivedTasks = computed(() =>
  state.tasks.filter(task => task.isDone)
);
</script>

<style scoped>
ion-content {
  display: flex;
  flex-direction: column;
}
</style>
