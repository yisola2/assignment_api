# API Assignments - Backend

## Description
API REST pour la gestion des devoirs (assignments) développée dans le cadre du projetWeb M1 Informatique. Cette API permet de créer, modifier, supprimer et consulter des devoirs avec un système d'authentification et de pagination.

Yassin Es Saim - Malik Moussa

## Fonctionnalités
- CRUD complet pour les assignments
- Authentification utilisateur (login/password) 
- Gestion des rôles (user/admin)
- Pagination des résultats
- Base de données MongoDB avec plus de 1000 assignments
- Middleware de sécurité pour les routes admin

## Technologies utilisées
- **Node.js** avec Express
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **Bcrypt** pour le hachage des mots de passe

## Structure du projet
```
├── server.js              # Point d'entrée de l'application
├── model/
│   ├── assignment.js       # Modèle Mongoose des assignments
│   └── User.js            # Modèle Mongoose des utilisateurs
├── routes/
│   ├── assignments.js      # Routes CRUD assignments
│   └── auth.js            # Routes d'authentification
├── middleware/
│   ├── auth.js            # Middleware d'authentification
│   └── adminAuth.js       # Middleware admin
├── tests/
│   └── assignments.test.js # Tests des endpoints
├── data.json              # Données de test (1000+ assignments)
└── populate.js            # Script de peuplement de la DB
```

## Installation et lancement

### Prérequis
- Node.js (version 14+)
- MongoDB Atlas (base de données cloud)

### Installation
```bash
# Cloner le repo
git clone <https://github.com/yisola2/assignment_api.git>
cd api

# Installer les dépendances
npm install

# Peupler la base avec des données de test
node populate.js
```

### Lancement
```bash
# Mode développement
npm start

```

L'API sera accessible sur `http://localhost:8010`

## Modèle de données

### Assignment
```javascript
{
  id: Number,
  name: String,
  dueDate: Date,          // Date de rendu
  postedOn: Date,         // Date de création
  submittedOn: Date,      // Date de soumission
  submitted: Boolean,     // Rendu ou non
  auteur: {
    nom: String,
    photo: String
  },
  matiere: {
    nom: String,
    image: String,
    prof: {
      nom: String,
      photo: String
    }
  },
  note: Number,           // Note sur 20
  remarques: String
}
```

### User
```javascript
{
  username: String,
  password: String,       // Hashé avec bcrypt
  role: String           // 'user' ou 'admin'
}
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Assignments
- `GET /api/assignments` - Liste paginée des assignments
- `GET /api/assignments/:id` - Assignment par ID
- `POST /api/assignments` - Créer un assignment 
- `PUT /api/assignments/:id` - Modifier un assignment (admin)
- `DELETE /api/assignments/:id` - Supprimer un assignment (admin)

### Paramètres de pagination
- `?page=1` - Numéro de page
- `?limit=10` - Nombre d'éléments par page

## Variables d'environnement
La connexion MongoDB est configurée directement dans le code avec MongoDB Atlas.

## Déploiement
Le projet est configuré pour être déployé sur Render.com avec le script `npm run build`.
