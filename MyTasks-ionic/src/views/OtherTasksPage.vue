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
import { computed } from 'vue';

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