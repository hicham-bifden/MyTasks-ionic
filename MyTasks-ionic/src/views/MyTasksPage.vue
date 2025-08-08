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
          <ion-button @click="logout">
            Déconnexion
            <template v-if="state.user">({{ state.user.uid }})</template>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding fade-in">
      <ion-button expand="block" color="success" @click="showAddTask = true" class="ion-margin-bottom">
        <ion-icon slot="start" name="add-circle-outline" /> Ajouter une tâche
      </ion-button>

      <div class="task-list">
        <div v-if="myTasks.length > 0">
          <TaskItem
            v-for="task in myTasks"
            :key="task.id"
            :task="task"
            :showOwner="false"
            @edit="editTask"
            @delete="deleteTask"
          />
        </div>
        <ion-text v-else color="medium">Aucune tâche active.</ion-text>
      </div>

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
  IonInput, IonButtons, IonCheckbox, IonIcon
} from '@ionic/vue';
import TaskItem from '@/components/TaskItem.vue';
import { firebaseService } from '@/firebase';
import { state } from '@/store/state';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const showAddTask = ref(false);
const newTitle = ref('');
const newDescription = ref('');

const showEditTask = ref(false);
const editTaskId = ref(null);
const editTitle = ref('');
const editDescription = ref('');
const editIsDone = ref(false);

const myTasks = computed(() =>
  state.tasks.filter(task => task.isOwner && !task.isDone)
);

const router = useRouter();

onMounted(loadTasks);

async function loadTasks() {
  try {
    const response = await firebaseService.getAllTasks();
    state.tasks = response.tasks.map(task => ({
      ...task,
      isOwner: task.userId === state.user.uid
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (e) {
    console.error('Erreur loadTasks:', e);
  }
}

async function addTask() {
  if (!newTitle.value || !newDescription.value) return;
  try {
    await firebaseService.addTask({
      userId: state.user.uid,
      title: newTitle.value,
      description: newDescription.value,
      isDone: false,
      createdAt: new Date().toISOString()
    });
    showAddTask.value = false;
    newTitle.value = '';
    newDescription.value = '';
    await loadTasks();
  } catch (e) {
    console.error('Erreur addTask:', e);
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
  }
}

async function deleteTask(task) {
  if (!confirm('Supprimer cette tâche ?')) return;
  try {
    await firebaseService.removeTask(task.id);
    await loadTasks();
  } catch (e) {
    console.error('Erreur deleteTask:', e);
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