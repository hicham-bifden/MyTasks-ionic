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
          :showOwner="true"
          @delete="deleteTask"
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
import api from '@/services/api';

// Filtrer toutes les tâches archivées (isDone = true)
const archivedTasks = computed(() =>
  state.tasks.filter(task => task.isDone)
);

async function loadTasks() {
  if (!state.user) return;
  try {
    const response = await api.getTasks(state.user.userId);
    // Tri des tâches par date décroissante
    state.tasks = response.data.tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    console.error('Erreur loadTasks:', e);
  }
}


// Supprimer une tâche
async function deleteTask(task) {
  if (!confirm('Supprimer cette tâche ?')) return;
  try {
    await api.removeTask({ userId: state.user.userId, taskId: task.taskId });
    await loadTasks();
  } catch (e) {
    console.error('Erreur deleteTask:', e);
  }
}
</script>

<style scoped>
ion-content {
  display: flex;
  flex-direction: column;
}
</style>
