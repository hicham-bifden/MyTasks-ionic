// Modèle Tâche selon les consignes
export default class Task {
  constructor(taskId, ownerId, title, description, status, createdAt) {
    this.taskId = taskId;
    this.ownerId = ownerId;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
  }
  
  // Méthode pour créer une tâche depuis Firestore
  static fromFirestore(doc) {
    const data = doc.data();
    return new Task(
      doc.id,
      data.ownerId,
      data.title,
      data.description,
      data.status || 'active',
      data.createdAt
    );
  }
  
  // Méthode pour convertir en objet Firestore
  toFirestore() {
    return {
      ownerId: this.ownerId,
      title: this.title,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt
    };
  }
} 