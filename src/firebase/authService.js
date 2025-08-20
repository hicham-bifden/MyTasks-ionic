import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from './firebase.js';
import User from '../models/User.js';

const COLLECTIONS = {
  USERS: "utilisateurs"
};

export const authService = {




  // Inscription d'un nouvel utilisateur. - - - - - - - - - -- ------------
  //---------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  async register(user) {
    try {
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
    } catch (error) {
      console.error('Erreur register:', error);
      return { success: false, error: error.message };
    }
  },

  /* / --------------------------------------------------------------------------------------------------------
  -----------------------------------------------Connexion d'un utilisateur--------------------------------------------------------------------------
  --------------------------------------------------------------------------------------------------------------*/
  async login(credentials) {
    try {
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
    } catch (error) {
      console.error('Erreur login:', error);
      return { success: false, error: error.message };
    }
  }
};
