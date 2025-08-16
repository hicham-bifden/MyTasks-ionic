# MyTasks - Application de Gestion de Tâches

## Description
Application Ionic avec Firebase pour la gestion de tâches avec authentification complète et interface à onglets.

## Fonctionnalités

### 🔐 Authentification Firebase
- Inscription et connexion des utilisateurs
- Gestion des sessions avec Firebase Auth
- Protection des routes

### 📋 Gestion des Tâches
- **CRUD complet** sur les tâches avec Firestore
- **Trois statuts** : Active, Fermée, Archivée
- **Droits d'accès** : modification uniquement des propres tâches
- **Tri automatique** par date de création décroissante

### 🎯 Interface à Onglets

#### 1. **Actives** (`/tabs/actives`)
- Affiche les tâches actives de l'utilisateur connecté
- Permet de créer, modifier, fermer et supprimer les tâches
- Bouton d'ajout de nouvelle tâche

#### 2. **Fermées** (`/tabs/fermees`)
- Affiche les tâches fermées de l'utilisateur connecté
- Permet de réouvrir ou archiver les tâches
- Actions limitées au propriétaire

#### 3. **Archivées** (`/tabs/archivees`)
- Affiche toutes les tâches archivées (lecture seule)
- Aucune modification possible par les utilisateurs
- Seul un admin peut changer le statut via Firestore

### 🔒 Permissions et Sécurité
- L'utilisateur ne peut modifier que ses propres tâches
- Modification du statut uniquement sur les tâches actives et fermées
- Consultation des tâches des autres utilisateurs en lecture seule
- Affichage du nom du propriétaire sur toutes les tâches

## Structure du Projet

```
src/
├── components/
│   ├── TaskItem.vue          # Composant d'affichage des tâches
│   └── TabsMenu.vue          # Menu de navigation par onglets
├── views/
│   ├── ActivesPage.vue       # Page des tâches actives
│   ├── FermeesPage.vue       # Page des tâches fermées
│   ├── ArchivePage.vue       # Page des tâches archivées
│   ├── LoginPage.vue         # Page de connexion
│   ├── RegisterPage.vue      # Page d'inscription
│   └── TabsPage.vue          # Conteneur des onglets
├── services/
│   └── firebase.js           # Service Firebase (remplace l'API externe)
├── models/
│   ├── Task.js               # Modèle de tâche
│   └── User.js               # Modèle d'utilisateur
└── firebase.js               # Configuration et service Firebase
```

## Modèles de Données

### Tâche (Task)
```javascript
{
  id: string,           // ID auto-généré par Firestore
  userId: string,       // UID Firebase du créateur
  title: string,        // Titre de la tâche
  description: string,  // Description de la tâche
  status: 'active' | 'fermee' | 'archivee',
  createdAt: Timestamp, // Date de création
  updatedAt: Timestamp, // Date de dernière modification
  isOwner: boolean      // Si l'utilisateur connecté est propriétaire
}
```

### Utilisateur (User)
```javascript
{
  uid: string,          // UID Firebase
  email: string,        // Email de l'utilisateur
  name: string,         // Nom de l'utilisateur
  createdAt: Timestamp  // Date de création du compte
}
```

## Installation et Démarrage

1. **Cloner le projet**
```bash
git clone <repository-url>
cd MyTasks-ionic
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Firebase**
- Créer un projet Firebase
- Activer Authentication et Firestore
- Mettre à jour la configuration dans `src/firebase.js`

4. **Lancer l'application**
```bash
npm run dev
```

## Déploiement

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Capacitor (Android/iOS)
```bash
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

## Technologies Utilisées

- **Frontend** : Ionic Vue 7
- **Backend** : Firebase (Auth + Firestore)
- **Build** : Vite
- **Mobile** : Capacitor
- **Langage** : TypeScript/JavaScript

## Consignes Respectées

✅ **CRUD complet** sur les tâches avec Firestore  
✅ **Authentification Firebase** complète  
✅ **Interface à onglets** avec filtres dynamiques  
✅ **Gestion des droits d'accès** : modification uniquement des propres tâches  
✅ **Optimisation mobile** avec Capacitor  
✅ **Déploiement Firebase Hosting**  
✅ **Suppression de l'API externe** - utilisation exclusive de Firestore  

## Notes Importantes

- Les tâches archivées sont en **lecture seule** pour tous les utilisateurs
- Seul un **administrateur** peut modifier le statut des tâches archivées via Firestore
- L'application respecte les **droits d'accès** : chaque utilisateur ne peut modifier que ses propres tâches
- Le **tri automatique** par date de création décroissante est appliqué sur tous les onglets 