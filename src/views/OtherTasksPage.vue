<!-- src/pages/OtherTasksPage.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>
          <ion-icon name="people-outline" style="margin-right:8px;" />
          Autres
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding fade-in">
      <div v-if="otherTasks.length > 0">
        <TaskItem
          v-for="task in otherTasks"
          :key="task.id"
          :task="task"
          :showOwner="true"
        />
      </div>
      <ion-text v-else color="medium">Aucune tâche active d'autres utilisateurs.</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonIcon } from '@ionic/vue';
import TaskItem from '@/components/TaskItem.vue';
import { state } from '@/store/state';
import { computed, onMounted } from 'vue';
import { firebaseService } from '@/firebase';

// Tâches des autres utilisateurs
const otherTasks = computed(() =>
  state.tasks.filter(task => !task.isOwner && !task.isDone)
);

// Charger toutes les tâches au montage
onMounted(async () => {
  if (state.user) {
    try {
      const response = await firebaseService.getAllTasks();
      // Marquer les tâches comme appartenant ou non à l'utilisateur connecté
      state.tasks = response.tasks.map(task => ({
        ...task,
        isOwner: task.userId === state.user.uid
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
    }
  }
});
</script>

<style scoped>
ion-content {
  display: flex;
  flex-direction: column;
}
</style>