<!-- src/pages/MyTasksPage.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon name="list-outline" style="margin-right:8px;" />
          Mes tâches
        </ion-title>
        <ion-buttons slot="end">
          <template v-if="state.user"></template>
          <ion-button @click="logout">Déconnexion</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding fade-in">
      <ion-button 
        expand="block" 
        color="success" 
        @click="showAddTask = true" 
        class="ion-margin-bottom"
        :disabled="!state.user || !state.user.uid"
      >
        <ion-icon slot="start" name="add-circle-outline" /> 
        {{ state.user && state.user.uid ? 'Ajouter une tâche' : 'Connectez-vous pour ajouter une tâche' }}
      </ion-button>

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

      <!-- Message si utilisateur non connecté -->
      <ion-card v-if="!state.user || !state.user.uid" class="ion-margin-bottom" color="warning">
        <ion-card-content>
          <ion-text color="warning">
            <ion-icon name="warning-outline" style="margin-right:8px;" />
            Vous devez être connecté pour gérer vos tâches
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Indicateur de chargement -->
      <ion-spinner v-if="isLoading" name="crescent" class="ion-margin"></ion-spinner>

      <!-- Compteur de tâches -->
      <ion-card v-if="!isLoading" class="ion-margin-bottom">
        <ion-card-content>
          <ion-text color="medium">
            {{ myTasks.length }} tâche{{ myTasks.length > 1 ? 's' : '' }} trouvée{{ myTasks.length > 1 ? 's' : '' }}
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Liste des tâches actives de l'utilisateur connecté -->
      <div v-if="myTasks.length > 0" class="task-list">
        <TaskItem
          v-for="task in myTasks"
          :key="task.id"
          :task="task"
          :showOwner="false"
          @edit="editTask"
          @delete="deleteTask"
        />
      </div>
      <ion-text v-else-if="!isLoading" color="medium">Aucune tâche active.</ion-text>

      <!-- Modal ajout -->
      <ion-modal :is-open="showAddTask" @didDismiss="showAddTask = false">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Nouvelle tâche</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showAddTask = false">Fermer</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form @submit.prevent="addTask">
            <ion-item>
              <ion-label position="floating">Titre</ion-label>
              <ion-input v-model="newTitle" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Description</ion-label>
              <ion-input v-model="newDescription" required></ion-input>
            </ion-item>
            <ion-button expand="block" type="submit" class="ion-margin-top">Créer</ion-button>
          </form>
        </ion-content>
      </ion-modal>

      <!-- Modal modification -->
      <ion-modal :is-open="showEditTask" @didDismiss="closeEditTask">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Modifier la tâche</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeEditTask">Fermer</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form @submit.prevent="updateTask">
            <ion-item>
              <ion-label position="floating">Titre</ion-label>
              <ion-input v-model="editTitle" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Description</ion-label>
              <ion-input v-model="editDescription" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label>Terminée ?</ion-label>
              <ion-checkbox :checked="editIsDone" @ionChange="editIsDone = $event.detail.checked"></ion-checkbox>
            </ion-item>
            <ion-button expand="block" type="submit" class="ion-margin-top">Enregistrer</ion-button>
          </form>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonText, IonModal, IonItem, IonLabel, 
  IonInput, IonButtons, IonCheckbox, IonIcon, IonSpinner,
  IonCard, IonCardContent
} from '@ionic/vue';
import TaskItem from '@/components/TaskItem.vue';
import { firebaseService } from '@/firebase';
import { auth } from '@/firebase';
import { state } from '@/store/state';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';

const showAddTask = ref(false);
const newTitle = ref('');
const newDescription = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// Variable pour la recherche
const searchTerm = ref('');

const showEditTask = ref(false);
const editTaskId = ref(null);
const editTitle = ref('');
const editDescription = ref('');
const editIsDone = ref(false);

const myTasks = computed(() => {
  let filteredTasks = state.tasks.filter(task => task.userId === state.user?.uid);
  
  // Recherche par titre ou description
  if (searchTerm.value.trim()) {
    const searchLower = searchTerm.value.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Tri par date de création décroissante (selon les consignes)
  filteredTasks.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA; // Décroissant
  });
  
  return filteredTasks;
});

const router = useRouter();

onMounted(() => {
  // Vérifier l'état de l'authentification Firebase
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // L'utilisateur est connecté, charger ses tâches
      loadTasks();
    } else {
      // L'utilisateur n'est pas connecté, vider l'état
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
    // Récupérer les informations utilisateur depuis Firestore
    const userResponse = await firebaseService.getUserInfo(auth.currentUser.uid);
    if (userResponse.success) {
      state.user = userResponse.user;
    }
    
    const response = await firebaseService.getAllTasks();
    // Marquer les tâches comme appartenant ou non à l'utilisateur connecté
    state.tasks = response.tasks.map(task => ({
      ...task,
      isOwner: task.userId === auth.currentUser.uid
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (e) {
    console.error('Erreur loadTasks:', e);
    errorMessage.value = 'Erreur lors du chargement des tâches';
  } finally {
    isLoading.value = false;
  }
}

async function addTask() {
  // Vérifier que l'utilisateur est connecté
  if (!state.user || !state.user.uid) {
    errorMessage.value = 'Vous devez être connecté pour ajouter une tâche';
    return;
  }
  
  // Vérifier que les champs sont remplis
  if (!newTitle.value || !newDescription.value) {
    errorMessage.value = 'Veuillez remplir tous les champs';
    return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    await firebaseService.addTask({
      userId: state.user.uid,
      title: newTitle.value,
      description: newDescription.value,
      isDone: false
    });
    showAddTask.value = false;
    newTitle.value = '';
    newDescription.value = '';
    await loadTasks();
  } catch (e) {
    console.error('Erreur addTask:', e);
    errorMessage.value = 'Erreur lors de l\'ajout de la tâche';
  } finally {
    isLoading.value = false;
  }
}

function editTask(task) {
  editTaskId.value = task.id;
  editTitle.value = task.title;
  editDescription.value = task.description;
  editIsDone.value = task.isDone;
  showEditTask.value = true;
}

function closeEditTask() {
  showEditTask.value = false;
  editTaskId.value = null;
  editTitle.value = '';
  editDescription.value = '';
  editIsDone.value = false;
}

async function updateTask() {
  // Vérifier que l'utilisateur est connecté
  if (!state.user || !state.user.uid) {
    errorMessage.value = 'Vous devez être connecté pour modifier une tâche';
    return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    await firebaseService.updateTask({
      id: editTaskId.value,
      userId: state.user.uid,
      title: editTitle.value,
      description: editDescription.value,
      isDone: editIsDone.value
    });
    closeEditTask();
    await loadTasks();
  } catch (e) {
    console.error('Erreur updateTask:', e);
    errorMessage.value = 'Erreur lors de la modification de la tâche';
  } finally {
    isLoading.value = false;
  }
}

async function deleteTask(task) {
  if (!confirm('Supprimer cette tâche ?')) return;
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    await firebaseService.removeTask(task.id);
    await loadTasks();
  } catch (e) {
    console.error('Erreur deleteTask:', e);
    errorMessage.value = 'Erreur lors de la suppression de la tâche';
  } finally {
    isLoading.value = false;
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
  animation: fadeIn 1.1s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>