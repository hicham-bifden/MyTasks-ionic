import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { db } from './firebase.js';
import Task from '../models/Task.js';

const COLLECTIONS = {
  TASKS: "tasks"
};

export const tasksService = {
  // Ajouter une nouvelle tâche
  async addTask(task) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.TASKS), {
        ownerId: task.ownerId,
        title: task.title,
        description: task.description,
        status: 'active',
        createdAt: Timestamp.now()
      });
      
      const newTask = new Task(
        docRef.id,
        task.ownerId,
        task.title,
        task.description,
        'active',
        Timestamp.now()
      );
      
      return { success: true, task: newTask };
    } catch (error) {
      console.error('Erreur addTask:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer toutes les tâches avec tri par date décroissante
  async getAllTasks() {
    try {
      const tasksQuery = query(
        collection(db, COLLECTIONS.TASKS),
        orderBy("createdAt", "desc")
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      
      // Récupérer tous les utilisateurs pour mapper les noms
      const usersQuery = query(collection(db, "utilisateurs"));
      const usersSnapshot = await getDocs(usersQuery);
      const users = {};
      usersSnapshot.docs.forEach(doc => {
        const userData = doc.data();
        // Utiliser userId comme clé, pas doc.id
        users[userData.userId] = userData;
      });
      
      const tasks = tasksSnapshot.docs.map(doc => {
        const taskData = doc.data();
        const task = new Task(
          doc.id,
          taskData.ownerId,
          taskData.title,
          taskData.description,
          taskData.status || 'active',
          taskData.createdAt
        );
        
        // Ajouter le nom de l'utilisateur propriétaire
        if (users[taskData.ownerId]) {
          task.ownerName = `${users[taskData.ownerId].firstName} ${users[taskData.ownerId].lastName}`;
        } else {
          console.log('Utilisateur non trouvé pour ownerId:', taskData.ownerId, 'Users disponibles:', Object.keys(users));
          task.ownerName = 'Utilisateur inconnu';
        }
        
        return task;
      });
      
      return { success: true, tasks };
    } catch (error) {
      console.error('Erreur getAllTasks:', error);
      throw error;
    }
  },

  /* / ----------------------------------------------------------------------------- Mettre à jour une tâche
  ---------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------------*/
  async updateTask(task) {
    try {
      const taskRef = doc(db, COLLECTIONS.TASKS, task.taskId);
      await updateDoc(taskRef, {
        title: task.title,
        description: task.description,
        status: task.status
      });
      return { success: true };
    } catch (error) {
      console.error('Erreur updateTask:', error);
      return { success: false, error: error.message };
    }
  },

  // Supprimer une tâche
  async removeTask(taskId) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.TASKS, taskId));
      return { success: true };
    } catch (error) {
      console.error('Erreur removeTask:', error);
      return { success: false, error: error.message };
    }
  },

  // Transférer une tâche à un autre utilisateur
  async transferTask(taskId, newOwnerEmail) {
    try {
      // 1. Trouver l'utilisateur par email
      const usersQuery = query(collection(db, "utilisateurs"), where("email", "==", newOwnerEmail));
      const usersSnapshot = await getDocs(usersQuery);
      
      if (usersSnapshot.empty) {
        return { success: false, error: 'Aucun utilisateur trouvé avec cet email' };
      }
      
      const newOwnerDoc = usersSnapshot.docs[0];
      const newOwnerData = newOwnerDoc.data();
      const newOwnerId = newOwnerData.userId;
      
      // 2. Mettre à jour la tâche avec le nouveau propriétaire
      const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
      await updateDoc(taskRef, {
        ownerId: newOwnerId
      });
      
      return { 
        success: true, 
        newOwnerId: newOwnerId,
        newOwnerName: `${newOwnerData.firstName} ${newOwnerData.lastName}`
      };
    } catch (error) {
      console.error('Erreur transferTask:', error);
      return { success: false, error: error.message };
    }
  }
};
