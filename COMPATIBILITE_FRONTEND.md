# 🔄 Compatibilité Frontend-Backend

## ✅ Corrections Appliquées

### 1️⃣ Route `/api/notifications` Ajoutée

Le backend retourne maintenant un tableau vide pour les notifications :

```json
GET /api/notifications
Authorization: Bearer <token>

Response:
{
  "ok": true,
  "notifications": []
}
```

### 2️⃣ Routes Posts Compatibles

Le backend accepte maintenant :
- `GET /api/posts` - Tous les posts validés
- `GET /api/posts/approved` - Alias pour compatibilité

### 3️⃣ Format d'Authentification Compatible

Le backend accepte les deux formats :

**Format Frontend :**
```json
POST /api/auth/login
{
  "identifier": "admin@hkeya.tn",
  "password": "password123"
}
```

**Format Backend :**
```json
POST /api/auth/login
{
  "email": "admin@hkeya.tn",
  "motDePasse": "password123"
}
```

---

## 🐛 Problèmes Identifiés

### Erreur 422 sur `/api/posts`

Cette erreur peut venir de :

1. **Token JWT manquant ou invalide**
   - Le frontend doit envoyer : `Authorization: Bearer <token>`
   - Vérifier que le token est bien stocké après le login

2. **Mauvaise méthode HTTP**
   - GET /api/posts ne devrait pas avoir de validation de body
   - Vérifier que le frontend fait bien un GET et pas un POST

---

## 🧪 Test de Diagnostic

### Test 1 : Vérifier le Token

Ouvre la console du navigateur (F12) et tape :

```javascript
localStorage.getItem('whisper_api_token_v1')
```

Si c'est `null`, le login n'a pas fonctionné.

### Test 2 : Tester Manuellement

Dans la console du navigateur :

```javascript
const token = localStorage.getItem('whisper_api_token_v1');

fetch('http://localhost:4000/api/posts', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### Test 3 : Vérifier les Headers

Dans l'onglet Network (F12), clique sur la requête `/api/posts` et vérifie :
- **Method** : doit être `GET`
- **Request Headers** : doit contenir `Authorization: Bearer ...`
- **Status** : si 401 → problème de token, si 422 → problème de validation

---

## 🔧 Solutions Rapides

### Si le Token n'est pas Stocké

Le frontend doit stocker le token après le login :

```javascript
// Après un login réussi
const data = await response.json();
if (data.ok && data.token) {
  localStorage.setItem('whisper_api_token_v1', data.token);
  localStorage.setItem('whisper_api_user_v1', JSON.stringify(data.user));
}
```

### Si l'Erreur Persiste

Redémarre le backend :

```bash
cd backend
# Ctrl+C pour arrêter
npm run dev
```

Puis recharge le frontend (F5).

---

## 📊 Endpoints Disponibles

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil

### Posts
- `GET /api/posts` - Tous les posts validés
- `GET /api/posts/approved` - Alias
- `POST /api/posts` - Créer un post
- `PUT /api/posts/:id` - Modifier
- `DELETE /api/posts/:id` - Supprimer
- `PATCH /api/posts/:id/valider` - Valider (Modo/Admin)

### Interactions
- `POST /api/interactions` - Like/Dislike/Commentaire/Signalement
- `DELETE /api/interactions/:id` - Supprimer

### Topics
- `GET /api/topics` - Tous les topics

### Notifications
- `GET /api/notifications` - Notifications (vide pour l'instant)

### Admin
- `GET /api/admin/users` - Liste utilisateurs
- `PATCH /api/admin/users/:id/role` - Changer rôle
- `DELETE /api/admin/users/:id` - Supprimer utilisateur

---

## ✅ Checklist de Vérification

- [ ] Backend redémarré avec les nouvelles routes
- [ ] http://localhost:4000/api/health retourne `{"ok":true}`
- [ ] Login fonctionne et retourne un token
- [ ] Token stocké dans localStorage
- [ ] GET /api/posts fonctionne avec le token
- [ ] GET /api/notifications retourne `{"ok":true,"notifications":[]}`

---

Teste maintenant et dis-moi quelle erreur persiste ! 🎯
