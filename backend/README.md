# 🚀 Hkeya Backend - API REST Professionnelle

Backend Node.js + Express + MySQL + Sequelize pour la plateforme sociale **Hkeya**.

---

## 📌 Stack Technique

- **Node.js** + **Express.js**
- **MySQL** (base de données)
- **Sequelize ORM** (gestion des modèles)
- **JWT** (authentification)
- **bcryptjs** (hashage des mots de passe)
- **express-validator** (validation des données)
- **multer** (upload d'images)
- **dotenv** (variables d'environnement)
- Architecture **MVC** (Models / Controllers / Services / Routes)

---

## 📂 Structure du Projet

```
backend/
├── config/
│   └── database.js          # Configuration Sequelize
├── models/
│   ├── User.js              # Modèle utilisateur
│   ├── Topic.js             # Modèle topic
│   ├── Post.js              # Modèle post
│   ├── Interaction.js       # Modèle interaction
│   └── index.js             # Associations
├── controllers/
│   ├── auth.controller.js
│   ├── post.controller.js
│   ├── interaction.controller.js
│   ├── topic.controller.js
│   └── admin.controller.js
├── services/
│   ├── auth.service.js
│   ├── post.service.js
│   ├── interaction.service.js
│   ├── topic.service.js
│   └── admin.service.js
├── routes/
│   ├── auth.routes.js
│   ├── post.routes.js
│   ├── interaction.routes.js
│   ├── topic.routes.js
│   └── admin.routes.js
├── middlewares/
│   ├── auth.middleware.js   # JWT + autorisation
│   ├── error.middleware.js  # Gestion erreurs
│   └── validate.middleware.js
├── scripts/
│   ├── syncDb.js            # Sync tables
│   └── seed.js              # Données de test
├── uploads/                 # Images uploadées
├── .env                     # Variables d'environnement
├── .env.example
├── server.js                # Point d'entrée
├── package.json
└── postman_collection.json  # Collection Postman
```

---

## ⚙️ Installation

### 1. Cloner et installer les dépendances

```bash
cd backend
npm install
```

### 2. Configurer la base de données MySQL

Créer une base de données MySQL :

```sql
CREATE DATABASE hkeya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurer les variables d'environnement

Copier `.env.example` vers `.env` et modifier :

```bash
cp .env.example .env
```

Éditer `.env` :

```env
PORT=4000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=hkeya_db
DB_USER=root
DB_PASSWORD=votre_mot_de_passe

JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

### 4. Synchroniser les tables

```bash
npm run db:sync
```

Cela crée automatiquement les 4 tables : `users`, `topics`, `posts`, `interactions`.

### 5. (Optionnel) Insérer des données de test

```bash
node scripts/seed.js
```

---

## 🚀 Démarrage

### Mode développement (avec nodemon)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

Le serveur démarre sur **http://localhost:4000**

---

## 📌 Base de Données

### Tables

#### 1️⃣ **users**
- `id` (PK)
- `nom`, `prenom`, `email` (unique), `telephone`
- `motDePasse` (hashé avec bcrypt)
- `pseudo` (unique)
- `avatar` (URL ou nom fichier)
- `veut_etre_moderateur` (boolean)
- `role` (ENUM: CLIENT, MODERATEUR, ADMIN)
- `created_at`, `updated_at`

#### 2️⃣ **topics**
- `id` (PK)
- `nom` (unique)
- `description`
- `created_at`, `updated_at`

#### 3️⃣ **posts**
- `id` (PK)
- `user_id` (FK → users)
- `topic_id` (FK → topics)
- `texte`, `image`
- `dateCreation`
- `statut` (boolean: false = en attente, true = validé)
- `created_at`, `updated_at`

#### 4️⃣ **interactions**
- `id` (PK)
- `user_id` (FK → users)
- `post_id` (FK → posts)
- `type` (ENUM: LIKE, DISLIKE, COMMENTAIRE, SIGNALEMENT)
- `contenu` (pour COMMENTAIRE)
- `raison` (pour SIGNALEMENT)
- `created_at`

---

## 🔐 Authentification

Toutes les routes (sauf `/api/auth/register` et `/api/auth/login`) nécessitent un **JWT**.

### Header requis :

```
Authorization: Bearer <votre_token_jwt>
```

---

## 📡 API Endpoints

### 🔑 **Auth**

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Profil utilisateur (JWT requis) |

### 📝 **Posts**

| Méthode | Route | Description | Rôle requis |
|---------|-------|-------------|-------------|
| GET | `/api/posts` | Tous les posts validés | Authentifié |
| POST | `/api/posts` | Créer un post | Authentifié |
| PUT | `/api/posts/:id` | Modifier un post | Auteur ou Modo/Admin |
| DELETE | `/api/posts/:id` | Supprimer un post | Auteur ou Modo/Admin |
| PATCH | `/api/posts/:id/valider` | Valider un post | MODERATEUR ou ADMIN |

### 🔄 **Interactions**

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/interactions` | Ajouter LIKE/DISLIKE/COMMENTAIRE/SIGNALEMENT |
| DELETE | `/api/interactions/:id` | Supprimer une interaction |
| GET | `/api/interactions/signalements` | Voir signalements (Modo/Admin) |

### 🏷️ **Topics**

| Méthode | Route | Description | Rôle requis |
|---------|-------|-------------|-------------|
| GET | `/api/topics` | Tous les topics | Authentifié |
| POST | `/api/topics` | Créer un topic | ADMIN |
| PUT | `/api/topics/:id` | Modifier un topic | ADMIN |
| DELETE | `/api/topics/:id` | Supprimer un topic | ADMIN |

### 👑 **Admin**

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/admin/users` | Liste des utilisateurs |
| PATCH | `/api/admin/users/:id/role` | Changer le rôle |
| DELETE | `/api/admin/users/:id` | Supprimer un utilisateur |
| DELETE | `/api/admin/posts/:postId/moderer` | Modérer un post (+ option supprimer auteur) |

---

## 📌 Règles Métier

### Modération
- Un post créé a `statut = false` (en attente)
- Seuls les **MODERATEUR** ou **ADMIN** peuvent valider (`statut = true`)
- Les posts validés apparaissent dans le feed

### Interactions
- Un utilisateur ne peut mettre qu'**un seul LIKE ou DISLIKE** par post
- Les **COMMENTAIRE** nécessitent un `contenu`
- Les **SIGNALEMENT** nécessitent une `raison`

### Suppression en cascade
- Si un **utilisateur** est supprimé → tous ses **posts** et **interactions** sont supprimés
- Si un **post** est supprimé → toutes ses **interactions** sont supprimées
- Si un **post signalé** est modéré avec `deleteAuthor: true` → l'auteur ET tous ses posts sont supprimés

---

## 🧪 Tester l'API

### Avec Postman

Importer le fichier `postman_collection.json` dans Postman.

### Avec curl

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Doe","prenom":"John","email":"john@hkeya.tn","pseudo":"JohnD","motDePasse":"secret123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@hkeya.tn","motDePasse":"secret123"}'

# Get posts (avec token)
curl -X GET http://localhost:4000/api/posts \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 🛡️ Sécurité

- ✅ Mots de passe hashés avec **bcrypt** (12 rounds)
- ✅ JWT avec expiration configurable
- ✅ Validation des données avec **express-validator**
- ✅ Protection CORS
- ✅ Gestion des erreurs centralisée
- ✅ Middleware d'autorisation par rôle

---

## 📦 Scripts npm

```bash
npm start          # Démarrer le serveur
npm run dev        # Mode développement (nodemon)
npm run db:sync    # Synchroniser les tables
```

---

## 🐛 Dépannage

### Erreur de connexion MySQL

Vérifier que MySQL est démarré et que les credentials dans `.env` sont corrects.

### Tables non créées

Exécuter `npm run db:sync` ou démarrer le serveur en mode dev (sync automatique).

### Token invalide

Vérifier que le `JWT_SECRET` dans `.env` est identique entre les requêtes.

---

## 📄 Licence

Projet éducatif - Hkeya © 2026
