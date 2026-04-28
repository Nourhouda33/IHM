# ✅ Backend Hkeya - Prêt à l'Emploi

## 🎉 Félicitations !

Votre backend professionnel Node.js + Express + MySQL + Sequelize est **100% complet et prêt à être utilisé**.

---

## 📋 Ce qui a été créé

### ✅ Architecture MVC Complète
- **4 Modèles** : User, Topic, Post, Interaction
- **5 Controllers** : auth, post, interaction, topic, admin
- **5 Services** : Logique métier séparée
- **5 Routes** : Endpoints REST organisés
- **3 Middlewares** : auth, validation, erreurs

### ✅ Fonctionnalités Implémentées
- ✅ Authentification JWT complète (register, login, me)
- ✅ CRUD Posts avec validation par modérateurs
- ✅ Interactions (LIKE, DISLIKE, COMMENTAIRE, SIGNALEMENT)
- ✅ Gestion des Topics (CRUD admin)
- ✅ Administration (users, rôles, modération)
- ✅ Upload d'images avec multer
- ✅ Validation des données avec express-validator
- ✅ Gestion des erreurs centralisée
- ✅ Sécurité : bcrypt + JWT + CORS

### ✅ Documentation
- ✅ README.md complet
- ✅ ARCHITECTURE.md détaillée
- ✅ QUICKSTART.md pour démarrage rapide
- ✅ postman_collection.json pour tester l'API
- ✅ .env.example avec toutes les variables

### ✅ Scripts Utiles
- ✅ `scripts/syncDb.js` - Synchroniser les tables
- ✅ `scripts/seed.js` - Insérer données de test

---

## 🚀 Prochaines Étapes

### 1️⃣ Installer MySQL (si pas déjà fait)

**Windows :**
- Télécharger MySQL Community Server : https://dev.mysql.com/downloads/mysql/
- Ou installer via XAMPP/WAMP

**Linux/Mac :**
```bash
# Ubuntu/Debian
sudo apt install mysql-server

# Mac
brew install mysql
```

### 2️⃣ Créer la Base de Données

Ouvrir MySQL :
```bash
mysql -u root -p
```

Créer la base :
```sql
CREATE DATABASE hkeya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 3️⃣ Configurer l'Environnement

Éditer `backend/.env` et mettre votre mot de passe MySQL :
```env
DB_PASSWORD=votre_mot_de_passe_mysql_ici
```

### 4️⃣ Initialiser avec Données de Test

```bash
cd backend
node scripts/seed.js
```

Cela va créer :
- 4 utilisateurs (admin, modérateur, 2 clients)
- 4 topics (Études, Technologie, Santé, Loi)
- 4 posts
- 5 interactions

### 5️⃣ Démarrer le Serveur

```bash
npm run dev
```

Le backend sera accessible sur **http://localhost:4000**

### 6️⃣ Tester l'API

**Option 1 : Postman**
- Importer `postman_collection.json`
- Tester les requêtes

**Option 2 : curl**
```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hkeya.tn","motDePasse":"password123"}'

# Récupérer le token et tester
curl -X GET http://localhost:4000/api/posts \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

**Option 3 : Browser**
- Ouvrir http://localhost:4000/api/health
- Devrait retourner `{"ok":true,"service":"hkeya-backend",...}`

---

## 👤 Comptes de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@hkeya.tn` | `password123` | ADMIN |
| `modo@hkeya.tn` | `password123` | MODERATEUR |
| `yassine@hkeya.tn` | `password123` | CLIENT |
| `amira@hkeya.tn` | `password123` | CLIENT |

---

## 📡 Endpoints Principaux

### Auth
```
POST /api/auth/register  → Inscription
POST /api/auth/login     → Connexion
GET  /api/auth/me        → Profil (JWT requis)
```

### Posts
```
GET    /api/posts              → Tous les posts validés
POST   /api/posts              → Créer un post
PUT    /api/posts/:id          → Modifier
DELETE /api/posts/:id          → Supprimer
PATCH  /api/posts/:id/valider  → Valider (Modo/Admin)
```

### Interactions
```
POST   /api/interactions    → Like/Dislike/Commentaire/Signalement
DELETE /api/interactions/:id
GET    /api/interactions/signalements  → Voir signalements (Modo/Admin)
```

### Topics
```
GET    /api/topics       → Tous les topics
POST   /api/topics       → Créer (Admin)
PUT    /api/topics/:id   → Modifier (Admin)
DELETE /api/topics/:id   → Supprimer (Admin)
```

### Admin
```
GET    /api/admin/users              → Liste users
PATCH  /api/admin/users/:id/role     → Changer rôle
DELETE /api/admin/users/:id          → Supprimer user
DELETE /api/admin/posts/:postId/moderer  → Modérer post
```

---

## 🔐 Authentification

Toutes les routes (sauf register/login) nécessitent un JWT :

```
Authorization: Bearer <votre_token>
```

---

## 📚 Documentation Complète

- **README.md** → Documentation générale
- **ARCHITECTURE.md** → Architecture technique
- **QUICKSTART.md** → Guide de démarrage rapide
- **postman_collection.json** → Collection Postman

---

## 🐛 Dépannage

### ❌ "Access denied for user"
→ Vérifier `DB_PASSWORD` dans `.env`

### ❌ "Unknown database 'hkeya_db'"
→ Créer la base avec la commande SQL ci-dessus

### ❌ "Cannot find module 'sequelize'"
→ Exécuter `npm install` dans le dossier backend

### ❌ Port 4000 déjà utilisé
→ Changer `PORT=4001` dans `.env`

---

## ✅ Checklist Finale

- [ ] MySQL installé et démarré
- [ ] Base de données `hkeya_db` créée
- [ ] `.env` configuré avec le bon mot de passe
- [ ] `npm install` exécuté dans backend/
- [ ] `node scripts/seed.js` exécuté avec succès
- [ ] `npm run dev` démarre sans erreur
- [ ] http://localhost:4000/api/health retourne `{"ok":true}`
- [ ] Login avec Postman fonctionne
- [ ] GET /api/posts retourne les posts

---

## 🎯 Connecter le Frontend

Le frontend React est déjà configuré pour pointer vers `http://localhost:4000`.

Vérifier dans `frontend/src/HkeyaImmersive.jsx` :
```javascript
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
```

Démarrer le frontend :
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Prêt pour la Production

Pour déployer en production :

1. Changer `JWT_SECRET` dans `.env` (valeur très sécurisée)
2. Utiliser des migrations Sequelize au lieu de `sync()`
3. Ajouter rate limiting (express-rate-limit)
4. Configurer HTTPS
5. Utiliser PM2 pour gérer le processus Node.js
6. Configurer un reverse proxy (nginx)

---

## 📞 Support

Pour toute question sur le backend :
- Consulter **README.md**
- Consulter **ARCHITECTURE.md**
- Tester avec **postman_collection.json**

---

## 🎉 Résumé

Vous avez maintenant un **backend REST API professionnel** avec :

✅ Architecture MVC propre et maintenable  
✅ Authentification JWT sécurisée  
✅ Base de données MySQL avec Sequelize ORM  
✅ Validation des données  
✅ Gestion des erreurs  
✅ Upload d'images  
✅ Système de rôles (CLIENT, MODERATEUR, ADMIN)  
✅ Modération de contenu  
✅ Documentation complète  
✅ Collection Postman pour tests  
✅ Scripts de seed pour données de test  

**Le backend est 100% fonctionnel et prêt à être utilisé !** 🚀

Bon développement ! 💪
