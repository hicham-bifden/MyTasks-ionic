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
  orderBy,
  Timestamp
} from "firebase/firestore";
import Task from './models/Task.js';
import User from './models/User.js';

const firebaseConfig = {
  apiKey: "AIzaSyA1W_JIGlQDqUdw26h6MHXQPIZzdtYisl8",
  authDomain: "bifden.firebaseapp.com",
  databaseURL: "https://bifden.firebaseio.com",
  projectId: "bifden",
  storageBucket: "bifden.appspot.com",
  messagingSenderId: "397620903437",
  appId: "1:397620903437:web:50e4fdf452807a66f61f44"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const COLLECTIONS = {
  USERS: "utilisateurs",
  TASKS: "tasks"
};

export const firebaseService = {
  async register(user) {
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    
    const userData = {
      userId: userCredential.user.uid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
    
    await addDoc(collection(db, COLLECTIONS.USERS), userData);
    
    const newUser = new User(
      userData.userId,
      userData.firstName,
      userData.lastName,
      userData.email
    );
    
    return { success: true, user: newUser };
  },

  async login(credentials) {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    
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

  async getTasks(ownerId) {
    const q = query(
      collection(db, COLLECTIONS.TASKS),
      where("ownerId", "==", ownerId),
      orderBy("createdAt", "desc")
    );
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

  async getAllTasks() {
    try {
      const tasksSnapshot = await getDocs(collection(db, COLLECTIONS.TASKS));
      
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
        
        task.ownerName = usersMap.get(task.ownerId) || 'Utilisateur inconnu';
        return task;
      });
      
      return { success: true, tasks };
    } catch (error) {
      console.error('Erreur getAllTasks:', error);
      throw error;
    }
  },

  async updateTask(task) {
    const taskRef = doc(db, COLLECTIONS.TASKS, task.taskId);
    await updateDoc(taskRef, {
      title: task.title,
      description: task.description,
      status: task.status
    });
    return { success: true };
  },

  async transferTask(taskId, newOwnerEmail) {
    try {
      const userQuery = query(collection(db, COLLECTIONS.USERS), where("email", "==", newOwnerEmail));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        return { success: false, error: 'Utilisateur non trouvé avec cette adresse email' };
      }
      
      const newOwnerData = userSnapshot.docs[0].data();
      
      const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
      await updateDoc(taskRef, {
        ownerId: newOwnerData.userId
      });
      
      return { 
        success: true, 
        newOwnerId: newOwnerData.userId,
        newOwnerName: `${newOwnerData.firstName} ${newOwnerData.lastName}`
      };
    } catch (error) {
      console.error('Erreur transferTask:', error);
      return { success: false, error: error.message };
    }
  },

  async removeTask(taskId) {
    await deleteDoc(doc(db, COLLECTIONS.TASKS, taskId));
    return { success: true };
  },

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
      return { success: false, error: error.message };
    }
  }
};