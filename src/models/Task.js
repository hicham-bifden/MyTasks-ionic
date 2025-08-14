// Modèle Tâche
export default class Task {
  constructor(taskId, ownerId, title, description, isDone, date, firstName, lastName, isOwner) {
    this.taskId = taskId;
    this.ownerId = ownerId;
    this.title = title;
    this.description = description;
    this.isDone = isDone;
    this.date = date;
    this.firstName = firstName; // Pour affichage dans "Autres" et "Archivées"
    this.lastName = lastName;
    this.isOwner = isOwner; // Pour savoir si l'utilisateur peut modifier
  }
} 