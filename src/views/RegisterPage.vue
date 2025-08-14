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
        <!-- Nom complet -->
        <ion-item>
          <ion-label position="floating">Nom complet</ion-label>
          <ion-input v-model="fullName" required></ion-input>
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
        <ion-button expand="block" fill="clear" @click="goToLogin">
          Déjà un compte ? Se connecter
        </ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonItem, IonLabel, IonInput,
  IonButton, IonText
} from '@ionic/vue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase"; // 🔁 Adapte le chemin si besoin

const fullName = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

async function registerUser() {
  errorMessage.value = '';
  successMessage.value = '';

  if (!fullName.value || !email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs.';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = "Format d'email invalide.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: fullName.value
    });

    successMessage.value = "Inscription réussie ! Vous pouvez vous connecter.";
    setTimeout(() => router.push('/login'), 1500);

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = "Cet email est déjà utilisé.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage.value = "Mot de passe trop faible (minimum 6 caractères).";
    } else {
      errorMessage.value = "Erreur lors de l'inscription : " + error.message;
    }
  }
}

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
