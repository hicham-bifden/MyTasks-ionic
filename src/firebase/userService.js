import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from './firebase.js';
import User from '../models/User.js';

const COLLECTIONS = {
  USERS: "utilisateurs"
};

export const userService = {
  // Récupérer les informations d'un utilisateur par son ID
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
  },

  // Récupérer tous les utilisateurs pour afficher les noms
  async getAllUsers() {
    try {
      const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      const usersMap = new Map();
      
      usersSnapshot.docs.forEach(doc => {
        const userData = doc.data();
        usersMap.set(userData.userId, `${userData.firstName} ${userData.lastName}`);
      });
      
      return { success: true, users: usersMap };
    } catch (error) {
      console.error('Erreur getAllUsers:', error);
      return { success: false, error: error.message };
    }
  }
};
