<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon name="list-outline" style="margin-right:8px;" />
          Mes tâches
        </ion-title>
        <!-- Bouton de déconnexion à droite -->
        <ion-buttons slot="end">
          <ion-button @click="logout">Déconnexionn
            
             
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding fade-in">
      <!-- Bouton pour ajouter une nouvelle tâche -->
      <ion-button expand="block" color="success" @click="showAddTask = true" class="ion-margin-bottom">
        <ion-icon slot="start" name="add-circle-outline" /> Ajouter une tâche
      </ion-button>

      <!-- Liste des tâches actives de l'utilisateur connecté -->
      <div v-if="myTasks.length > 0">
        <TaskItem
          v-for="task in state.tasks"
          :key="task.taskId"
          :task="task"
          :showOwner="false"
          @edit="editTask"
          @delete="deleteTask"
        />
      </div>
      <ion-text v-else color="medium">Aucune tâche active.</ion-text>

      <!-- Formulaire d'ajout de tâche -->
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

      <!-- Formulaire de modification de tâche CORRIGÉ -->
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
            
            <!-- Correction du checkbox -->
            <ion-item>
              <ion-label>Terminée ?</ion-label>
              <ion-checkbox 
                :checked="editIsDone" 
                @ionChange="editIsDone = $event.detail.checked"
              ></ion-checkbox>
            </ion-item>
            
            <ion-text>Valeur checkbox : {{ editIsDone }}</ion-text>
            
            <ion-button expand="block" type="submit" class="ion-margin-top">
              Enregistrer
            </ion-button>
          </form>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importation des composants Ionic
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonText, IonModal, IonItem, IonLabel, 
  IonInput, IonButtons, IonCheckbox, IonIcon 
} from '@ionic/vue';
import TaskItem from '@/components/TaskItem.vue';
import api from '@/services/firebase';
import { state } from '@/store/state';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

 



// Variables pour le formulaire d'ajout
const showAddTask = ref(false);
const newTitle = ref('');
const newDescription = ref('');

// Variables pour la modification
const showEditTask = ref(false);
const editTaskId = ref(null);
const editTitle = ref('');
const editDescription = ref('');
const editIsDone = ref(false);

// Filtrer les tâches actives appartenant à l'utilisateur connecté
const myTasks = computed(() =>
  state.tasks.filter(task => task.userId === state.user?.uid)
);

// Charger les tâches à l'ouverture de la page
onMounted(loadTasks);

const router = useRouter();


//console.log('state.user:', state.user);


async function loadTasks() {
  if (!state.user) return;
  try {
    const response = await api.getTasks(state.user.uid);
    // Tri des tâches par date décroissante
    state.tasks = response.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (e) {
    console.error('Erreur loadTasks:', e);
  }
}

// Ajouter une nouvelle tâche
async function addTask() {
  if (!newTitle.value || !newDescription.value) return;
  try {
    await api.addTask({
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
  }
}

// Modifier une tâche
function editTask(task) {
  editTaskId.value = task.id;
  editTitle.value = task.title;
  editDescription.value = task.description;
  editIsDone.value = task.isDone;
  showEditTask.value = true;
}

// Fermer le formulaire de modification
function closeEditTask() {
  showEditTask.value = false;
  editTaskId.value = null;
  editTitle.value = '';
  editDescription.value = '';
  editIsDone.value = false;
}

// Mettre à jour la tâche
async function updateTask() {
  try {
    const data = {
      id: editTaskId.value,
      userId: state.user.uid,
      title: editTitle.value,
      description: editDescription.value,
      isDone: editIsDone.value  // Utilisation directe de la valeur booléenne
    };
    
    console.log('Données envoyées à updateTask:', data);
    await api.updateTask(data);
    closeEditTask();
    await loadTasks();
  } catch (e) {
    console.error('Erreur updateTask:', e);
  }
}

// Supprimer une tâche
async function deleteTask(task) {
  if (!confirm('Supprimer cette tâche ?')) return;
  try {
    await api.removeTask(task.id);
    await loadTasks();
  } catch (e) {
    console.error('Erreur deleteTask:', e);
  }
}

// Fonction de déconnexion
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

.fade-in {
  animation: fadeIn 1.1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>