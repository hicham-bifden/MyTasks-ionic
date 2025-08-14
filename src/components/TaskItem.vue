<template>
  <ion-card class="fade-in">
    <ion-card-header>
      <ion-card-title>
        <ion-icon name="document-text-outline" style="margin-right:6px; color:#3880ff;" />
        {{ task.title }}
      </ion-card-title>
      <ion-card-subtitle v-if="showOwner">Par {{ task.ownerName || 'Utilisateur' }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <p>{{ task.description }}</p>
      <p><strong>Date :</strong> {{ formatDate(task.createdAt) }}</p>
      <ion-badge :color="task.isDone ? 'success' : 'warning'">
        <ion-icon :name="task.isDone ? 'checkmark-done-outline' : 'time-outline'" style="margin-right:4px;" />
        {{ task.isDone ? 'Terminée' : 'Active' }}
      </ion-badge>
       <div v-if="task" class="actions">
        <ion-button size="small" color="primary" @click="$emit('edit', task)">
          <ion-icon slot="start" name="create-outline" /> Modifier
        </ion-button>
        <ion-button size="small" color="danger" @click="$emit('delete', task)">
          <ion-icon slot="start" name="trash-outline" /> Supprimer
        </ion-button>
      </div> 
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButton, IonIcon } from '@ionic/vue';
import { defineProps } from 'vue';
const props = defineProps({
  task: { type: Object, required: true },
  showOwner: { type: Boolean, default: false }
});
function formatDate(timestamp) {
  if (!timestamp) return 'Pas de date';
  
  try {
    // Si c'est un Timestamp Firebase
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString('fr-FR');
    }
    // Si c'est une date normale
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString('fr-FR');
    }
    // Si c'est une string
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleString('fr-FR');
    }
    
    return 'Date invalide';
  } catch (error) {
    return 'Date invalide';
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.7s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
ion-button {
  transition: box-shadow 0.2s, transform 0.2s;
}
ion-button:hover {
  box-shadow: 0 2px 8px #38ffaf33;
  transform: translateY(-2px) scale(1.04);
}
</style> 