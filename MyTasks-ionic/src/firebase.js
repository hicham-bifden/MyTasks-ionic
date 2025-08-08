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
  Timestamp // ✅ Import du Timestamp
} from "firebase/firestore";

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
    await addDoc(collection(db, COLLECTIONS.USERS), {
      uid: userCredential.user.uid,
      email: user.email,
      name: user.name,
      createdAt: Timestamp.now() // ✅ Correction ici
    });
    return { success: true, user: userCredential.user };
  },

  // 🔐 Connexion
  async login(credentials) {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return { success: true, user: userCredential.user };
  },

  // ➕ Ajouter une tâche
  async addTask(task) {
    const docRef = await addDoc(collection(db, COLLECTIONS.TASKS), {
      ...task,
      createdAt: Timestamp.now(), // ✅ Correction ici
      updatedAt: Timestamp.now()  // ✅ Correction ici
    });
    return { success: true, id: docRef.id };
  },

  // 📥 Récupérer les tâches d'un utilisateur
  async getTasks(userId) {
    const q = query(collection(db, COLLECTIONS.TASKS), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, tasks };
  },

  // 🌍 Récupérer toutes les tâches (admin ou vue globale)
  async getAllTasks() {
    const snapshot = await getDocs(collection(db, COLLECTIONS.TASKS));
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, tasks };
  },

  // ✏️ Mettre à jour une tâche
  async updateTask(task) {
    const taskRef = doc(db, COLLECTIONS.TASKS, task.id);
    await updateDoc(taskRef, {
      ...task,
      updatedAt: Timestamp.now() // ✅ Correction ici
    });
    return { success: true };
  },

  // ❌ Supprimer une tâche
  async removeTask(taskId) {
    await deleteDoc(doc(db, COLLECTIONS.TASKS, taskId));
    return { success: true };
  }
};