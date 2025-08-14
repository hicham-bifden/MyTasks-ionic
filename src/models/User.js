// Modèle Utilisateur pour Firebase
export default class User {
  constructor(uid, email, name, createdAt) {
    this.uid = uid;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
  }
  
  // Méthode pour créer un utilisateur depuis Firestore
  static fromFirestore(doc) {
    const data = doc.data();
    return new User(
      doc.id,
      data.email,
      data.name,
      data.createdAt
    );
  }
  
  // Méthode pour convertir en objet Firestore
  toFirestore() {
    return {
      uid: this.uid,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt
    };
  }
} 