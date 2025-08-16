// Modèle Utilisateur selon les consignes
export default class User {
  constructor(userId, firstName, lastName, email) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
  
  // Getter pour le nom complet
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
} 