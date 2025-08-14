// Modèle Tâche pour Firebase
export default class Task {
  constructor(id, userId, title, description, isDone, createdAt, updatedAt, isOwner = false) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.isDone = isDone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isOwner = isOwner; // Pour savoir si l'utilisateur peut modifier
  }
  
  // Méthode pour créer une tâche depuis Firestore
  static fromFirestore(doc) {
    const data = doc.data();
    return new Task(
      doc.id,
      data.userId,
      data.title,
      data.description,
      data.isDone || false,
      data.createdAt,
      data.updatedAt,
      data.isOwner || false
    );
  }
  
  // Méthode pour convertir en objet Firestore
  toFirestore() {
    return {
      userId: this.userId,
      title: this.title,
      description: this.description,
      isDone: this.isDone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 