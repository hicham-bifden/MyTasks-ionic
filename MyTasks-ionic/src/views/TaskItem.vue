<!-- src/components/TaskItem.vue -->
<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ task.title }}</ion-card-title>
      <ion-card-subtitle>
        Créée le {{ formattedDate }}
        <span v-if="showOwner"> • Par: {{ task.userId }}</span>
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      {{ task.description }}
    </ion-card-content>

    <ion-card-content>
      <slot name="actions" />
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/vue';
import { computed } from 'vue';

defineProps({
  task: {
    type: Object,
    required: true
  },
  showOwner: {
    type: Boolean,
    default: false
  }
});

// ✅ Formatage de la date en temps réel
const formattedDate = computed(() => {
  if (!task.createdAt) return 'Date inconnue';

  // Si c'est un Timestamp Firebase, on utilise .toDate()
  const dateObj = task.createdAt.toDate ? task.createdAt.toDate() : new Date(task.createdAt);

  return dateObj.toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});
</script>

<style scoped>
ion-card-subtitle {
  font-size: 0.9em;
  color: #666;
}
</style>