# ⚡ Guide de Démarrage Rapide - Hkeya Backend

## 🚀 Installation en 5 minutes

### 1️⃣ Prérequis
- **Node.js** v16+ installé
- **MySQL** v5.7+ ou v8+ installé et démarré
- **npm** ou **yarn**

### 2️⃣ Créer la base de données

Ouvrir MySQL et exécuter :

```sql
CREATE DATABASE hkeya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3️⃣ Installer les dépendances

```bash
cd backend
npm install
```

### 4️⃣ Configurer l'environnement

Copier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Éditer `.env` et modifier le mot de passe MySQL :

```env
DB_PASSWORD=votre_mot_de_passe_mysql
```

### 5️⃣ Initialiser la base de données

```bash
node scripts/seed.js
```

Cela va :
- ✅ Créer les 4 tables (users, topics, posts, interactions)
- ✅ Insérer 4 utilisateurs de test
- ✅ Insérer 4 topics
- ✅ Insérer 4 posts
- ✅ Insérer 5 interactions

### 6️⃣ Démarrer le serveur

```bash
npm run dev
```

Le backend est maintenant accessible sur **http://localhost:4000** 🎉

---

## 🧪 Tester l'API

### Option 1 : Postman

1. Ouvrir Postman
2. Importer `postman_collection.json`
3. Tester les requêtes

### Option 2 : curl

```bash
# 1. Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hkeya.tn","motDePasse":"password123"}'

# Copier le token retourné

# 2. Récupérer les posts
curl -X GET http://localhost:4000/api/posts \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## 👤 Comptes de Test

Après le seed, vous avez 4 comptes :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@hkeya.tn` | `password123` | ADMIN |
| `modo@hkeya.tn` | `password123` | MODERATEUR |
| `yassine@hkeya.tn` | `password123` | CLIENT |
| `amira@hkeya.tn` | `password123` | CLIENT |

---

## 📡 Endpoints Principaux

### Auth
```bash
POST /api/auth/register  # Inscription
POST /api/auth/login     # Connexion
GET  /api/auth/me        # Profil (JWT requis)
```

### Posts
```bash
GET    /api/posts           # Tous les posts validés
POST   /api/posts           # Créer un post
PUT    /api/posts/:id       # Modifier un post
DELETE /api/posts/:id       # Supprimer un post
PATCH  /api/posts/:id/valider  # Valider (Modo/Admin)
```

### Interactions
```bash
POST   /api/interactions    # Like/Dislike/Commentaire/Signalement
DELETE /api/interactions/:id
GET    /api/interactions/signalements  # Modo/Admin
```

### Topics
```bash
GET    /api/topics       # Tous les topics
POST   /api/topics       # Créer (Admin)
PUT    /api/topics/:id   # Modifier (Admin)
DELETE /api/topics/:id   # Supprimer (Admin)
```

### Admin
```bash
GET    /api/admin/users              # Liste users
PATCH  /api/admin/users/:id/role     # Changer rôle
DELETE /api/admin/users/:id          # Supprimer user
DELETE /api/admin/posts/:postId/moderer  # Modérer post
```

---

## 🔐 Authentification

Toutes les routes (sauf register/login) nécessitent un JWT dans le header :

```
Authorization: Bearer <votre_token>
```

---

## 🐛 Problèmes Courants

### ❌ Erreur : "Access denied for user"
→ Vérifier `DB_USER` et `DB_PASSWORD` dans `.env`

### ❌ Erreur : "Unknown database 'hkeya_db'"
→ Créer la base de données avec la commande SQL ci-dessus

### ❌ Erreur : "Cannot find module 'sequelize'"
→ Exécuter `npm install`

### ❌ Port 4000 déjà utilisé
→ Changer `PORT=4001` dans `.env`

---

## 📚 Documentation Complète

- **README.md** → Documentation générale
- **ARCHITECTURE.md** → Architecture technique détaillée
- **postman_collection.json** → Collection Postman

---

## ✅ Checklist de Vérification

- [ ] MySQL installé et démarré
- [ ] Base de données `hkeya_db` créée
- [ ] `.env` configuré avec le bon mot de passe
- [ ] `npm install` exécuté
- [ ] `node scripts/seed.js` exécuté avec succès
- [ ] `npm run dev` démarre sans erreur
- [ ] http://localhost:4000/api/health retourne `{"ok":true}`

---

## 🎯 Prochaines Étapes

1. Tester tous les endpoints avec Postman
2. Connecter le frontend React
3. Personnaliser les topics selon vos besoins
4. Ajouter des utilisateurs réels

---

Bon développement ! 🚀
