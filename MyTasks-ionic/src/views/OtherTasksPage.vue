<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Autres</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- Liste des tâches actives des autres utilisateurs -->
      <div v-if="otherTasks.length > 0">
        <TaskItem
          v-for="task in otherTasks"
          :key="task.taskId"
          :task="task"
          :showOwner="true"   
        />
      </div>
      <ion-text v-else color="medium">Aucune tâche active d'autres utilisateurs.</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importation des composants Ionic
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText } from '@ionic/vue';
import TaskItem from '../components/TaskItem.vue';
import { state } from '@/store/state';
import { computed } from 'vue';

// Filtrer les tâches actives qui n'appartiennent PAS à l'utilisateur connecté
const otherTasks = computed(() =>
  state.tasks.filter(task => !task.isOwner && !task.isDone)
);
</script>

<style scoped>
ion-content {
  display: flex;
  flex-direction: column;
}
</style>
