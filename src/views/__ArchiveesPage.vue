<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>
          Tâches Archivées
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding fade-in">
      <!-- Barre de recherche -->
      <ion-card class="ion-margin-bottom">
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Rechercher</ion-label>
            <ion-input 
              v-model="searchTerm" 
              placeholder="Titre ou description..."
              clear-input
            ></ion-input>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <!-- Message d'erreur -->
      <ion-text v-if="errorMessage" color="danger" class="ion-margin-bottom">
        {{ errorMessage }}
      </ion-text>

      <!-- Indicateur de chargement -->
      <ion-spinner v-if="isLoading" name="crescent" class="ion-margin"></ion-spinner>

      <!-- Compteur de tâches -->
      <ion-card v-if="!isLoading" class="ion-margin-bottom">
        <ion-card-content>
          <ion-text color="medium">
            {{ archivedTasks.length }} tâche{{ archivedTasks.length > 1 ? 's' : '' }} archivée{{ archivedTasks.length > 1 ? 's' : '' }}
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Liste des tâches archivées -->
      <div v-if="archivedTasks.length > 0" class="task-list">
        <TaskItem
          v-for="task in archivedTasks"
          :key="task.id"
          :task="task"
          :showOwner="true"
        />
      </div>
      <ion-text v-else-if="!isLoading" color="medium">Aucune tâche archivée.</ion-text>
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
import { firebaseService } from '@/firebase';
import { auth } from '@/firebase';
import { state } from '@/store/state';
import { ref, onMounted, computed } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';

const isLoading = ref(false);
const errorMessage = ref('');
const searchTerm = ref('');

// Tâches archivées avec recherche et tri par date décroissante
const archivedTasks = computed(() => {
  let filteredTasks = state.tasks.filter(task => task.status === 'archivee');
  
  // Recherche par titre ou description
  if (searchTerm.value.trim()) {
    const searchLower = searchTerm.value.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Tri par date de création décroissante
  filteredTasks.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA;
  });
  
  return filteredTasks;
});

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

async function loadTasks() {
  if (!auth.currentUser) return;
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const userResponse = await firebaseService.getUserInfo(auth.currentUser.uid);
    if (userResponse.success) {
      state.user = userResponse.user;
    }
    
    const response = await firebaseService.getAllTasks();
    state.tasks = response.tasks.map(task => ({
      ...task,
      isOwner: task.userId === auth.currentUser.uid
    }));
  } catch (e) {
    console.error('Erreur loadTasks:', e);
    errorMessage.value = 'Erreur lors du chargement des tâches';
  } finally {
    isLoading.value = false;
  }
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
  animation: fadeIn 1.1s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
