# 📊 CHARGER LES DONNÉES RÉELLES DEPUIS LA BASE DE DONNÉES

## 🎯 OBJECTIF
Actuellement, certaines parties du frontend affichent des **données fictives en dur** dans le HTML. Ce guide explique comment charger les **vraies données depuis l'API**.

---

## ✅ CE QUI FONCTIONNE DÉJÀ

Ces sections chargent **déjà les vraies données** depuis l'API :

- ✅ **Page d'accueil** : Posts validés (`loadApprovedPosts()`)
- ✅ **Mes publications** : Posts de l'utilisateur connecté (`loadMyPosts()`)
- ✅ **Modération** : Posts en attente (`loadModerationPosts()`)
- ✅ **Authentification** : Login/Register avec JWT

---

## ❌ CE QUI EST ENCORE EN DUR (Données fictives)

Ces sections affichent des **données fictives** :

1. **Page Admin → Utilisateurs** : Liste des utilisateurs
2. **Page Admin → Topics** : Liste des topics
3. **Page Admin → Statistiques** : Compteurs
4. **Sélecteur de topics** : Dans le formulaire de création de post

---

## 🔧 SOLUTION : Intégrer le fichier `api-loader.js`

J'ai créé le fichier `frontend/public/api-loader.js` qui charge automatiquement les vraies données.

### Étape 1 : Ajouter le script dans `whisper-original.html`

Ouvrez `frontend/public/whisper-original.html` et ajoutez **juste avant la balise `</body>` ou `</html>`** :

```html
<script src="/api-loader.js"></script>
</body>
</html>
```

### Étape 2 : Redémarrer le frontend

```bash
cd frontend
npm run dev
```

### Étape 3 : Tester

1. Connectez-vous en tant qu'**admin** : `admin@hkeya.tn` / `Admin123!`
2. Allez dans **Admin → Utilisateurs**
3. Vous devriez voir les **4 utilisateurs réels** de la base de données
4. Allez dans **Admin → Topics**
5. Vous devriez voir les **4 topics réels** de la base de données

---

## 📋 FONCTIONNALITÉS AJOUTÉES

Le fichier `api-loader.js` ajoute :

### 1. Chargement automatique des utilisateurs
- Affiche tous les utilisateurs de la base
- Affiche leur rôle (Admin, Modérateur, Membre)
- Boutons pour changer le rôle
- Boutons pour supprimer un utilisateur

### 2. Chargement automatique des topics
- Affiche tous les topics de la base
- Nombre de posts par topic
- Boutons pour éditer/supprimer

### 3. Chargement automatique des statistiques
- Nombre réel d'utilisateurs
- Nombre réel de posts
- Nombre réel de topics

### 4. Actions admin fonctionnelles
- **Changer le rôle** : Passer de Membre à Modérateur et vice-versa
- **Supprimer un utilisateur** : Supprime l'utilisateur et tous ses posts
- **Supprimer un topic** : Supprime le topic

---

## 🔍 VÉRIFIER QUE ÇA MARCHE

### Test 1 : Utilisateurs
```bash
# Dans la console du navigateur (F12)
loadRealUsers()
```
Vous devriez voir la liste des utilisateurs se remplir.

### Test 2 : Topics
```bash
# Dans la console du navigateur (F12)
loadRealTopics()
```
Vous devriez voir la liste des topics se remplir.

### Test 3 : API directe
Ouvrez dans le navigateur :
- http://localhost:4000/api/admin/users (nécessite d'être connecté en admin)
- http://localhost:4000/api/topics

---

## 📊 STRUCTURE DES DONNÉES

### Utilisateurs (depuis `/api/admin/users`)
```json
{
  "ok": true,
  "users": [
    {
      "id": 1,
      "nom": "Kchaou",
      "prenom": "Mahmoud",
      "email": "admin@hkeya.tn",
      "pseudo": "AdminHkeya",
      "avatar": "M",
      "role": "ADMIN",
      "created_at": "2026-04-27T..."
    }
  ]
}
```

### Topics (depuis `/api/topics`)
```json
{
  "ok": true,
  "topics": [
    {
      "id": 1,
      "nom": "Études",
      "description": "Discussions sur les études...",
      "postCount": 2
    }
  ]
}
```

### Posts (depuis `/api/posts`)
```json
{
  "ok": true,
  "posts": [
    {
      "id": 1,
      "texte": "يخي فما شركة تقبل stagiaire...",
      "author": "YassineT",
      "topic": "Études",
      "likesCount": 2,
      "commentsCount": 1,
      "statut": true
    }
  ]
}
```

---

## 🎨 PERSONNALISATION

Si vous voulez modifier l'affichage, éditez `frontend/public/api-loader.js` :

### Changer le format d'affichage des utilisateurs
Ligne 40-70 dans `loadRealUsers()`

### Changer le format d'affichage des topics
Ligne 100-140 dans `loadRealTopics()`

### Ajouter d'autres données
Créez une nouvelle fonction `loadRealXXX()` sur le même modèle.

---

## 🔐 SÉCURITÉ

Le fichier `api-loader.js` :
- ✅ Utilise le token JWT pour l'authentification
- ✅ Gère les erreurs 401 (session expirée)
- ✅ Vérifie les permissions (admin uniquement)
- ✅ Affiche des messages d'erreur clairs

---

## 🆘 DÉPANNAGE

### Problème : "Route introuvable"
- Vérifiez que le backend tourne sur http://localhost:4000
- Testez : http://localhost:4000/api/health

### Problème : "Unauthorized"
- Reconnectez-vous
- Vérifiez que vous êtes admin pour accéder à `/api/admin/users`

### Problème : Les données ne s'affichent pas
1. Ouvrez la console (F12)
2. Regardez les erreurs
3. Vérifiez que `api-loader.js` est bien chargé
4. Tapez `loadRealUsers()` manuellement

### Problème : Données vides
- Vérifiez que vous avez exécuté `npm run seed` dans le backend
- Vérifiez dans phpMyAdmin que les tables contiennent des données

---

## 📝 RÉSUMÉ

**Avant** : Données fictives en dur dans le HTML
**Après** : Données réelles chargées depuis MySQL via l'API

**Fichiers modifiés** :
- ✅ `frontend/public/api-loader.js` (créé)
- ⚠️ `frontend/public/whisper-original.html` (ajouter `<script src="/api-loader.js"></script>`)

**Commandes** :
```bash
cd backend
npm run db:reset
npm run seed
npm run dev

# Nouveau terminal
cd frontend
npm run dev
```

**Test** :
1. Ouvrir http://localhost:5174
2. Se connecter : `admin@hkeya.tn` / `Admin123!`
3. Aller dans Admin → Utilisateurs
4. Voir les 4 utilisateurs réels !

---

**Tout est prêt ! Il suffit d'ajouter la ligne `<script>` dans le HTML.** 🎉
