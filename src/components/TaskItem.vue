<template>
  <ion-card class="fade-in">
    <ion-card-header>
      <ion-card-title>
        <ion-icon name="document-text" style="margin-right:6px; color:#3880ff;" />
        {{ task.title }}
      </ion-card-title>
      <ion-card-subtitle v-if="showOwner">
        <ion-icon name="person-circle" style="margin-right:4px;" />
        Par {{ task.ownerName || 'Utilisateur inconnu' }}
      </ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <p class="description">{{ task.description }}</p>
      
      <div class="task-info">
        <p><strong>Date de création :</strong> {{ formatDate(task.createdAt) }}</p>
        <p><strong>Statut :</strong> 
          <ion-badge :color="getStatusColor(task.status)">
            {{ getStatusLabel(task.status) }}
          </ion-badge>
        </p>
      </div>
      
      <!-- Slot pour les actions personnalisées -->
      <slot name="actions"></slot>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonIcon } from '@ionic/vue';
import { defineProps } from 'vue';

const props = defineProps({
  task: { type: Object, required: true },
  showOwner: { type: Boolean, default: false }
});

function formatDate(timestamp) {
  if (!timestamp) return 'Pas de date';
  
  try {
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString('fr-FR');
    }
    return new Date(timestamp).toLocaleString('fr-FR');
  } catch (error) {
    return 'Date invalide';
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'active': return 'success';
    case 'fermee': return 'warning';
    case 'archivee': return 'medium';
    default: return 'primary';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'active': return 'Active';
    case 'fermee': return 'Fermée';
    case 'archivee': return 'Archivée';
    default: return status;
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

.description {
  margin-bottom: 16px;
  line-height: 1.5;
}

.task-info {
  margin-bottom: 16px;
}

.task-info p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

ion-badge {
  font-size: 12px;
  padding: 4px 8px;
}
</style> 