<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>
          <ion-icon name="close-circle" style="margin-right:8px;" />
          Tâches Fermées
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
            Vous devez être connecté pour gérer vos tâches
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Compteur de tâches -->
      <ion-card class="ion-margin-bottom">
        <ion-card-content>
          <ion-text color="medium">
            {{ closedTasks.length }} tâche{{ closedTasks.length > 1 ? 's' : '' }} fermée{{ closedTasks.length > 1 ? 's' : '' }}
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Liste des tâches fermées -->
      <div v-if="closedTasks.length > 0" class="task-list">
        <TaskItem
          v-for="task in closedTasks"
          :key="task.taskId"
          :task="task"
          :showOwner="true"
        >
          <template #actions v-if="task.ownerId === state.user?.userId">
            <ion-button size="small" color="success" @click="reopenTask(task)">
              <ion-icon slot="start" name="refresh-circle" />
              Réouvrir
            </ion-button>
            <ion-button size="small" color="warning" @click="archiveTask(task)">
              <ion-icon slot="start" name="archive" />
              Archiver
            </ion-button>
          </template>
        </TaskItem>
      </div>
      <ion-text v-else-if="state.user && state.user.userId" color="medium">Aucune tâche fermée.</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonText, IonButtons, IonIcon,
  IonCard, IonCardContent
} from '@ionic/vue';
import TaskItem from '@/components/TaskItem.vue';
import { firebaseService } from '@/firebase';
import { auth } from '@/firebase';
import { state } from '@/store/state';
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';

const errorMessage = ref('');

// Tâches fermées avec tri par date décroissante
const closedTasks = computed(() => {
  let filteredTasks = state.tasks.filter(task => 
    task.ownerId === state.user?.userId && 
    task.status === 'fermee'
  );
  
  // Tri par date de création décroissante
  filteredTasks.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA;
  });
  
  return filteredTasks;
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
    const userResponse = await firebaseService.getUserInfo(auth.currentUser.uid);
    if (userResponse.success) {
      state.user = userResponse.user;
    }
    
    const response = await firebaseService.getAllTasks();
    state.tasks = response.tasks;
  } catch (e) {
    console.error('Erreur loadTasks:', e);
    errorMessage.value = 'Erreur lors du chargement des tâches';
  }
}

async function reopenTask(task) {
  if (!confirm('Réouvrir cette tâche ?')) return;
  
  errorMessage.value = '';
  
  try {
    await firebaseService.updateTask({
      taskId: task.taskId,
      ownerId: task.ownerId,
      title: task.title,
      description: task.description,
      status: 'active'
    });
    await loadTasks();
  } catch (e) {
    console.error('Erreur reopenTask:', e);
    errorMessage.value = 'Erreur lors de la réouverture de la tâche';
  }
}

async function archiveTask(task) {
  if (!confirm('Archiver cette tâche ?')) return;
  
  errorMessage.value = '';
  
  try {
    await firebaseService.updateTask({
      taskId: task.taskId,
      ownerId: task.ownerId,
      title: task.title,
      description: task.description,
      status: 'archivee'
    });
    await loadTasks();
  } catch (e) {
    console.error('Erreur archiveTask:', e);
    errorMessage.value = 'Erreur lors de l\'archivage de la tâche';
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
