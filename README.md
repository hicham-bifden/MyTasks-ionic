# 📱 MyTasks - Application de Gestion de Tâches

Une application moderne de gestion de tâches construite avec **Ionic Vue** et **Firebase**, offrant une expérience utilisateur intuitive et des fonctionnalités avancées.

## ✨ Fonctionnalités

### 🔐 Authentification
- **Inscription** : Création de compte avec email et mot de passe
- **Connexion** : Authentification sécurisée
- **Gestion de profil** : Stockage des informations utilisateur

### 📋 Gestion des Tâches
- **Création** : Ajout de nouvelles tâches avec titre et description
- **Modification** : Édition des tâches existantes
- **Suppression** : Suppression sécurisée des tâches
- **Archivage** : Marquage des tâches comme terminées

### 🔍 Recherche et Filtrage
- **Recherche** : Recherche par titre ou description
- **Filtrage** : Filtrage par statut (toutes, actives, terminées)
- **Tri** : Tri par date, titre ou statut (croissant/décroissant)

### 👥 Collaboration
- **Vue personnelle** : Affichage de ses propres tâches
- **Vue publique** : Consultation des tâches des autres utilisateurs
- **Archives** : Accès aux tâches terminées

## 🛠️ Technologies Utilisées

- **Frontend** : Ionic Vue 8 + Vue 3
- **Backend** : Firebase (Firestore + Authentication)
- **Base de données** : Firestore (NoSQL)
- **Authentification** : Firebase Auth
- **Build** : Vite + TypeScript
- **Styling** : CSS avec composants Ionic

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Firebase

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd MyTasks-ionic
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Firebase
1. Créer un projet Firebase
2. Activer Authentication (Email/Password)
3. Activer Firestore Database
4. Copier la configuration dans `src/firebase.js`

### 4. Lancer l'application
```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualisation
npm run preview
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── TaskItem.vue    # Composant d'affichage des tâches
│   └── TabsMenu.vue    # Menu de navigation
├── models/             # Modèles de données
│   ├── Task.js         # Modèle des tâches
│   └── User.js         # Modèle des utilisateurs
├── services/           # Services et API
│   ├── firebase.js     # Service Firebase
│   └── api.js          # Ancien service API (déprécié)
├── store/              # État global
│   └── state.js        # Store Vue réactif
├── views/              # Pages de l'application
│   ├── LoginPage.vue   # Page de connexion
│   ├── RegisterPage.vue # Page d'inscription
│   ├── MyTasksPage.vue # Mes tâches
│   ├── OtherTasksPage.vue # Tâches des autres
│   └── ArchivePage.vue # Tâches archivées
└── firebase.js         # Configuration Firebase
```

## 🔥 Configuration Firebase

### Collections Firestore
- **`utilisateurs`** : Informations des utilisateurs
- **`tasks`** : Tâches des utilisateurs

### Règles de Sécurité
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Utilisateurs peuvent lire/écrire leurs propres données
    match /utilisateurs/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Utilisateurs peuvent lire/écrire leurs propres tâches
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Permettre la lecture de toutes les tâches pour l'affichage public
    match /tasks/{taskId} {
      allow read: if request.auth != null;
    }
  }
}
```

## 📱 Déploiement

### Firebase Hosting
```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser le projet
firebase init hosting

# Déployer
firebase deploy
```

### Capacitor (Mobile)
```bash
# Ajouter les plateformes
npx cap add android
npx cap add ios

# Synchroniser
npx cap sync

# Ouvrir dans l'IDE
npx cap open android
npx cap open ios
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test:unit

# Tests E2E
npm run test:e2e

# Linting
npm run lint
```

## 🔧 Scripts Disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run test:unit` - Tests unitaires
- `npm run test:e2e` - Tests end-to-end
- `npm run lint` - Vérification du code

## 📊 Fonctionnalités Avancées

### Recherche Intelligente
- Recherche en temps réel
- Filtrage par statut
- Tri personnalisable

### Interface Responsive
- Design adaptatif
- Animations fluides
- Composants Ionic natifs

### Gestion d'État
- Store Vue réactif
- Synchronisation Firebase
- Gestion des erreurs

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committer les changements (`git commit -m 'Add AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation Firebase
- Vérifier la console de développement

## 🎯 Roadmap

- [ ] Notifications push
- [ ] Synchronisation offline
- [ ] Partage de tâches
- [ ] Calendrier intégré
- [ ] Thèmes personnalisables
- [ ] Export des données
- [ ] API REST publique

---

**Développé avec ❤️ par Hicham Bifden - 2025** 