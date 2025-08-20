<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>
          Tâches Archivées
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">Déconnexion</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Message d'erreur -->
      <ion-text v-if="errorMessage" color="danger" class="ion-margin-bottom">
        {{ errorMessage }}
      </ion-text>

      <!-- Message si utilisateur non connecté -->
      <ion-card v-if="!state.user || !state.user.userId" class="ion-margin-bottom" color="warning">
        <ion-card-content>
          <ion-text color="warning">
            Vous devez être connecté pour consulter les tâches
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Compteur de tâches -->
      <ion-card class="ion-margin-bottom">
        <ion-card-content>
          <ion-text color="medium">
            {{ archivedTasks.length }} tâche{{ archivedTasks.length > 1 ? 's' : '' }} archivée{{ archivedTasks.length > 1 ? 's' : '' }} de tous les utilisateurs
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Information sur les tâches archivées -->
      <ion-card class="ion-margin-bottom" color="light">
        <ion-card-content>
          <ion-text color="medium">
            Les tâches archivées sont en lecture seule. Seul un administrateur peut modifier leur statut via Firestore.
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Liste des tâches archivées -->
      <div v-if="archivedTasks.length > 0" class="task-list">
        <TaskItem
          v-for="task in archivedTasks"
          :key="task.taskId"
          :task="task"
          :showOwner="true"
        />
      </div>
      <ion-text v-else-if="state.user && state.user.userId" color="medium">Aucune tâche archivée.</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonText, IonSpinner,
  IonCard, IonCardContent, IonItem, IonLabel, IonInput
} from '@ionic/vue';
import TaskItem from '@/components/TaskItem.vue';
import { tasksService, userService, auth } from '@/firebase';
import { state } from '@/store/state';
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';

const errorMessage = ref('');

// Toutes les tâches archivées
const archivedTasks = computed(() => {
  return state.tasks.filter(task => task.status === 'archivee');
});

const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadTasks();
    } else {
      state.user = null;
      state.tasks = [];
    }
  });
});

// Surveiller les changements d'état utilisateur
watch(() => state.user, (newUser) => {
  if (newUser && newUser.userId) {
    loadTasks();
  }
}, { immediate: true });

async function loadTasks() {
  if (!auth.currentUser) return;
  
  errorMessage.value = '';
  
  try {
    const userResponse = await userService.getUserInfo(auth.currentUser.uid);
    if (userResponse.success) {
      state.user = userResponse.user;
    }
    
    const response = await tasksService.getAllTasks();
    state.tasks = response.tasks;
  } catch (e) {
    console.error('Erreur loadTasks:', e);
    errorMessage.value = 'Erreur lors du chargement des tâches';
  }
}

function logout() {
  state.user = null;
  state.tasks = [];
  router.push('/login');
}
</script>

<style scoped>
ion-content {
  display: flex;
  flex-direction: column;
}
.task-list {
  margin-top: 16px;
}
</style>
