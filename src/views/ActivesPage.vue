<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Tâches Actives
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">Déconnexion</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-button 
        expand="block" 
        color="success" 
        @click="showAddTask = true" 
        class="ion-margin-bottom"
        :disabled="!state.user || !state.user.userId"
      >
        {{ state.user && state.user.userId ? 'Ajouter une tâche' : 'Connectez-vous pour ajouter une tâche' }}
      </ion-button>

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

      <ion-text v-if="errorMessage" color="danger" class="ion-margin-bottom">
        {{ errorMessage }}
      </ion-text>

      <ion-card v-if="!state.user || !state.user.userId" class="ion-margin-bottom" color="warning">
        <ion-card-content>
          <ion-text color="warning">
            Vous devez être connecté pour gérer vos tâches
          </ion-text>
        </ion-card-content>
      </ion-card>

      <ion-card class="ion-margin-bottom">
        <ion-card-content>
          <ion-text color="medium">
            {{ filteredTasks.length }} tâche{{ filteredTasks.length > 1 ? 's' : '' }} active{{ filteredTasks.length > 1 ? 's' : '' }} de tous les utilisateurs
          </ion-text>
        </ion-card-content>
      </ion-card>

      <div v-if="filteredTasks.length > 0" class="task-list">
        <TaskItem
          v-for="task in filteredTasks"
          :key="task.taskId"
          :task="task"
          :showOwner="true"
        >
          <template #actions v-if="task.ownerId === state.user?.userId">
            <ion-button size="small" color="primary" @click="editTask(task)">
              Modifier
            </ion-button>
            <ion-button size="small" color="secondary" @click="closeTask(task)">
              Fermer
            </ion-button>
            <ion-button size="small" color="tertiary" @click="openTransferTask(task)">
              Transférer
            </ion-button>
            <ion-button size="small" color="danger" @click="deleteTask(task)">
              Supprimer
            </ion-button>
          </template>
        </TaskItem>
      </div>
      <ion-text v-else-if="state.user && state.user.userId" color="medium">
        Aucune tâche active trouvée.
      </ion-text>

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
            <ion-button expand="block" type="submit" class="ion-margin-top">Enregistrer</ion-button>
          </form>
        </ion-content>
      </ion-modal>

      <!-- Modal de transfert de tâche -->
      <ion-modal :is-open="showTransferTask" @didDismiss="closeTransferTask">
        <ion-header>
          <ion-toolbar color="tertiary">
            <ion-title>Transférer la tâche</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeTransferTask">Fermer</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div class="transfer-info">
            <ion-text color="medium">
              <strong>Tâche :</strong> {{ transferTaskTitle }}<br>
              <strong>Description :</strong> {{ transferTaskDescription }}
            </ion-text>
          </div>
          
          <form @submit.prevent="confirmTransfer">
            <ion-item>
              <ion-label position="floating">Email du nouveau propriétaire</ion-label>
              <ion-input 
                v-model="transferEmail" 
                type="email" 
                placeholder="exemple@email.com"
                required
              ></ion-input>
            </ion-item>
            
            <div class="transfer-warning">
              <ion-text color="warning">
                ⚠️ Cette action transférera définitivement la propriété de cette tâche.
              </ion-text>
            </div>
            
            <ion-button 
              expand="block" 
              color="tertiary" 
              type="submit" 
              class="ion-margin-top"
              :disabled="!transferEmail || transferEmail.trim() === ''"
            >
              Confirmer le transfert
            </ion-button>
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
  IonInput, IonButtons, IonCard, IonCardContent
} from '@ionic/vue';
import TaskItem from '@/components/TaskItem.vue';
import { tasksService, userService, auth } from '@/firebase';
import { state } from '@/store/state';
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';

const showAddTask = ref(false);
const newTitle = ref('');
const newDescription = ref('');
const errorMessage = ref('');
const searchTerm = ref('');

const showEditTask = ref(false);
const editTaskId = ref(null);
const editTitle = ref('');
const editDescription = ref('');

// Variables pour le transfert
const showTransferTask = ref(false);
const transferTaskId = ref(null);
const transferTaskTitle = ref('');
const transferTaskDescription = ref('');
const transferEmail = ref('');

const filteredTasks = computed(() => {
  let filteredTasks = state.tasks.filter(task => task.status === 'active');
  
  if (searchTerm.value.trim()) {
    const searchLower = searchTerm.value.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower)
    );
  }
  
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

async function addTask() {
  if (!state.user || !state.user.userId) {
    errorMessage.value = 'Vous devez être connecté pour ajouter une tâche';
    return;
  }
  
  if (!newTitle.value || !newDescription.value) {
    errorMessage.value = 'Veuillez remplir tous les champs';
    return;
  }
  
  errorMessage.value = '';
  
  try {
    const result = await tasksService.addTask({
      ownerId: state.user.userId,
      title: newTitle.value,
      description: newDescription.value
    });
    
    if (result.success) {
      showAddTask.value = false;
      newTitle.value = '';
      newDescription.value = '';
      await loadTasks();
    } else {
      errorMessage.value = 'Erreur lors de l\'ajout de la tâche';
    }
  } catch (e) {
    console.error('Erreur addTask:', e);
    errorMessage.value = 'Erreur lors de l\'ajout de la tâche';
  }
}

function editTask(task) {
  editTaskId.value = task.taskId;
  editTitle.value = task.title;
  editDescription.value = task.description;
  showEditTask.value = true;
}

function closeEditTask() {
  showEditTask.value = false;
  editTaskId.value = null;
  editTitle.value = '';
  editDescription.value = '';
}

async function updateTask() {
  if (!state.user || !state.user.userId) {
    errorMessage.value = 'Vous devez être connecté pour modifier une tâche';
    return;
  }
  
  errorMessage.value = '';
  
  try {
    await tasksService.updateTask({
      taskId: editTaskId.value,
      ownerId: state.user.userId,
      title: editTitle.value,
      description: editDescription.value,
      status: 'active'
    });
    closeEditTask();
    await loadTasks();
  } catch (e) {
    console.error('Erreur updateTask:', e);
    errorMessage.value = 'Erreur lors de la modification de la tâche';
  }
}

async function deleteTask(task) {
  if (!confirm('Supprimer cette tâche ?')) return;
  
  errorMessage.value = '';
  
  try {
    await tasksService.removeTask(task.taskId);
    await loadTasks();
  } catch (e) {
    console.error('Erreur deleteTask:', e);
    errorMessage.value = 'Erreur lors de la suppression de la tâche';
  }
}

async function closeTask(task) {
  if (!confirm('Marquer cette tâche comme fermée ?')) return;
  
  errorMessage.value = '';
  
  try {
    await tasksService.updateTask({
      taskId: task.taskId,
      ownerId: task.ownerId,
      title: task.title,
      description: task.description,
      status: 'fermee'
    });
    await loadTasks();
  } catch (e) {
    console.error('Erreur closeTask:', e);
    errorMessage.value = 'Erreur lors de la fermeture de la tâche';
  }
}

// Fonctions de transfert
function openTransferTask(task) {
  transferTaskId.value = task.taskId;
  transferTaskTitle.value = task.title;
  transferTaskDescription.value = task.description;
  transferEmail.value = '';
  showTransferTask.value = true;
}

function closeTransferTask() {
  showTransferTask.value = false;
  transferTaskId.value = null;
  transferTaskTitle.value = '';
  transferTaskDescription.value = '';
  transferEmail.value = '';
}

async function confirmTransfer() {
  if (!transferEmail.value || transferEmail.value.trim() === '') {
    return;
  }
  
  errorMessage.value = '';
  
  try {
    const result = await tasksService.transferTask(transferTaskId.value, transferEmail.value.trim());
    
    if (result.success) {
      closeTransferTask();
      await loadTasks();
      // Afficher un message de succès
      alert(`Tâche transférée avec succès à ${result.newOwnerName}`);
    } else {
      errorMessage.value = `Erreur lors du transfert: ${result.error}`;
    }
  } catch (e) {
    console.error('Erreur confirmTransfer:', e);
    errorMessage.value = 'Erreur lors du transfert de la tâche';
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
  padding-bottom: 80px;
}

.task-list {
  margin-top: 16px;
}

.transfer-info {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(82, 96, 255, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--ion-color-tertiary);
}

.transfer-warning {
  margin: 16px 0;
  padding: 12px;
  background: rgba(255, 196, 9, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--ion-color-warning);
}
</style>
