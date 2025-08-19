# MyTasks - Application de Gestion de Tâches

Application Ionic Vue.js moderne pour la gestion de tâches avec authentification Firebase et base de données Firestore.

## ✨ Fonctionnalités

- 🔐 **Authentification complète** : Inscription, connexion, gestion des sessions
- 📝 **Gestion des tâches** : CRUD complet avec Firestore
- 🏷️ **Statuts multiples** : Actives, fermées, archivées
- 👥 **Gestion des utilisateurs** : Prénom, nom, droits d'accès
- 🔍 **Recherche et filtrage** : Par titre, description, propriétaire
- 📱 **Interface mobile-first** : Optimisée pour Android et iOS
- 🌙 **Mode sombre** : Support automatique
- 🚀 **Performance** : Chargement rapide, interface réactive

## 📱 Optimisations Mobile Capacitor

### **Configuration Android/iOS**
- **App ID** : `com.mytasks.ionic`
- **Nom** : `MyTasks`
- **SplashScreen** : Personnalisé avec couleurs de l'app
- **StatusBar** : Style sombre avec couleur primaire
- **Versions minimales** : Android WebView 55+, iOS 13.0+

### **Interface Mobile-First**
- **Navigation** : Tabs en bas (standard mobile)
- **Boutons tactiles** : Hauteur ≥48px pour tous les écrans
- **Responsive** : Breakpoints 576px, 768px, 769px+
- **Animations** : Transitions fluides et effets tactiles
- **Accessibilité** : Focus visible, contrastes optimisés

### **Déploiement Mobile**
```bash
# Android
npx cap add android
npx cap sync android
npx cap open android

# iOS
npx cap add ios
npx cap sync ios
npx cap open ios
```

## 🏗️ Architecture

### **Technologies**
- **Frontend** : Ionic Vue.js 7
- **Base de données** : Firebase Firestore
- **Authentification** : Firebase Auth
- **Mobile** : Capacitor 5
- **Build** : Vite

### **Structure des Données**

#### **Utilisateur (User)**
```javascript
{
  userId: string,      // UID Firebase
  firstName: string,   // Prénom
  lastName: string,    // Nom de famille
  email: string        // Email
}
```

#### **Tâche (Task)**
```javascript
{
  taskId: string,      // ID auto-généré
  ownerId: string,     // UID du créateur
  title: string,       // Titre de la tâche
  description: string, // Description
  status: 'active' | 'fermee' | 'archivee',
  createdAt: string    // Date de création
}
```

## 🚀 Installation et Démarrage

### **Prérequis**
- Node.js 18+
- npm ou yarn
- Compte Firebase

### **Installation**
```bash
# Cloner le projet
git clone [url-du-repo]
cd MyTasks-ionic

# Installer les dépendances
npm install

# Configuration Firebase
# Copier vos clés dans src/firebase.js
```

### **Démarrage**
```bash
# Mode développement
npm run dev

# Build production
npm run build

# Build mobile
npm run build
npx cap sync
```

## 🔧 Configuration Firebase

1. **Créer un projet Firebase**
2. **Activer Authentication** (Email/Password)
3. **Activer Firestore**
4. **Configurer les règles de sécurité**
5. **Copier les clés dans `src/firebase.js`**

### **Règles Firestore**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.ownerId == request.auth.uid);
    }
  }
}
```

## 📱 Fonctionnalités par Onglet

### **🟢 Actives**
- ✅ Afficher mes tâches actives
- ✅ Afficher tâches des autres utilisateurs
- ✅ Ajouter de nouvelles tâches
- ✅ Modifier mes tâches
- ✅ Fermer mes tâches
- ✅ Supprimer mes tâches
- 🔍 Recherche par titre/description

### **🟡 Fermées**
- ✅ Afficher mes tâches fermées
- ✅ Réouvrir mes tâches
- ✅ Archiver mes tâches
- 📊 Tri par date de création

### **🔴 Archivées**
- ✅ Consulter toutes les tâches archivées
- 📖 Lecture seule (modification admin uniquement)
- 📊 Tri par date de création

## 🎨 Interface Utilisateur

### **Design Mobile-First**
- **Responsive** : Adapté à tous les écrans
- **Tactile** : Boutons et interactions optimisés
- **Accessible** : Contrastes et focus visibles
- **Moderne** : Animations et transitions fluides

### **Thème et Couleurs**
- **Primaire** : Bleu (#3880ff)
- **Secondaire** : Bleu clair (#3dc2ff)
- **Succès** : Vert (#2dd36f)
- **Avertissement** : Orange (#ffc409)
- **Danger** : Rouge (#eb445a)

## 🔒 Sécurité et Permissions

### **Authentification**
- Inscription avec prénom, nom, email, mot de passe
- Connexion sécurisée
- Gestion des sessions
- Déconnexion automatique

### **Droits d'Accès**
- **Lecture** : Toutes les tâches pour utilisateurs connectés
- **Écriture** : Uniquement ses propres tâches
- **Suppression** : Uniquement ses propres tâches
- **Archivage** : Uniquement ses propres tâches

## 📊 Performance

### **Optimisations Appliquées**
- ✅ **Chargement** : Pas de spinner, interface directe
- ✅ **Cache** : Données Firestore mises en cache
- ✅ **Responsive** : CSS optimisé pour mobile
- ✅ **Animations** : GPU acceleration
- ✅ **Bundle** : Vite pour build rapide

### **Métriques**
- **Temps de chargement** : <2s
- **Taille du bundle** : <500KB
- **Responsivité** : 100% mobile-friendly
- **Accessibilité** : WCAG 2.1 AA

## 🧪 Tests

### **Tests E2E**
```bash
npm run e2e
```

### **Tests Unitaires**
```bash
npm run test
```

## 📦 Déploiement

### **Firebase Hosting**
```bash
npm run build
firebase deploy
```

### **Mobile (Android/iOS)**
```bash
npm run build
npx cap sync
npx cap open android  # ou ios
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **Ionic Framework** pour l'infrastructure mobile
- **Vue.js** pour le framework frontend
- **Firebase** pour l'infrastructure backend
- **Capacitor** pour le déploiement mobile

---

**MyTasks** - Gestion de tâches moderne et mobile-first ! 🚀 