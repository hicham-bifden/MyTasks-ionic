# Application de Gestion de Tâches (Ionic + Vue.js)

## Présentation du projet

Ce projet est une application web de gestion de tâches réalisée avec **Ionic** et **Vue.js**. Elle permet à chaque utilisateur de :
- S'inscrire et se connecter à un compte personnel
- Créer, modifier, supprimer ses propres tâches
- Consulter les tâches des autres utilisateurs (lecture seule)
- Voir toutes les tâches archivées (terminées)

L'application utilise une API REST fournie par l'enseignant pour la gestion des utilisateurs et des tâches.

---

## Fonctionnalités principales

- **Inscription** : Création d'un compte avec prénom, nom, email, mot de passe
- **Connexion** : Accès sécurisé à l'application
- **Onglets de navigation** :
  - **Mes tâches** : Voir, ajouter, modifier, supprimer ses propres tâches actives
  - **Autres** : Voir les tâches actives des autres utilisateurs (lecture seule)
  - **Archivées** : Voir toutes les tâches terminées (lecture seule)
- **Déconnexion** : Quitter la session en toute sécurité

---

## Structure du projet

```
MyTasks-ionic/
│
├── src/
│   ├── components/         # Composants réutilisables (TaskItem.vue)
│   ├── models/             # Modèles de données (User.js, Task.js)
│   ├── services/           # Appels API (api.js)
│   ├── store/              # Gestion de l'état global (state.js)
│   ├── views/              # Pages principales (Login, Register, Tabs, etc.)
│   └── router/             # Configuration des routes
│
├── package.json            # Dépendances du projet
└── README.md               # Ce fichier
```

---

## Explication du code (débutant)

- **Composants Vue** : Chaque page ou élément réutilisable est un fichier `.vue` (template + script + style).
- **API** : Les appels à l'API sont centralisés dans `src/services/api.js` avec Axios.
- **État global** : L'utilisateur connecté et la liste des tâches sont stockés dans `src/store/state.js` (reactive Vue).
- **Navigation** : Les routes sont définies dans `src/router/index.ts`.
- **Commentaires** : Chaque fichier important est commenté pour expliquer chaque étape.

---

## Fonctionnement des pages

### 1. Connexion / Inscription
- **LoginPage.vue** : Formulaire de connexion, vérification des champs, appel API, redirection vers les onglets.
- **RegisterPage.vue** : Formulaire d'inscription, validation, appel API, message de succès ou d'erreur.

### 2. Onglets (Tabs)
- **TabsPage.vue** : Barre de navigation en bas avec 3 onglets : Mes tâches, Autres, Archivées.

### 3. Mes tâches (Tab1Page.vue)
- Affiche les tâches actives de l'utilisateur connecté.
- Permet d'ajouter, modifier, supprimer une tâche.
- Utilise le composant `TaskItem.vue` pour chaque tâche.
- Formulaires simples et modaux pour l'ajout/modification.

### 4. Autres (Tab2Page.vue)
- Affiche les tâches actives des autres utilisateurs (lecture seule).
- Affiche le nom et prénom du propriétaire de chaque tâche.

### 5. Archivées (Tab3Page.vue)
- Affiche toutes les tâches terminées (isDone = true), pour tous les utilisateurs.
- Lecture seule, affiche le propriétaire.

### 6. Déconnexion
- Bouton dans la barre du haut de "Mes tâches" pour se déconnecter et revenir à la page de connexion.

---

## Lancement du projet

1. **Installer les dépendances**
   ```bash
   npm install
   ```
2. **Lancer le serveur de développement**
   ```bash
   ionic serve
   ```
3. **Ouvrir le navigateur** à l'adresse indiquée (généralement http://localhost:8100)

---

## Conseils pour débutant
- Lis les commentaires dans chaque fichier pour comprendre chaque étape.
- Le code est volontairement simple, sans logique complexe.
- N'hésite pas à modifier les styles ou les textes pour personnaliser l'application.

---

## Auteur
Projet réalisé pour le cours **Applications web multiplateformes** (420-726-AH) – Enseignant : Khalil Loghlam

---

## API utilisée
- Base URL : https://server-1-t93s.onrender.com
- Documentation complète dans l'énoncé du projet (routes : /signup, /login, /add-task, /get-tasks/:userId, /update-task, /remove-task) 