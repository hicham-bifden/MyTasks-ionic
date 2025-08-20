<template>
  <ion-card class="task-item">
    <ion-card-header>
      <ion-card-title class="task-title">{{ task.title }}</ion-card-title>
      <ion-card-subtitle class="task-subtitle">
        {{ task.description }}
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <div class="task-info">
        <div class="info-row">
          <span class="info-text">{{ task.ownerName || 'Utilisateur' }}</span>
        </div>
        
        <div class="info-row">
          <span class="info-text">{{ formatDate(task.createdAt) }}</span>
        </div>
        
        <div class="status-badge" :class="'status-' + task.status">
          {{ getStatusText(task.status) }}
        </div>
      </div>

      <slot name="actions"></slot>
    </ion-card-content>


  </ion-card>
</template>

<script setup>
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  showOwner: {
    type: Boolean,
    default: false
  }
});

function formatDate(dateString) {
  if (!dateString) return 'Pas de date';
  
  try {
    let date;
    if (typeof dateString.toDate === 'function') {
      date = dateString.toDate();
    } else {
      date = new Date(dateString);
    }
    
    return date.toISOString().slice(0, 19).replace('T', ' ');
  } catch (e) {
    return 'Date invalide';
  }
}

function getStatusText(status) {
  const statusMap = {
    'active': 'Active',
    'fermee': 'Fermée',
    'archivee': 'Archivée'
  };
  return statusMap[status] || status;
}


</script>

<style scoped>
.task-item {
  margin: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background: #f4f5f8;
}

.task-title {
  font-size: 18px;
  font-weight: 600;
  color: #222428;
  margin-bottom: 8px;
}

.task-subtitle {
  font-size: 16px;
  color: #92949c;
  line-height: 1.4;
}

.task-info {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #92949c;
}

.info-text {
  flex: 1;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 8px;
}

.status-active {
  background: rgba(45, 211, 111, 0.1);
  color: #2dd36f;
  border: 1px solid rgba(45, 211, 111, 0.3);
}

.status-fermee {
  background: rgba(255, 196, 9, 0.1);
  color: #ffc409;
  border: 1px solid rgba(255, 196, 9, 0.3);
}

.status-archivee {
  background: rgba(146, 148, 156, 0.1);
  color: #92949c;
  border: 1px solid rgba(146, 148, 156, 0.3);
}



@media (max-width: 576px) {
  .task-item {
    margin: 6px;
  }
  
  .task-title {
    font-size: 16px;
  }
  
  .task-subtitle {
    font-size: 14px;
  }
}

@media (min-width: 769px) {
  .task-item {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style> 