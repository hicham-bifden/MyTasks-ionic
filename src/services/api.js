import axios from 'axios';

const API_URL = 'https://server-1-t93s.onrender.com/api';

export default {
  // Inscription
  register(user) {
    return axios.post(`${API_URL}/user/signup`, user);
  },
  // Connexion
  login(credentials) {
    return axios.post(`${API_URL}/user/login`, credentials);
  },
  // Ajouter une tâche
  addTask(task) {
    return axios.post(`${API_URL}/tasks-management/add-task`, task);
  },
  // Récupérer les tâches
  getTasks(userId) {
    return axios.get(`${API_URL}/tasks-management/get-tasks/${userId}`);
  },
  // Mettre à jour une tâche
  updateTask(task) {
    return axios.put(`${API_URL}/tasks-management/update-task`, task);
  },
  // Supprimer une tâche
  removeTask(data) {
    return axios.delete(`${API_URL}/tasks-management/remove-task`, { data });
  }
}; 