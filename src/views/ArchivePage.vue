<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="warning">
        <ion-title>
          <ion-icon name="archive-outline" style="margin-right:8px;" />
          Archivées
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding fade-in">
      <div v-if="archivedTasks.length > 0">
        <TaskItem
          v-for="task in archivedTasks"
          :key="task.id"
          :task="task"
          :showOwner="true"
        >
          <template #actions v-if="task.isOwner">
            <ion-button size="small" color="success" @click="restoreTask(task)">Restaurer</ion-button>
            <ion-button size="small" color="danger" @click="deleteTask(task)">Supprimer</ion-button>
          </template>
        </TaskItem>
      </div>
      <ion-text v-else color="medium">Aucune tâche archivée.</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonText, IonButton, IonIcon
} from '@ionic/vue';
import TaskItem from '@/components/TaskItem.vue';
import { state } from '@/store/state';
import { computed } from 'vue';
import { firebaseService } from '@/firebase';

const archivedTasks = computed(() =>
  state.tasks.filter(task => task.isDone)
);

async function restoreTask(task) {
  try {
    await firebaseService.updateTask({
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      isDone: false
    });
  } catch (e) {
    console.error('Erreur restoreTask:', e);
  }
}

async function deleteTask(task) {
  if (!confirm('Supprimer cette tâche ?')) return;
  try {
    await firebaseService.removeTask(task.id);
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
.fade-in {
  animation: fadeIn 1s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>