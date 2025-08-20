# 📱 MyTasks-ionic - Application de Gestion de Tâches

## 🏗️ Architecture du Projet

### Structure des Dossiers
```
MyTasks-ionic/
├── src/
│   ├── firebase/           # Services Firebase modulaires
│   │   ├── firebase.js     # Configuration et initialisation Firebase
│   │   ├── authService.js  # Service d'authentification
│   │   ├── tasksService.js # Service de gestion des tâches
│   │   ├── userService.js  # Service de gestion des utilisateurs
│   │   └── index.js        # Point d'entrée unifié des services
│   ├── components/         # Composants réutilisables
│   ├── views/             # Pages de l'application
│   ├── models/            # Modèles de données
│   ├── store/             # État global de l'application
│   └── router/            # Configuration des routes
├── android/               # Configuration Android
└── public/                # Assets publics
```

## 🔥 Services Firebase

### 1. Configuration Firebase (`src/firebase/firebase.js`)
```javascript
// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Export des instances principales
export const auth = getAuth(app);        // Authentification
export const db = getFirestore(app);     // Base de données Firestore
```

**Fonctions disponibles :**
- `initializeApp()` - Initialise l'application Firebase
- `getAuth()` - Récupère l'instance d'authentification
- `getFirestore()` - Récupère l'instance Firestore

### 2. Service d'Authentification (`src/firebase/authService.js`)

#### Fonction `register(user)`
```javascript
async register(user) {
  // Créer un compte utilisateur avec email/mot de passe
  const userCredential = await createUserWithEmailAndPassword(
    auth, 
    user.email, 
    user.password
  );
  
  // Ajouter les informations utilisateur dans Firestore
  await addDoc(collection(db, "utilisateurs"), {
    userId: userCredential.user.uid,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  });
}
```

**Fonctions Firestore utilisées :**
- `collection(db, "utilisateurs")` - Référence à la collection utilisateurs
- `addDoc()` - Ajouter un document utilisateur

#### Fonction `login(credentials)`
```javascript
async login(credentials) {
  // Connexion avec email/mot de passe
  const userCredential = await signInWithEmailAndPassword(
    auth, 
    credentials.email, 
    credentials.password
  );
  
  // Récupérer les informations utilisateur depuis Firestore
  const userQuery = query(
    collection(db, "utilisateurs"), 
    where("userId", "==", userCredential.user.uid)
  );
}
```

**Fonctions Firestore utilisées :**
- `query()` - Créer une requête
- `where("userId", "==", uid)` - Filtrer par ID utilisateur
- `getDocs()` - Récupérer les documents

### 3. Service de Gestion des Tâches (`src/firebase/tasksService.js`)

#### Fonction `addTask(task)`
```javascript
async addTask(task) {
  // Ajouter une nouvelle tâche dans Firestore
  const docRef = await addDoc(collection(db, "tasks"), {
    ownerId: task.ownerId,
    title: task.title,
    description: task.description,
    status: 'active',
    createdAt: Timestamp.now()
  });
}
```

**Fonctions Firestore utilisées :**
- `collection(db, "tasks")` - Référence à la collection tâches
- `addDoc()` - Ajouter un document tâche
- `Timestamp.now()` - heure actuel

#### Fonction `getAllTasks()`
```javascript
async getAllTasks() {
  // Requête avec tri par date de création décroissante
  const tasksQuery = query(
    collection(db, "tasks"),
    orderBy("createdAt", "desc")
  );
  
  // Récupérer toutes les tâches
  const tasksSnapshot = await getDocs(tasksQuery);
  
  // Récupérer les utilisateurs pour mapper les noms
  const usersQuery = query(collection(db, "utilisateurs"));
  const usersSnapshot = await getDocs(usersQuery);
  
  // Mapper les tâches avec les noms d'utilisateurs
  const tasks = tasksSnapshot.docs.map(doc => {
    const taskData = doc.data();
    const task = new Task(/* ... */);
    
    // Ajouter le nom du propriétaire
    if (users[taskData.ownerId]) {
      task.ownerName = `${users[taskData.ownerId].firstName} ${users[taskData.ownerId].lastName}`;
    }
    
    return task;
  });
}
```

**Fonctions Firestore utilisées :**
- `query()` - Créer une requête
- `orderBy("createdAt", "desc")` - Trier par date décroissante
- `getDocs()` - Récupérer les documents
- `doc.data()` - Extraire les données du document

#### Fonction `updateTask(task)`
```javascript
async updateTask(task) {
  // Mettre à jour une tâche existante
  const taskRef = doc(db, "tasks", task.taskId);
  await updateDoc(taskRef, {
    title: task.title,
    description: task.description,
    status: task.status
  });
}
```

**Fonctions Firestore utilisées :**
- `doc(db, "tasks", taskId)` - Référence à un document spécifique
- `updateDoc()` - Mettre à jour un document

#### Fonction `removeTask(taskId)`
```javascript
async removeTask(taskId) {
  // Supprimer une tâche
  await deleteDoc(doc(db, "tasks", taskId));
}
```

**Fonctions Firestore utilisées :**
- `doc(db, "tasks", taskId)` - Référence au document à supprimer
- `deleteDoc()` - Supprimer un document

#### Fonction `transferTask(taskId, newOwnerEmail)` ⭐ NOUVELLE
```javascript
async transferTask(taskId, newOwnerEmail) {
  // 1. Trouver l'utilisateur par email
  const usersQuery = query(
    collection(db, "utilisateurs"), 
    where("email", "==", newOwnerEmail)
  );
  const usersSnapshot = await getDocs(usersQuery);
  
  // 2. Mettre à jour la propriété de la tâche
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    ownerId: newOwnerId
  });
}
```

**Fonctions Firestore utilisées :**
- `query(collection, where("email", "==", email))` - Recherche par email
- `updateDoc()` - Mettre à jour le propriétaire de la tâche

### 4. Service de Gestion des Utilisateurs (`src/firebase/userService.js`)

#### Fonction `getUserInfo(userId)`
```javascript
async getUserInfo(userId) {
  const userQuery = query(
    collection(db, "utilisateurs"), 
    where("userId", "==", userId)
  );
  const userSnapshot = await getDocs(userQuery);
  
  if (!userSnapshot.empty) {
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    return new User(/* ... */);
  }
}
```

#### Fonction `getAllUsers()`
```javascript
async getAllUsers() {
  const usersSnapshot = await getDocs(collection(db, "utilisateurs"));
  const usersMap = new Map();
  
  usersSnapshot.docs.forEach(doc => {
    const userData = doc.data();
    usersMap.set(userData.userId, `${userData.firstName} ${userData.lastName}`);
  });
}
```

## 📊 Modèles de Données

### Modèle Task (`src/models/Task.js`)
```javascript
export default class Task {
  constructor(taskId, ownerId, title, description, status, createdAt) {
    this.taskId = taskId;           // ID unique de la tâche
    this.ownerId = ownerId;         // ID du propriétaire
    this.title = title;             // Titre de la tâche
    this.description = description; // Description détaillée
    this.status = status;           // Statut: 'active', 'fermee', 'archivee'
    this.createdAt = createdAt;     // Date de création
    this.ownerName = null;          // Nom du propriétaire (rempli par le service)
  }
  
  // Conversion depuis Firestore
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
  
  // Conversion vers Firestore
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
```

### Modèle User (`src/models/User.js`)
```javascript
export default class User {
  constructor(userId, firstName, lastName, email) {
    this.userId = userId;       // ID unique Firebase Auth
    this.firstName = firstName; // Prénom
    this.lastName = lastName;   // Nom de famille
    this.email = email;         // Adresse email
  }
}
```

## 🎯 Fonctionnalités des Tâches

### 1. Création de Tâche
- **Formulaire** : Titre et description obligatoires
- **Propriétaire** : Automatiquement assigné à l'utilisateur connecté
- **Statut** : Initialisé à 'active'
- **Horodatage** : Date de création automatique

### 2. Gestion des Tâches
- **Modification** : Titre et description modifiables
- **Fermeture** : Changement de statut vers 'fermee'
- **Archivage** : Changement de statut vers 'archivee'
- **Suppression** : Suppression définitive de la base

### 3. Transfert de Tâche ⭐ NOUVELLE
- **Propriétaire uniquement** : Seul le propriétaire peut transférer
- **Validation email** : Vérification de l'existence de l'utilisateur
- **Confirmation visuelle** : Modal avec détails et avertissement
- **Mise à jour Firestore** : Changement automatique du propriétaire

### 4. Affichage des Tâches
- **Tri automatique** : Par date de création (plus récent en premier)
- **Filtrage par statut** : Active, fermée, archivée
- **Informations complètes** : Titre, description, propriétaire, date
- **Actions contextuelles** : Boutons selon le statut et la propriété

## 👥 Fonctionnalités des Utilisateurs

### 1. Authentification
- **Inscription** : Création de compte avec validation
- **Connexion** : Authentification sécurisée
- **Déconnexion** : Nettoyage de l'état et redirection

### 2. Gestion des Profils
- **Informations personnelles** : Prénom, nom, email
- **Validation** : Vérification des champs obligatoires
- **Sécurité** : Mots de passe chiffrés par Firebase

### 3. Droits d'Accès
- **Propriétaire** : Modification, fermeture, archivage, suppression, transfert
- **Lecteur** : Consultation des tâches de tous les utilisateurs
- **Authentification requise** : Protection des actions sensibles

## 🔧 Fonctionnalités Techniques

### 1. Architecture Modulaire
- **Services séparés** : Auth, Tasks, Users indépendants
- **Point d'entrée unifié** : `firebaseService` pour la compatibilité
- **Réutilisabilité** : Services utilisables dans tous les composants

### 2. Gestion d'État
- **Store centralisé** : État global des utilisateurs et tâches
- **Réactivité Vue** : Mise à jour automatique de l'interface
- **Persistance** : Données conservées pendant la session

### 3. Gestion des Erreurs
- **Try-catch** : Capture des erreurs Firebase
- **Messages utilisateur** : Affichage des erreurs en français
- **Logs console** : Débogage pour les développeurs

### 4. Performance
- **Tri serveur** : `orderBy()` dans Firestore
- **Requêtes optimisées** : Une seule requête pour les tâches
- **Mise à jour locale** : État mis à jour immédiatement

## 🚀 Démarrage Rapide

### 1. Installation
```bash
npm install
```

### 2. Configuration Firebase
- Créer un projet Firebase
- Activer Authentication et Firestore
- Copier la configuration dans `src/firebase/firebase.js`

### 3. Lancement
```bash
npm run dev
```

### 4. Build Android
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## 📱 Interface Utilisateur

### Pages Principales
- **ActivesPage** : Tâches actives avec actions complètes
- **FermeesPage** : Tâches fermées avec possibilité d'archivage
- **ArchivePage** : Tâches archivées en lecture seule
- **LoginPage** : Connexion utilisateur
- **RegisterPage** : Inscription utilisateur

### Composants
- **TaskItem** : Affichage d'une tâche avec actions
- **TabsMenu** : Navigation entre les pages
- **Modals** : Formulaires d'ajout, modification et transfert

## 🔒 Sécurité

### Règles Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Utilisateurs : lecture/écriture pour l'utilisateur lui-même
    match /utilisateurs/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tâches : lecture pour tous, écriture pour le propriétaire
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.ownerId;
    }
  }
}
```

### Validation des Données
- **Côté client** : Validation des formulaires
- **Côté serveur** : Règles Firestore
- **Authentification** : Vérification de l'identité

## 🧪 Tests et Débogage

### Logs Console
- **Erreurs Firebase** : Détails des erreurs de base de données
- **Actions utilisateur** : Traçage des opérations
- **Performance** : Temps d'exécution des requêtes

### Outils de Développement
- **Vue DevTools** : Inspection de l'état et des composants
- **Firebase Console** : Surveillance des données et de l'authentification
- **Console navigateur** : Logs et erreurs JavaScript

## 🔄 Workflow des Tâches

```
Création → Active → Fermée → Archivée
    ↓         ↓        ↓        ↓
  Ajout    Modifier  Réouvrir  Lecture
  Modifier  Fermer    Archiver  seule
  Supprimer Supprimer Supprimer
  Transférer
```

## 📈 Améliorations Futures

### Fonctionnalités Suggérées
- **Notifications** : Alertes pour les tâches en retard
- **Collaboration** : Partage de tâches entre utilisateurs
- **Statistiques** : Tableaux de bord et métriques
- **Import/Export** : Sauvegarde et restauration des données
- **API REST** : Interface pour intégrations externes

### Optimisations Techniques
- **Pagination** : Chargement progressif des tâches
- **Cache local** : Stockage hors ligne avec IndexedDB
- **WebSockets** : Mise à jour en temps réel
- **PWA** : Installation comme application native

---

**Version** : 2.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe de développement MyTasks-ionic 