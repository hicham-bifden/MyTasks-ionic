import { firebaseService } from '../firebase.js';

export default {
  // Inscription
  register(user) {
    return firebaseService.register(user);
  },
  
  // Connexion
  login(credentials) {
    return firebaseService.login(credentials);
  },
  
  // Ajouter une tâche
  addTask(task) {
    return firebaseService.addTask(task);
  },
  
  // Récupérer les tâches
  getTasks(userId) {
    return firebaseService.getTasks(userId);
  },
  
  // Mettre à jour une tâche
  updateTask(task) {
    return firebaseService.updateTask(task);
  },
  
  // Supprimer une tâche
  removeTask(taskId) {
    return firebaseService.removeTask(taskId);
  }
}; 