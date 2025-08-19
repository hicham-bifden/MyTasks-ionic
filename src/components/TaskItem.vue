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
      
      <div v-if="task.status === 'active' && showTransfer" class="transfer-section">
        <ion-button 
          size="small" 
          color="tertiary" 
          @click="showTransferModal = true"
          class="transfer-button"
        >
          Transférer
        </ion-button>
      </div>
    </ion-card-content>

    <ion-modal :is-open="showTransferModal" @didDismiss="closeTransferModal">
      <ion-header>
        <ion-toolbar color="tertiary">
          <ion-title>Transférer la tâche</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeTransferModal">Fermer</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="transfer-form">
          <ion-item>
            <ion-label position="stacked">Email du nouveau propriétaire</ion-label>
            <ion-input 
              v-model="transferEmail" 
              type="email" 
              placeholder="exemple@email.com"
              required
            ></ion-input>
          </ion-item>
          
          <div class="transfer-info">
            <ion-text color="medium">
              Cette tâche sera transférée à l'utilisateur avec cette adresse email.
            </ion-text>
          </div>
          
          <div class="transfer-actions">
            <ion-button 
              expand="block" 
              color="tertiary" 
              @click="confirmTransfer"
              :disabled="!transferEmail || transferEmail.trim() === ''"
            >
              Confirmer le transfert
            </ion-button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-card>
</template>

<script setup>
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonItem, IonLabel, IonInput, IonText } from '@ionic/vue';
import { ref } from 'vue';
import { firebaseService } from '@/firebase';

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  showOwner: {
    type: Boolean,
    default: false
  },
  showTransfer: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['taskTransferred']);

const showTransferModal = ref(false);
const transferEmail = ref('');

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

function closeTransferModal() {
  showTransferModal.value = false;
  transferEmail.value = '';
}

async function confirmTransfer() {
  if (!transferEmail.value || transferEmail.value.trim() === '') {
    return;
  }
  
  try {
    const result = await firebaseService.transferTask(props.task.taskId, transferEmail.value.trim());
    
    if (result.success) {
      emit('taskTransferred', {
        taskId: props.task.taskId,
        newOwnerId: result.newOwnerId,
        newOwnerName: result.newOwnerName
      });
      
      closeTransferModal();
    } else {
      alert(`Erreur: ${result.error}`);
    }
  } catch (error) {
    console.error('Erreur lors du transfert:', error);
    alert('Erreur lors du transfert de la tâche');
  }
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

.transfer-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #92949c;
}

.transfer-button {
  width: 100%;
  border-radius: 8px;
}

.transfer-form {
  padding: 16px 0;
}

.transfer-info {
  margin: 16px 0;
  padding: 12px;
  background: rgba(82, 96, 255, 0.1);
  border-radius: 8px;
}

.transfer-actions {
  margin-top: 24px;
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