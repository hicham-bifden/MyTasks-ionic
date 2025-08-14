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
      <ion-button expand="block" color="success" @click="showAddTask = true" class="ion-margin-bottom">
        <ion-icon slot="start" name="add-circle-outline" /> Ajouter une tâche
      </ion-button>

      <!-- Barre de recherche et filtres -->
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
          
          <ion-item>
            <ion-label position="stacked">Filtrer par statut</ion-label>
            <ion-select v-model="filterStatus" interface="popover">
              <ion-select-option value="all">Toutes</ion-select-option>
              <ion-select-option value="active">Actives</ion-select-option>
              <ion-select-option value="completed">Terminées</ion-select-option>
            </ion-select>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Trier par</ion-label>
            <ion-select v-model="sortBy" interface="popover">
              <ion-select-option value="createdAt">Date de création</ion-select-option>
              <ion-select-option value="title">Titre</ion-select-option>
              <ion-select-option value="isDone">Statut</ion-select-option>
            </ion-select>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Ordre</ion-label>
            <ion-select v-model="sortOrder" interface="popover">
              <ion-select-option value="desc">Décroissant</ion-select-option>
              <ion-select-option value="asc">Croissant</ion-select-option>
            </ion-select>
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
            {{ myTasks.length }} tâche{{ myTasks.length > 1 ? 's' : '' }} trouvée{{ myTasks.length > 1 ? 's' : '' }}
            <span v-if="filterStatus !== 'all'">
              ({{ filterStatus === 'active' ? 'actives' : 'terminées' }})
            </span>
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
  IonCard, IonCardContent, IonSelect, IonSelectOption
} from '@ionic/vue';
import TaskItem from '@/components/TaskItem.vue';
import { firebaseService } from '@/firebase';
import { state } from '@/store/state';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const showAddTask = ref(false);
const newTitle = ref('');
const newDescription = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// Variables pour la recherche et le filtrage
const searchTerm = ref('');
const filterStatus = ref('all'); // 'all', 'active', 'completed'
const sortBy = ref('createdAt'); // 'createdAt', 'title', 'isDone'
const sortOrder = ref('desc'); // 'asc', 'desc'

const showEditTask = ref(false);
const editTaskId = ref(null);
const editTitle = ref('');
const editDescription = ref('');
const editIsDone = ref(false);

const myTasks = computed(() => {
  let filteredTasks = state.tasks.filter(task => task.userId === state.user?.uid);
  
  // Filtrage par statut
  if (filterStatus.value === 'active') {
    filteredTasks = filteredTasks.filter(task => !task.isDone);
  } else if (filterStatus.value === 'completed') {
    filteredTasks = filteredTasks.filter(task => task.isDone);
  }
  
  // Recherche par titre ou description
  if (searchTerm.value.trim()) {
    const searchLower = searchTerm.value.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Tri des tâches
  filteredTasks.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy.value) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'isDone':
        aValue = a.isDone ? 1 : 0;
        bValue = b.isDone ? 1 : 0;
        break;
      case 'createdAt':
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
        break;
    }
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return filteredTasks;
});

const router = useRouter();

onMounted(loadTasks);

console.log('state.user:', state.user);
async function loadTasks() {
  if (!state.user) return;
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await firebaseService.getAllTasks();
    // Marquer les tâches comme appartenant ou non à l'utilisateur connecté
    state.tasks = response.tasks.map(task => ({
      ...task,
      isOwner: task.userId === state.user.uid
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (e) {
    console.error('Erreur loadTasks:', e);
    errorMessage.value = 'Erreur lors du chargement des tâches';
  } finally {
    isLoading.value = false;
  }
}

async function addTask() {
  if (!newTitle.value || !newDescription.value) return;
  
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