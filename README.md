# MyContacts

Application web complète de gestion de contacts avec authentification sécurisée.

## Présentation
Ce projet est composé d’un backend Node.js (Express, MongoDB, JWT) et d’un frontend React. Il permet à un utilisateur de s’inscrire, se connecter, puis gérer ses contacts (ajout, modification, suppression, affichage). Toutes les opérations sont sécurisées et testées.

## Architecture
- **Backend** : Express, MongoDB, JWT, organisation MVC, tests Jest, documentation Swagger
- **Frontend** : React, React Router, appels API sécurisés
- **Sécurité** : Authentification JWT, middleware de protection des routes
- **Tests** : Jest (backend)

---

## Installation

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## Endpoints API

### Authentification
- `POST /auth/register` : Inscription
  - Payload : `{ "email": "user@email.com", "password": "motdepasse123" }`
- `POST /auth/login` : Connexion
  - Payload : `{ "email": "user@email.com", "password": "motdepasse123" }`

### Contacts (authentification requise)
- `GET /contacts` : Liste des contacts
- `POST /contacts` : Ajouter un contact
  - Payload : `{ "firstName": "Jean", "lastName": "Dupont", "phone": "0612345678" }`
- `GET /contacts/{id}` : Récupérer un contact
- `PATCH /contacts/{id}` : Modifier un contact
  - Payload : `{ "firstName": "Jean", "lastName": "Dupont", "phone": "0612345678" }`
- `DELETE /contacts/{id}` : Supprimer un contact

Voir la documentation complète sur `/api-docs` (Swagger).

---

## Identifiants de test
- Email : `jest@test.com`
- Mot de passe : `jestpass123`

---

## Documentation Swagger
Accessible sur : `http://localhost:5000/api-docs`

---

## Déploiement
- Backend : [Lien à compléter]
- Frontend : [Lien à compléter]

---

## Repo Git
- [Lien à compléter]

---

## Scripts utiles
- `npm test` (backend) : Lancer les tests Jest
- `npm start` : Démarrer le serveur

---

## Livrables attendus
- Application déployée (backend + frontend)
- Documentation Swagger finalisée
- README complet
- Tests unitaires Jest
- Lien du repo Git, URL frontend et backend à transmettre


