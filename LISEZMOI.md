# 🎯 Hkeya - Plateforme Sociale Tunisienne

## ✅ Backend Professionnel Généré avec Succès !

Votre backend Node.js + Express + MySQL + Sequelize est **100% complet** et prêt à l'emploi.

---

## 📂 Structure du Projet

```
projet/
├── frontend/              # Application React (existante)
├── backend/               # ✨ API REST Node.js (NOUVEAU)
│   ├── config/           # Configuration Sequelize
│   ├── models/           # User, Topic, Post, Interaction
│   ├── controllers/      # Logique des routes
│   ├── services/         # Logique métier
│   ├── routes/           # Endpoints API
│   ├── middlewares/      # Auth, validation, erreurs
│   ├── scripts/          # Seed & sync DB
│   ├── uploads/          # Images uploadées
│   ├── .env              # Variables d'environnement
│   ├── server.js         # Point d'entrée
│   ├── README.md         # Documentation complète
│   ├── ARCHITECTURE.md   # Architecture technique
│   ├── QUICKSTART.md     # Guide démarrage rapide
│   ├── INSTRUCTIONS_FINALES.md  # Instructions finales
│   └── postman_collection.json  # Tests API
└── LISEZMOI.md           # Ce fichier
```

---

## 🚀 Démarrage Rapide (5 minutes)

### 1️⃣ Créer la Base de Données MySQL

```bash
mysql -u root -p
```

```sql
CREATE DATABASE hkeya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 2️⃣ Configurer l'Environnement

Éditer `backend/.env` et mettre votre mot de passe MySQL :

```env
DB_PASSWORD=votre_mot_de_passe_mysql
```

### 3️⃣ Installer et Initialiser

```bash
cd backend
npm install
node scripts/seed.js
```

### 4️⃣ Démarrer le Backend

```bash
npm run dev
```

✅ Backend disponible sur **http://localhost:4000**

### 5️⃣ Tester

Ouvrir dans le navigateur : http://localhost:4000/api/health

Devrait retourner :
```json
{"ok":true,"service":"hkeya-backend","timestamp":"..."}
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

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil (JWT requis)

### Posts
- `GET /api/posts` - Tous les posts validés
- `POST /api/posts` - Créer un post
- `PUT /api/posts/:id` - Modifier
- `DELETE /api/posts/:id` - Supprimer
- `PATCH /api/posts/:id/valider` - Valider (Modo/Admin)

### Interactions
- `POST /api/interactions` - Like/Dislike/Commentaire/Signalement
- `DELETE /api/interactions/:id` - Supprimer
- `GET /api/interactions/signalements` - Voir signalements (Modo/Admin)

### Topics
- `GET /api/topics` - Tous les topics
- `POST /api/topics` - Créer (Admin)
- `PUT /api/topics/:id` - Modifier (Admin)
- `DELETE /api/topics/:id` - Supprimer (Admin)

### Admin
- `GET /api/admin/users` - Liste utilisateurs
- `PATCH /api/admin/users/:id/role` - Changer rôle
- `DELETE /api/admin/users/:id` - Supprimer utilisateur
- `DELETE /api/admin/posts/:postId/moderer` - Modérer post

---

## 🧪 Tester l'API

### Avec Postman

1. Ouvrir Postman
2. Importer `backend/postman_collection.json`
3. Tester les requêtes

### Avec curl

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hkeya.tn","motDePasse":"password123"}'

# Copier le token retourné

# Get posts
curl -X GET http://localhost:4000/api/posts \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 📚 Documentation Complète

Toute la documentation est dans le dossier `backend/` :

- **README.md** → Documentation générale complète
- **ARCHITECTURE.md** → Architecture technique détaillée
- **QUICKSTART.md** → Guide de démarrage rapide
- **INSTRUCTIONS_FINALES.md** → Instructions finales et checklist
- **postman_collection.json** → Collection Postman pour tester

---

## 🗄️ Base de Données

### 4 Tables Créées Automatiquement

1. **users** - Utilisateurs (nom, email, pseudo, rôle, etc.)
2. **topics** - Catégories de posts (Études, Technologie, Santé, Loi)
3. **posts** - Publications (texte, image, statut de validation)
4. **interactions** - Likes, dislikes, commentaires, signalements

### Relations
- User → Posts (1:N, CASCADE)
- Topic → Posts (1:N, RESTRICT)
- User → Interactions (1:N, CASCADE)
- Post → Interactions (1:N, CASCADE)

---

## 🔐 Sécurité

✅ Mots de passe hashés avec **bcrypt** (12 rounds)  
✅ Authentification **JWT** avec expiration  
✅ Validation des données avec **express-validator**  
✅ Protection **CORS**  
✅ Gestion centralisée des erreurs  
✅ Middleware d'autorisation par **rôle**  

---

## 🎯 Fonctionnalités Implémentées

### ✅ Authentification
- Inscription avec validation
- Connexion avec JWT
- Récupération du profil
- Hashage sécurisé des mots de passe

### ✅ Posts
- Création (texte + image optionnelle)
- Modification
- Suppression
- Validation par modérateurs
- Association avec topics

### ✅ Interactions
- Like/Dislike (1 par user/post)
- Commentaires
- Signalements avec raison
- Calcul dynamique des compteurs

### ✅ Topics
- CRUD complet (Admin uniquement)

### ✅ Administration
- Gestion des utilisateurs
- Changement de rôles
- Suppression d'utilisateurs
- Modération de posts signalés

---

## 🚀 Connecter le Frontend

Le frontend React est déjà configuré pour `http://localhost:4000`.

Démarrer le frontend :
```bash
cd frontend
npm install
npm run dev
```

Frontend disponible sur **http://localhost:5173**

---

## 📦 Technologies Utilisées

### Backend
- **Node.js** + **Express.js**
- **MySQL** + **Sequelize ORM**
- **JWT** (jsonwebtoken)
- **bcryptjs** (hashage)
- **express-validator** (validation)
- **multer** (upload)
- **dotenv** (env vars)
- **cors**

### Frontend
- **React 18** + **Vite**
- Design immersif (dark blue/gold)

---

## 🐛 Problèmes Courants

### ❌ "Access denied for user"
→ Vérifier `DB_PASSWORD` dans `backend/.env`

### ❌ "Unknown database 'hkeya_db'"
→ Créer la base avec la commande SQL ci-dessus

### ❌ "Cannot find module 'sequelize'"
→ Exécuter `npm install` dans `backend/`

### ❌ Port 4000 déjà utilisé
→ Changer `PORT=4001` dans `backend/.env`

---

## ✅ Checklist de Vérification

- [ ] MySQL installé et démarré
- [ ] Base de données `hkeya_db` créée
- [ ] `backend/.env` configuré avec le bon mot de passe
- [ ] `npm install` exécuté dans `backend/`
- [ ] `node scripts/seed.js` exécuté avec succès
- [ ] `npm run dev` démarre sans erreur
- [ ] http://localhost:4000/api/health retourne `{"ok":true}`
- [ ] Login avec Postman fonctionne
- [ ] GET /api/posts retourne les posts

---

## 📞 Support

Pour toute question :
- Consulter `backend/README.md`
- Consulter `backend/ARCHITECTURE.md`
- Tester avec `backend/postman_collection.json`

---

## 🎉 Résumé

Vous avez maintenant :

✅ **Backend REST API professionnel** avec architecture MVC  
✅ **Authentification JWT** sécurisée  
✅ **Base de données MySQL** avec Sequelize ORM  
✅ **Validation des données** et gestion des erreurs  
✅ **Upload d'images** avec multer  
✅ **Système de rôles** (CLIENT, MODERATEUR, ADMIN)  
✅ **Modération de contenu** complète  
✅ **Documentation complète** et collection Postman  
✅ **Scripts de seed** pour données de test  

**Le backend est 100% fonctionnel et prêt à être utilisé !** 🚀

---

## 📄 Licence

Projet éducatif - Hkeya © 2026  
Fait avec ❤️ en Tunisie
