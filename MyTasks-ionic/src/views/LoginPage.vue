<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Connexion</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- Formulaire de connexion -->
      <form @submit.prevent="loginUser">
        <!-- Champ Email -->
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input v-model="email" type="email" required></ion-input>
        </ion-item>
        <!-- Champ Mot de passe -->
        <ion-item>
          <ion-label position="floating">Mot de passe</ion-label>
          <ion-input v-model="password" type="password" required></ion-input>
        </ion-item>
        <!-- Message d'erreur -->
        <ion-text color="danger" v-if="errorMessage">{{ errorMessage }}</ion-text>
        <!-- Bouton de connexion -->
        <ion-button expand="block" type="submit" class="ion-margin-top">Se connecter</ion-button>
        <!-- Lien vers l'inscription -->
        <ion-button expand="block" fill="clear" @click="goToRegister">Créer un compte</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importation des composants Ionic
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText } from '@ionic/vue';
// Importation du service Firebase et de l'état global
import api from '@/services/firebase';
import { state } from '@/store/state';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Champs du formulaire (données réactives)
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

// Fonction appelée lors de la soumission du formulaire
async function loginUser() {
  errorMessage.value = '';
  // Vérification basique des champs
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs.';
    return;
  }
  try {
    // Appel à Firebase pour se connecter
    const response = await api.login({ email: email.value, password: password.value });
    // Stockage de l'utilisateur connecté dans l'état global
    state.user = response.user;
    console.log('Utilisateur connecté:', state.user, response);
    // Redirection vers la page principale (onglets)
    router.push('/mytasks');
  } catch (error) {
    // Gestion des erreurs (mauvais identifiants, etc.)
    errorMessage.value = "Email ou mot de passe incorrect.";
  }
}

// Fonction pour aller à la page d'inscription
function goToRegister() {
  router.push('/register');
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