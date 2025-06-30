<template>
  <ion-card>
    <ion-card-header>
      <!-- Affichage du titre de la tâche -->
      <ion-card-title>{{ task.title }}</ion-card-title>
      <!-- Affichage du prénom et nom du propriétaire si showOwner est vrai -->
      <ion-card-subtitle v-if="showOwner">Par {{ task.firstName }} {{ task.lastName }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <!-- Description de la tâche -->
      <p>{{ task.description }}</p>
      <!-- Date de création -->
      <p><strong>Date :</strong> {{ formatDate(task.date) }}</p>
      <!-- État de la tâche -->
      <ion-badge :color="task.isDone ? 'success' : 'warning'">
        {{ task.isDone ? 'Terminée' : 'Active' }}
      </ion-badge>
      <!-- Boutons d'action si l'utilisateur est propriétaire -->
      <div v-if="task.isOwner" class="actions">
        <ion-button size="small" color="primary" @click="$emit('edit', task)">Modifier</ion-button>
        <ion-button size="small" color="danger" @click="$emit('delete', task)">Supprimer</ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
// Importation des composants Ionic
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButton } from '@ionic/vue';
import { defineProps } from 'vue';

// Définition des props reçues par le composant
const props = defineProps({
  task: { type: Object, required: true }, // La tâche à afficher
  showOwner: { type: Boolean, default: false } // Afficher le nom du propriétaire ?
});

// Fonction utilitaire pour formater la date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString();
}
</script>

<style scoped>
.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style> 