// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

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

// ✅ Exporte l'auth Firebase
export const auth = getAuth(app);

// 🔥 Initialise Firestore
export const db = getFirestore(app);

// 📝 Noms des collections Firestore
const COLLECTIONS = {
  USERS: "utilisateurs",
  TASKS: "tasks"
};

// 📝 Service Firebase pour remplacer l'API
export const firebaseService = {
  // Inscription
  async register(user) {
    try {
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      
      // Ajouter les informations utilisateur dans Firestore
      await addDoc(collection(db, COLLECTIONS.USERS), {
        uid: userCredential.user.uid,
        email: user.email,
        name: user.name,
        createdAt: new Date()
      });
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      throw error;
    }
  },

  // Connexion
  async login(credentials) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      throw error;
    }
  },

  // Ajouter une tâche
  async addTask(task) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.TASKS), {
        ...task,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les tâches d'un utilisateur
  async getTasks(userId) {
    try {
      const q = query(collection(db, COLLECTIONS.TASKS), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, tasks };
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une tâche
  async updateTask(task) {
    try {
      const taskRef = doc(db, COLLECTIONS.TASKS, task.id);
      await updateDoc(taskRef, {
        ...task,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une tâche
  async removeTask(taskId) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.TASKS, taskId));
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
};
