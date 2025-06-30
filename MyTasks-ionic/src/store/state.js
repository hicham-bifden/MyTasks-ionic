import { reactive } from 'vue';

export const state = reactive({
  user: null, // Utilisateur connecté
  tasks: [],  // Toutes les tâches récupérées
}); 