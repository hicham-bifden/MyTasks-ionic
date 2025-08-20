import { authService } from './authService.js';
import { tasksService } from './tasksService.js';
import { userService } from './userService.js';

export { auth, db } from './firebase.js';
export { authService } from './authService.js';
export { tasksService } from './tasksService.js';
export { userService } from './userService.js';

// Service unifié pour la compatibilité
export const firebaseService = {
  // Authentification
  register: authService.register,
  login: authService.login,
  
  // Tâches
  addTask: tasksService.addTask,
  getAllTasks: tasksService.getAllTasks,
  updateTask: tasksService.updateTask,
  removeTask: tasksService.removeTask,
  transferTask: tasksService.transferTask,
  
  // Utilisateurs
  getUserInfo: userService.getUserInfo,
  getAllUsers: userService.getAllUsers
};
