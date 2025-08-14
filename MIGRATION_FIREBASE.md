# Migration vers Firebase - Guide Complet

## 🎯 Objectif
Remplacer l'API REST par Firebase (Firestore + Authentication) pour une meilleure performance et une gestion en temps réel.

## ✅ Ce qui a été fait

### 1. Configuration Firebase
- ✅ Firebase configuré dans `src/firebase.js`
- ✅ Firestore initialisé
- ✅ Authentication configuré

### 2. Service Firebase créé
- ✅ `src/services/firebase.js` - Service wrapper pour Firebase
- ✅ Toutes les méthodes API migrées vers Firebase

### 3. Composants migrés
- ✅ `LoginPage.vue` - Utilise maintenant Firebase Auth
- ✅ `MyTasksPage.vue` - Utilise Firestore pour les tâches
- ✅ `ArchivePage.vue` - Utilise Firestore pour les tâches archivées
- ✅ `RegisterPage.vue` - Utilise déjà Firebase Auth

## 🔄 Changements principaux

### Structure des données
**Avant (API) :**
```javascript
{
  userId: "123",
  taskId: "456",
  title: "Ma tâche",
  date: "2024-01-01"
}
```

**Après (Firebase) :**
```javascript
{
  id: "firebase-doc-id",
  userId: "firebase-uid",
  title: "Ma tâche",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Authentification
**Avant :** `state.user.userId`
**Après :** `state.user.uid`

### Réponses API
**Avant :** `response.data.tasks`
**Après :** `response.tasks`

## 🚀 Comment utiliser

### 1. Remplacer les imports
```javascript
// Avant
import api from '@/services/api';

// Après
import api from '@/services/firebase';
```

### 2. Ajuster les appels
```javascript
// Avant
const response = await api.getTasks(state.user.userId);
state.tasks = response.data.tasks;

// Après
const response = await api.getTasks(state.user.uid);
state.tasks = response.tasks;
```

### 3. Gestion des IDs
```javascript
// Avant
taskId: task.taskId

// Après
id: task.id
```

## 🔧 Configuration Firebase requise

### 1. Activer les services dans Firebase Console
- ✅ Authentication (Email/Password)
- ✅ Firestore Database

### 2. Règles Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Utilisateurs peuvent lire/écrire leurs propres tâches
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Utilisateurs peuvent lire/écrire leurs propres données
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📊 Avantages de Firebase

1. **Temps réel** - Les données se synchronisent automatiquement
2. **Performance** - Pas de serveur à maintenir
3. **Scalabilité** - Gestion automatique de la charge
4. **Sécurité** - Règles de sécurité intégrées
5. **Offline** - Fonctionne même sans connexion

## 🐛 Dépannage

### Erreur "Permission denied"
- Vérifier les règles Firestore
- S'assurer que l'utilisateur est authentifié

### Erreur "User not found"
- Vérifier que `state.user.uid` existe
- S'assurer que l'utilisateur est connecté

### Données non synchronisées
- Vérifier la connexion internet
- Recharger la page

## 🔮 Prochaines étapes

1. **Temps réel** - Ajouter des listeners Firestore pour la synchronisation automatique
2. **Offline** - Configurer la persistance locale
3. **Notifications** - Ajouter les notifications push
4. **Analytics** - Intégrer Firebase Analytics

## 📝 Notes importantes

- Les données existantes dans l'API ne seront pas migrées automatiquement
- Il faudra créer un script de migration si nécessaire
- Tester toutes les fonctionnalités après la migration
- Sauvegarder l'ancien code API avant de le supprimer 