# 🔧 SOLUTION : Erreur "Too many keys specified; max 64 keys allowed"

## 📋 PROBLÈME
Le backend crash au démarrage avec l'erreur :
```
❌ Impossible de démarrer : Too many keys specified; max 64 keys allowed
```

**Cause** : MySQL limite à 64 index par table. Sequelize avec `sync({ alter: true })` essaie de créer trop d'index en modifiant les tables existantes.

---

## ✅ SOLUTION RAPIDE (3 étapes)

### Étape 1 : Arrêter le backend
Si le backend tourne encore, appuyez sur `Ctrl+C` dans le terminal backend.

### Étape 2 : Réinitialiser la base de données
Dans le terminal, allez dans le dossier backend :
```bash
cd backend
npm run db:reset
```

**Ce script va :**
- ✅ Se connecter à MySQL
- ✅ Supprimer toutes les tables existantes
- ✅ Recréer les tables proprement (sans conflit d'index)

### Étape 3 : Remplir la base avec des données de test
```bash
npm run seed
```

**Ce script va créer :**
- ✅ 4 utilisateurs (admin, modérateur, 2 clients)
- ✅ 4 topics (Politique, Sport, Culture, Technologie)
- ✅ Posts de test
- ✅ Interactions de test

### Étape 4 : Redémarrer le backend
```bash
npm run dev
```

Vous devriez voir :
```
✅ MySQL connecté
✅ Tables synchronisées
🚀 Hkeya Backend → http://localhost:4000
```

---

## 🔐 COMPTES DE TEST

Après le seed, vous pouvez vous connecter avec :

### 👑 Administrateur
- **Email** : `admin@hkeya.tn`
- **Mot de passe** : `Admin123!`
- **Rôle** : Administrateur (peut tout faire)

### 👮 Modérateur
- **Email** : `moderateur@hkeya.tn`
- **Mot de passe** : `Modo123!`
- **Rôle** : Moderateur (peut valider/rejeter les posts)

### 👤 Client 1
- **Email** : `user1@hkeya.tn`
- **Mot de passe** : `User123!`
- **Rôle** : Membre

### 👤 Client 2
- **Email** : `user2@hkeya.tn`
- **Mot de passe** : `User123!`
- **Rôle** : Membre

---

## 🚀 DÉMARRAGE COMPLET (Frontend + Backend)

### Option 1 : Démarrer tout depuis la racine
```bash
npm run dev
```

### Option 2 : Démarrer séparément

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

---

## 🧹 NETTOYER LE FRONTEND

Si vous avez des erreurs dans le frontend après les modifications, nettoyez le localStorage :

1. Ouvrez le frontend : http://localhost:5173
2. Ouvrez la console (F12)
3. Tapez :
```javascript
localStorage.clear();
location.reload();
```

---

## 📝 SCRIPTS DISPONIBLES

Dans le dossier `backend/` :

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le backend en mode développement |
| `npm run db:reset` | ⚠️ Supprime et recrée toutes les tables |
| `npm run seed` | Remplit la base avec des données de test |
| `npm start` | Démarre le backend en mode production |

---

## ❓ SI ÇA NE MARCHE TOUJOURS PAS

### Vérifier que MySQL tourne
1. Ouvrez XAMPP
2. Vérifiez que MySQL est démarré (bouton vert "Running")

### Vérifier la base de données
1. Ouvrez phpMyAdmin : http://localhost/phpmyadmin
2. Vérifiez que la base `hkeya_db` existe
3. Si elle n'existe pas, créez-la :
```sql
CREATE DATABASE hkeya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Vérifier le fichier .env
Ouvrez `backend/.env` et vérifiez :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hkeya_db
DB_PORT=3306
```

---

## 🎯 PROCHAINES ÉTAPES

Une fois le backend démarré :

1. ✅ Testez la connexion : http://localhost:4000/api/health
2. ✅ Ouvrez le frontend : http://localhost:5173
3. ✅ Connectez-vous avec un compte de test
4. ✅ Testez les fonctionnalités :
   - Créer un post
   - Liker/Disliker
   - Commenter
   - Valider un post (en tant que modérateur)
   - Gérer les utilisateurs (en tant qu'admin)

---

## 📞 BESOIN D'AIDE ?

Si vous avez encore des erreurs, copiez-collez le message d'erreur complet !
