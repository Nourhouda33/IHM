# 🧪 Guide de Test de l'API Hkeya

## ✅ Backend Opérationnel !

Votre backend répond correctement sur http://localhost:4000

---

## 📋 Tests à Effectuer

### 1️⃣ Test d'Authentification

#### A. Login avec le compte Admin

**Requête :**
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@hkeya.tn",
  "motDePasse": "password123"
}
```

**Réponse attendue :**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nom": "Kchaou",
    "prenom": "Mahmoud",
    "email": "admin@hkeya.tn",
    "pseudo": "AdminHkeya",
    "role": "ADMIN",
    ...
  }
}
```

**⚠️ IMPORTANT : Copier le token pour les tests suivants !**

---

### 2️⃣ Test du Profil Utilisateur

**Requête :**
```
GET http://localhost:4000/api/auth/me
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Réponse attendue :**
```json
{
  "ok": true,
  "user": {
    "id": 1,
    "nom": "Kchaou",
    "prenom": "Mahmoud",
    "email": "admin@hkeya.tn",
    "pseudo": "AdminHkeya",
    "role": "ADMIN"
  }
}
```

---

### 3️⃣ Test des Topics

**Requête :**
```
GET http://localhost:4000/api/topics
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Réponse attendue :**
```json
{
  "ok": true,
  "topics": [
    {
      "id": 1,
      "nom": "Études",
      "description": "Discussions sur les études, stages, universités",
      "created_at": "...",
      "updated_at": "..."
    },
    {
      "id": 2,
      "nom": "Technologie",
      "description": "Programmation, IA, cybersécurité",
      ...
    },
    ...
  ]
}
```

---

### 4️⃣ Test des Posts

**Requête :**
```
GET http://localhost:4000/api/posts
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Réponse attendue :**
```json
{
  "ok": true,
  "posts": [
    {
      "id": 1,
      "texte": "يخي فما شركة تقبل stagiaire مغير اكتاف ؟",
      "statut": true,
      "likesCount": "2",
      "dislikesCount": "0",
      "commentsCount": "1",
      "signalementsCount": "0",
      "auteur": {
        "id": 3,
        "pseudo": "YassineT",
        "avatar": "Y",
        "role": "CLIENT"
      },
      "topic": {
        "id": 1,
        "nom": "Études"
      }
    },
    ...
  ]
}
```

---

### 5️⃣ Test de Création de Post

**Requête :**
```
POST http://localhost:4000/api/posts
Authorization: Bearer VOTRE_TOKEN_ICI
Content-Type: application/json

{
  "topic_id": 1,
  "texte": "Mon premier post de test !"
}
```

**Réponse attendue :**
```json
{
  "ok": true,
  "post": {
    "id": 5,
    "user_id": 1,
    "topic_id": 1,
    "texte": "Mon premier post de test !",
    "statut": false,
    "dateCreation": "...",
    ...
  }
}
```

**Note :** Le post a `statut: false` (en attente de validation)

---

### 6️⃣ Test de Like

**Requête :**
```
POST http://localhost:4000/api/interactions
Authorization: Bearer VOTRE_TOKEN_ICI
Content-Type: application/json

{
  "post_id": 1,
  "type": "LIKE"
}
```

**Réponse attendue :**
```json
{
  "ok": true,
  "interaction": {
    "id": 6,
    "user_id": 1,
    "post_id": 1,
    "type": "LIKE",
    "created_at": "..."
  }
}
```

---

### 7️⃣ Test de Commentaire

**Requête :**
```
POST http://localhost:4000/api/interactions
Authorization: Bearer VOTRE_TOKEN_ICI
Content-Type: application/json

{
  "post_id": 1,
  "type": "COMMENTAIRE",
  "contenu": "Super post, merci pour le partage !"
}
```

---

### 8️⃣ Test Admin : Liste des Utilisateurs

**Requête :**
```
GET http://localhost:4000/api/admin/users
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Réponse attendue :**
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
      "role": "ADMIN",
      ...
    },
    ...
  ]
}
```

---

## 🔧 Tester avec curl (Windows PowerShell)

### Login
```powershell
$body = @{
    email = "admin@hkeya.tn"
    motDePasse = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

### Get Posts (remplacer VOTRE_TOKEN)
```powershell
$headers = @{
    Authorization = "Bearer VOTRE_TOKEN"
}

Invoke-RestMethod -Uri "http://localhost:4000/api/posts" -Method GET -Headers $headers
```

---

## 📦 Importer dans Postman

1. Ouvrir Postman
2. Cliquer sur **Import**
3. Sélectionner le fichier `backend/postman_collection.json`
4. Toutes les requêtes sont prêtes !
5. Modifier la variable `{{token}}` après le login

---

## ✅ Checklist de Test

- [ ] Login fonctionne et retourne un token
- [ ] GET /api/auth/me retourne le profil
- [ ] GET /api/topics retourne 4 topics
- [ ] GET /api/posts retourne les posts avec compteurs
- [ ] POST /api/posts crée un nouveau post
- [ ] POST /api/interactions (LIKE) fonctionne
- [ ] POST /api/interactions (COMMENTAIRE) fonctionne
- [ ] GET /api/admin/users retourne la liste (avec token admin)

---

## 🎯 Prochaine Étape

Une fois tous les tests validés, vous pouvez :
1. Connecter le frontend React
2. Tester l'inscription depuis le frontend
3. Tester la création de posts depuis l'interface

---

Bon test ! 🚀
