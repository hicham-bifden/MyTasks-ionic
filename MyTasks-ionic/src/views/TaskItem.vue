<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ task.title }}</ion-card-title>
      <ion-card-subtitle>
        <span v-if="showOwner">Par: {{ task.userId }}</span>
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      {{ task.description }}
    </ion-card-content>

    <!-- ✅ Affichage de la date dans un paragraphe -->
    <ion-card-content>
      <p><strong>Date :</strong> {{ formattedDate }}</p>
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

  if (!raw) return 'Pas de date';

  let date;

  try {
    if (typeof raw.toDate === 'function') {
      date = raw.toDate();
    } else if (typeof raw === 'string') {
      date = new Date(raw);
    } else if (raw instanceof Date) {
      date = raw;
    } else if (raw.seconds) {
      date = new Date(raw.seconds * 1000);
    } else {
      return 'Format de date non reconnu';
    }

    return date.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('Erreur formatage date:', e);
    return 'Date invalide';
  }
});
</script>

<style scoped>
ion-card-subtitle {
  font-size: 0.9em;
  color: #666;
}
p {
  margin: 0;
  font-size: 0.95em;
}
</style>