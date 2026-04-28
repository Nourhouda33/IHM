# 🎯 Hkeya - Plateforme Sociale Complète

## 📌 Vue d'Ensemble

**Hkeya** est une plateforme sociale tunisienne permettant l'expression anonyme avec modération.

### Stack Technique

**Frontend :**
- React 18 + Vite
- Design immersif (dark blue/gold theme)
- Animations canvas (particules)
- Responsive

**Backend :**
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT (authentification)
- bcryptjs (sécurité)
- Architecture MVC professionnelle

---

## 📂 Structure du Projet

```
projet/
├── frontend/                    # Application React
│   ├── src/
│   │   ├── App.jsx
│   │   ├── HkeyaImmersive.jsx  # Composant principal
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # API REST Node.js
│   ├── config/
│   │   └── database.js         # Config Sequelize
│   ├── models/
│   │   ├── User.js
│   │   ├── Topic.js
│   │   ├── Post.js
│   │   ├── Interaction.js
│   │   └── index.js            # Associations
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   ├── interaction.controller.js
│   │   ├── topic.controller.js
│   │   └── admin.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── post.service.js
│   │   ├── interaction.service.js
│   │   ├── topic.service.js
│   │   └── admin.service.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   ├── interaction.routes.js
│   │   ├── topic.routes.js
│   │   └── admin.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── scripts/
│   │   ├── syncDb.js           # Sync tables
│   │   └── seed.js             # Données de test
│   ├── uploads/                # Images uploadées
│   ├── .env                    # Variables d'environnement
│   ├── .env.example
│   ├── server.js               # Point d'entrée
│   ├── package.json
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── QUICKSTART.md
│   └── postman_collection.json
│
└── PROJET_COMPLET.md           # Ce fichier
```

---

## 🗄️ Base de Données MySQL

### Tables

#### 1. **users**
```sql
- id (PK)
- nom, prenom
- email (unique)
- telephone (nullable)
- motDePasse (hashé bcrypt)
- pseudo (unique)
- avatar (nullable)
- veut_etre_moderateur (boolean)
- role (ENUM: CLIENT, MODERATEUR, ADMIN)
- created_at, updated_at
```

#### 2. **topics**
```sql
- id (PK)
- nom (unique)
- description (nullable)
- created_at, updated_at
```

#### 3. **posts**
```sql
- id (PK)
- user_id (FK → users.id)
- topic_id (FK → topics.id)
- texte (nullable)
- image (nullable)
- dateCreation
- statut (boolean: false = en attente, true = validé)
- created_at, updated_at
```

#### 4. **interactions**
```sql
- id (PK)
- user_id (FK → users.id)
- post_id (FK → posts.id)
- type (ENUM: LIKE, DISLIKE, COMMENTAIRE, SIGNALEMENT)
- contenu (nullable, pour COMMENTAIRE)
- raison (nullable, pour SIGNALEMENT)
- created_at
```

### Relations
- User → Posts (1:N, CASCADE)
- Topic → Posts (1:N, RESTRICT)
- User → Interactions (1:N, CASCADE)
- Post → Interactions (1:N, CASCADE)

---

## 🔐 Authentification & Autorisation

### Rôles

| Rôle | Permissions |
|------|-------------|
| **CLIENT** | Créer posts, liker, commenter, signaler |
| **MODERATEUR** | + Valider posts, voir signalements |
| **ADMIN** | + Gérer users, topics, changer rôles |

### JWT
- Token généré à l'inscription/connexion
- Stocké dans `localStorage` côté frontend
- Envoyé dans header `Authorization: Bearer <token>`
- Expire après 7 jours (configurable)

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/register    # Inscription
POST   /api/auth/login       # Connexion
GET    /api/auth/me          # Profil utilisateur
```

### Posts
```
GET    /api/posts            # Tous les posts validés
POST   /api/posts            # Créer un post
PUT    /api/posts/:id        # Modifier un post
DELETE /api/posts/:id        # Supprimer un post
PATCH  /api/posts/:id/valider  # Valider (Modo/Admin)
```

### Interactions
```
POST   /api/interactions     # Ajouter LIKE/DISLIKE/COMMENTAIRE/SIGNALEMENT
DELETE /api/interactions/:id # Supprimer une interaction
GET    /api/interactions/signalements  # Voir signalements (Modo/Admin)
```

### Topics
```
GET    /api/topics           # Tous les topics
POST   /api/topics           # Créer (Admin)
PUT    /api/topics/:id       # Modifier (Admin)
DELETE /api/topics/:id       # Supprimer (Admin)
```

### Admin
```
GET    /api/admin/users              # Liste utilisateurs
PATCH  /api/admin/users/:id/role     # Changer rôle
DELETE /api/admin/users/:id          # Supprimer utilisateur
DELETE /api/admin/posts/:postId/moderer  # Modérer post
```

---

## 🚀 Installation & Démarrage

### 1. Backend

```bash
# Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE hkeya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Installer et configurer
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos credentials MySQL

# Initialiser avec données de test
node scripts/seed.js

# Démarrer le serveur
npm run dev
```

Backend disponible sur **http://localhost:4000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible sur **http://localhost:5173**

---

## 🧪 Comptes de Test

Après le seed :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@hkeya.tn` | `password123` | ADMIN |
| `modo@hkeya.tn` | `password123` | MODERATEUR |
| `yassine@hkeya.tn` | `password123` | CLIENT |
| `amira@hkeya.tn` | `password123` | CLIENT |

---

## 📌 Règles Métier

### Modération des Posts
1. Un post créé a `statut = false` (en attente)
2. Seuls MODERATEUR et ADMIN peuvent valider
3. Les posts validés (`statut = true`) apparaissent dans le feed

### Interactions
- Un user ne peut mettre qu'**un seul LIKE ou DISLIKE** par post
- Les COMMENTAIRE nécessitent un `contenu`
- Les SIGNALEMENT nécessitent une `raison`

### Suppression en Cascade
- User supprimé → tous ses posts et interactions supprimés
- Post supprimé → toutes ses interactions supprimées
- Post modéré avec `deleteAuthor: true` → auteur + tous ses posts supprimés

---

## 🛡️ Sécurité

✅ Mots de passe hashés avec **bcrypt** (12 rounds)  
✅ JWT avec expiration configurable  
✅ Validation des données avec **express-validator**  
✅ Protection CORS  
✅ Gestion centralisée des erreurs  
✅ Middleware d'autorisation par rôle  

---

## 📦 Technologies Utilisées

### Backend
- **express** - Framework web
- **sequelize** - ORM MySQL
- **mysql2** - Driver MySQL
- **bcryptjs** - Hashage mots de passe
- **jsonwebtoken** - Authentification JWT
- **express-validator** - Validation données
- **multer** - Upload fichiers
- **dotenv** - Variables d'environnement
- **cors** - Cross-Origin Resource Sharing

### Frontend
- **react** - Bibliothèque UI
- **vite** - Build tool
- Canvas API pour animations

---

## 📚 Documentation

- **backend/README.md** - Documentation complète du backend
- **backend/ARCHITECTURE.md** - Architecture technique détaillée
- **backend/QUICKSTART.md** - Guide de démarrage rapide
- **backend/postman_collection.json** - Collection Postman pour tester l'API

---

## 🎯 Fonctionnalités Implémentées

### ✅ Authentification
- [x] Inscription avec validation
- [x] Connexion avec JWT
- [x] Récupération du profil
- [x] Hashage sécurisé des mots de passe

### ✅ Posts
- [x] Création de posts (texte + image optionnelle)
- [x] Modification de posts
- [x] Suppression de posts
- [x] Validation par modérateurs
- [x] Filtrage par statut (validé/en attente)
- [x] Association avec topics

### ✅ Interactions
- [x] Like/Dislike (1 par user/post)
- [x] Commentaires
- [x] Signalements avec raison
- [x] Suppression d'interactions
- [x] Calcul dynamique des compteurs

### ✅ Topics
- [x] CRUD complet (Admin uniquement)
- [x] Association avec posts

### ✅ Administration
- [x] Gestion des utilisateurs
- [x] Changement de rôles
- [x] Suppression d'utilisateurs
- [x] Modération de posts signalés
- [x] Option de suppression de l'auteur

### ✅ Sécurité
- [x] JWT avec expiration
- [x] Middleware d'authentification
- [x] Middleware d'autorisation par rôle
- [x] Validation des données
- [x] Gestion des erreurs
- [x] CORS configuré

---

## 🔮 Améliorations Futures

- [ ] Pagination des posts
- [ ] Recherche full-text
- [ ] Notifications en temps réel (WebSocket)
- [ ] Rate limiting
- [ ] Compression des réponses
- [ ] Logs structurés (winston)
- [ ] Tests unitaires (Jest)
- [ ] CI/CD (GitHub Actions)
- [ ] Docker + docker-compose
- [ ] Migrations Sequelize
- [ ] Cache Redis

---

## 📞 Support

Pour toute question : **admin@hkeya.tn**

---

## 📄 Licence

Projet éducatif - Hkeya © 2026  
Fait avec ❤️ en Tunisie
