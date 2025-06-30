<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Inscription</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- Formulaire d'inscription -->
      <form @submit.prevent="registerUser">
        <!-- Prénom -->
        <ion-item>
          <ion-label position="floating">Prénom</ion-label>
          <ion-input v-model="firstName" required></ion-input>
        </ion-item>
        <!-- Nom -->
        <ion-item>
          <ion-label position="floating">Nom</ion-label>
          <ion-input v-model="lastName" required></ion-input>
        </ion-item>
        <!-- Email -->
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input v-model="email" type="email" required></ion-input>
        </ion-item>
        <!-- Mot de passe -->
        <ion-item>
          <ion-label position="floating">Mot de passe</ion-label>
          <ion-input v-model="password" type="password" required></ion-input>
        </ion-item>
        <!-- Message d'erreur ou de succès -->
        <ion-text color="danger" v-if="errorMessage">{{ errorMessage }}</ion-text>
        <ion-text color="success" v-if="successMessage">{{ successMessage }}</ion-text>
        <!-- Bouton d'inscription -->
        <ion-button expand="block" type="submit" class="ion-margin-top">S'inscrire</ion-button>
        <!-- Lien vers la connexion -->
        <ion-button expand="block" fill="clear" @click="goToLogin">Déjà un compte ? Se connecter</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importation des composants Ionic
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText } from '@ionic/vue';
import api from '@/services/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Champs du formulaire (données réactives)
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

// Fonction appelée lors de la soumission du formulaire
async function registerUser() {
  errorMessage.value = '';
  successMessage.value = '';
  // Vérification basique des champs
  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs.';
    return;
  }
  // Vérification du format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = "Format d'email invalide.";
    return;
  }
  try {
    // Appel à l'API pour s'inscrire
    await api.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    });
    // Succès : message et redirection possible
    successMessage.value = "Inscription réussie ! Vous pouvez vous connecter.";
    // Optionnel : rediriger automatiquement après quelques secondes
    setTimeout(() => router.push('/login'), 1500);
  } catch (error) {
    // Gestion des erreurs (email déjà utilisé, etc.)
    if (error.response && error.response.status === 409) {
      errorMessage.value = "Cet email est déjà utilisé.";
    } else {
      errorMessage.value = "Erreur lors de l'inscription.";
    }
  }
}

// Fonction pour aller à la page de connexion
function goToLogin() {
  router.push('/login');
}
</script>

<style scoped>
ion-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
</style> 