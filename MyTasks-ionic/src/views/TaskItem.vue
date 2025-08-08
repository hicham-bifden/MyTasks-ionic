<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ task.title }}</ion-card-title>
      <ion-card-subtitle>
        Date : {{ formattedDate }}
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

// ✅ Formatage robuste de la date
const formattedDate = computed(() => {
  const raw = task.createdAt;

  if (!raw) return 'Date inconnue';

  let date;

  // 🔍 Si c'est un Timestamp Firebase
  if (typeof raw.toDate === 'function') {
    date = raw.toDate();
  }
  // 🔍 Si c'est une chaîne ISO
  else if (typeof raw === 'string') {
    date = new Date(raw);
  }
  // 🔍 Si c'est déjà un objet Date
  else if (raw instanceof Date) {
    date = raw;
  }
  // 🔍 Si c'est un objet avec seconds/nanoseconds (structure brute Firebase)
  else if (raw.seconds) {
    date = new Date(raw.seconds * 1000);
  }
  else {
    return 'Format de date non reconnu';
  }

  // ✅ Format lisible
  return date.toLocaleString('fr-FR', {
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