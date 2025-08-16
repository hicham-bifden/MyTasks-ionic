<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="warning">
        <ion-title>
          <ion-icon name="archive" style="margin-right:8px;" />
          Tâches Archivées
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">Déconnexion</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding fade-in">
      <!-- Message d'erreur -->
      <ion-text v-if="errorMessage" color="danger" class="ion-margin-bottom">
        {{ errorMessage }}
      </ion-text>

      <!-- Message si utilisateur non connecté -->
      <ion-card v-if="!state.user || !state.user.userId" class="ion-margin-bottom" color="warning">
        <ion-card-content>
          <ion-text color="warning">
            <ion-icon name="alert-circle" style="margin-right:8px;" />
            Vous devez être connecté pour consulter les tâches
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Compteur de tâches -->
      <ion-card class="ion-margin-bottom">
        <ion-card-content>
          <ion-text color="medium">
            {{ archivedTasks.length }} tâche{{ archivedTasks.length > 1 ? 's' : '' }} archivée{{ archivedTasks.length > 1 ? 's' : '' }}
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Information sur les tâches archivées -->
      <ion-card class="ion-margin-bottom" color="light">
        <ion-card-content>
          <ion-text color="medium">
            <ion-icon name="information-circle" style="margin-right:8px;" />
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
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonText, IonButtons, IonIcon,
  IonCard, IonCardContent
} from '@ionic/vue';
import TaskItem from '@/components/TaskItem.vue';
import { state } from '@/store/state';
import { computed, onMounted, ref, watch } from 'vue';
import { firebaseService } from '@/firebase';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

const errorMessage = ref('');

// Toutes les tâches archivées avec tri par date décroissante
const archivedTasks = computed(() => {
  let filteredTasks = state.tasks.filter(task => task.status === 'archivee');
  
  // Tri par date de création décroissante
  filteredTasks.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA;
  });
  
  return filteredTasks;
});

const router = useRouter();

// Charger toutes les tâches au montage
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
    const userResponse = await firebaseService.getUserInfo(auth.currentUser.uid);
    if (userResponse.success) {
      state.user = userResponse.user;
    }
    
    const response = await firebaseService.getAllTasks();
    state.tasks = response.tasks;
  } catch (error) {
    console.error('Erreur lors du chargement des tâches:', error);
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
.fade-in {
  animation: fadeIn 1s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>