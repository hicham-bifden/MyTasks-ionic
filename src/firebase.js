// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp
} from "firebase/firestore";
import Task from './models/Task.js';
import User from './models/User.js';

// 🔥 Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1W_JIGlQDqUdw26h6MHXQPIZzdtYisl8",
  authDomain: "bifden.firebaseapp.com",
  databaseURL: "https://bifden.firebaseio.com",
  projectId: "bifden",
  storageBucket: "bifden.appspot.com",
  messagingSenderId: "397620903437",
  appId: "1:397620903437:web:50e4fdf452807a66f61f44"
};

// 🔥 Initialise Firebase
const app = initializeApp(firebaseConfig);

// ✅ Authentification
export const auth = getAuth(app);

// ✅ Firestore
export const db = getFirestore(app);

// 📁 Collections
const COLLECTIONS = {
  USERS: "utilisateurs",
  TASKS: "tasks"
};

// 🧠 Service Firebase
export const firebaseService = {
  // 🔐 Inscription
  async register(user) {
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    
    // Créer l'utilisateur dans Firestore selon les consignes
    const userData = {
      userId: userCredential.user.uid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
    
    await addDoc(collection(db, COLLECTIONS.USERS), userData);
    
    // Retourner l'utilisateur avec les données complètes
    const newUser = new User(
      userData.userId,
      userData.firstName,
      userData.lastName,
      userData.email
    );
    
    return { success: true, user: newUser };
  },

  // 🔐 Connexion
  async login(credentials) {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    
    // Récupérer les données utilisateur depuis Firestore
    const userQuery = query(collection(db, COLLECTIONS.USERS), where("userId", "==", userCredential.user.uid));
    const userSnapshot = await getDocs(userQuery);
    
    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      const user = new User(
        userData.userId,
        userData.firstName,
        userData.lastName,
        userData.email
      );
      return { success: true, user };
    }
    
    return { success: false, error: 'Utilisateur non trouvé dans Firestore' };
  },

  // ➕ Ajouter une tâche
  async addTask(task) {
    const docRef = await addDoc(collection(db, COLLECTIONS.TASKS), {
      ownerId: task.ownerId,
      title: task.title,
      description: task.description,
      status: 'active',
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  },

  // 📥 Récupérer les tâches d'un utilisateur
  async getTasks(ownerId) {
    const q = query(collection(db, COLLECTIONS.TASKS), where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => {
      const taskData = doc.data();
      return new Task(
        doc.id,
        taskData.ownerId,
        taskData.title,
        taskData.description,
        taskData.status || 'active',
        taskData.createdAt
      );
    });
    return { success: true, tasks };
  },

  // 🌍 Récupérer toutes les tâches
  async getAllTasks() {
    try {
      // Récupérer toutes les tâches
      const tasksSnapshot = await getDocs(collection(db, COLLECTIONS.TASKS));
      
      // Récupérer tous les utilisateurs pour avoir leurs noms
      const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      const usersMap = new Map();
      usersSnapshot.docs.forEach(doc => {
        const userData = doc.data();
        usersMap.set(userData.userId, `${userData.firstName} ${userData.lastName}`);
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
        
        // Ajouter le nom du propriétaire
        task.ownerName = usersMap.get(task.ownerId) || 'Utilisateur inconnu';
        return task;
      });
      
      return { success: true, tasks };
    } catch (error) {
      console.error('Erreur getAllTasks:', error);
      throw error;
    }
  },

  // ✏️ Mettre à jour une tâche
  async updateTask(task) {
    const taskRef = doc(db, COLLECTIONS.TASKS, task.taskId);
    await updateDoc(taskRef, {
      title: task.title,
      description: task.description,
      status: task.status
    });
    return { success: true };
  },

  // ❌ Supprimer une tâche
  async removeTask(taskId) {
    await deleteDoc(doc(db, COLLECTIONS.TASKS, taskId));
    return { success: true };
  },

  // 👤 Récupérer les informations d'un utilisateur
  async getUserInfo(userId) {
    try {
      const userQuery = query(collection(db, COLLECTIONS.USERS), where("userId", "==", userId));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        const user = new User(
          userData.userId,
          userData.firstName,
          userData.lastName,
          userData.email
        );
        return { success: true, user };
      }
      
      return { success: false, error: 'Utilisateur non trouvé' };
    } catch (error) {
      console.error('Erreur getUserInfo:', error);
      throw error;
    }
  }
};