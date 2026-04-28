# 🔔 SYSTÈME DE NOTIFICATIONS PERSONNALISÉES

## ✅ PROBLÈME RÉSOLU

**Avant** : Tous les utilisateurs voyaient les mêmes notifications (ou aucune)

**Maintenant** : Chaque utilisateur voit **UNIQUEMENT ses propres notifications**

---

## 🎯 FONCTIONNALITÉS

### Notifications automatiques créées quand :

1. **Quelqu'un like votre post**
   - Message : "YassineT a aimé votre publication"

2. **Quelqu'un dislike votre post**
   - Message : "AmiraG n'a pas aimé votre publication"

3. **Quelqu'un commente votre post**
   - Message : "ModSarra a commenté votre publication"

4. **Quelqu'un signale votre post**
   - Message : "AdminHkeya a signalé votre publication"

5. **Votre post est validé**
   - Message : "Votre publication a été validée par un modérateur"

6. **Votre post est rejeté**
   - Message : "Votre publication a été rejetée par un modérateur"

---

## 📊 NOUVELLE TABLE : `notifications`

```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,              -- Destinataire
  from_user_id INT,                  -- Expéditeur
  post_id INT,                       -- Post concerné
  type ENUM('LIKE', 'DISLIKE', 'COMMENTAIRE', 'SIGNALEMENT', 'POST_VALIDE', 'POST_REJETE'),
  message VARCHAR(255) NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 NOUVELLES ROUTES API

### 1. Récupérer mes notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

**Réponse** :
```json
{
  "ok": true,
  "notifications": [
    {
      "id": 1,
      "type": "LIKE",
      "message": "YassineT a aimé votre publication",
      "lu": false,
      "createdAt": "2026-04-27T...",
      "expediteur": {
        "id": 3,
        "pseudo": "YassineT",
        "avatar": "Y"
      },
      "post": {
        "id": 1,
        "texte": "يخي فما شركة تقبل stagiaire..."
      }
    }
  ]
}
```

### 2. Compter les notifications non lues
```http
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

**Réponse** :
```json
{
  "ok": true,
  "count": 3
}
```

### 3. Marquer une notification comme lue
```http
PATCH /api/notifications/:id/read
Authorization: Bearer <token>
```

### 4. Marquer toutes comme lues
```http
PATCH /api/notifications/read-all
Authorization: Bearer <token>
```

### 5. Supprimer une notification
```http
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

---

## 🔒 SÉCURITÉ

✅ **Chaque utilisateur voit UNIQUEMENT ses propres notifications**
- La requête filtre automatiquement par `user_id = req.user.id`
- Impossible de voir les notifications d'un autre utilisateur

✅ **Pas de notification pour soi-même**
- Si vous likez votre propre post, aucune notification n'est créée

✅ **Authentification requise**
- Toutes les routes nécessitent un token JWT valide

---

## 🚀 DÉMARRAGE

### Étape 1 : Réinitialiser la base de données
```bash
cd backend
npm run db:reset
npm run seed
```

Cela va créer la nouvelle table `notifications`.

### Étape 2 : Redémarrer le backend
```bash
npm run dev
```

### Étape 3 : Tester

1. Connectez-vous avec **user1@hkeya.tn** / **User123!**
2. Créez un post
3. Connectez-vous avec **user2@hkeya.tn** / **User123!**
4. Likez le post de user1
5. Reconnectez-vous avec **user1@hkeya.tn**
6. Appelez `/api/notifications` → Vous verrez la notification du like !

---

## 🧪 TESTER AVEC CURL

### Créer un post (user1)
```bash
curl -X POST http://localhost:4000/api/posts \
  -H "Authorization: Bearer <token_user1>" \
  -H "Content-Type: application/json" \
  -d '{"topic_id": 1, "texte": "Mon premier post"}'
```

### Liker le post (user2)
```bash
curl -X POST http://localhost:4000/api/interactions \
  -H "Authorization: Bearer <token_user2>" \
  -H "Content-Type: application/json" \
  -d '{"post_id": 5, "type": "LIKE"}'
```

### Voir les notifications (user1)
```bash
curl http://localhost:4000/api/notifications \
  -H "Authorization: Bearer <token_user1>"
```

**Résultat** : user1 voit la notification du like de user2 !

---

## 📝 FICHIERS MODIFIÉS

### Nouveaux fichiers :
- ✅ `backend/models/Notification.js`
- ✅ `backend/services/notification.service.js`

### Fichiers modifiés :
- ✅ `backend/models/index.js` (associations)
- ✅ `backend/controllers/notification.controller.js` (implémentation complète)
- ✅ `backend/routes/notification.routes.js` (nouvelles routes)
- ✅ `backend/services/interaction.service.js` (création auto de notifications)
- ✅ `backend/services/post.service.js` (notifications validation/rejet)
- ✅ `backend/controllers/post.controller.js` (passer moderatorId)

---

## 🎨 INTÉGRATION FRONTEND

Le frontend appelle déjà `/api/notifications` dans `whisper-original.html` :

```javascript
function updateNotificationBadge() {
  fetch('http://localhost:4000/api/notifications', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('whisper_api_token_v1')}`
    }
  })
  .then(r => r.json())
  .then(data => {
    if (data.ok && data.notifications) {
      const unreadCount = data.notifications.filter(n => !n.lu).length;
      // Mettre à jour le badge
      const badge = document.querySelector('.notif-dot');
      if (badge) {
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
      }
    }
  });
}
```

---

## 📊 EXEMPLES DE NOTIFICATIONS

### Scénario 1 : Like
- **User1** crée un post
- **User2** like le post
- **User1** reçoit : "User2 a aimé votre publication"

### Scénario 2 : Commentaire
- **User1** crée un post
- **User2** commente "Super post !"
- **User1** reçoit : "User2 a commenté votre publication"

### Scénario 3 : Validation
- **User1** crée un post (statut = en attente)
- **Modérateur** valide le post
- **User1** reçoit : "Votre publication a été validée par un modérateur"

### Scénario 4 : Rejet
- **User1** crée un post
- **Modérateur** rejette le post
- **User1** reçoit : "Votre publication a été rejetée par un modérateur"

---

## 🔍 VÉRIFIER DANS LA BASE

### Voir toutes les notifications
```sql
SELECT * FROM notifications ORDER BY created_at DESC;
```

### Voir les notifications d'un utilisateur
```sql
SELECT n.*, u.pseudo as expediteur
FROM notifications n
LEFT JOIN users u ON n.from_user_id = u.id
WHERE n.user_id = 1
ORDER BY n.created_at DESC;
```

### Compter les non lues
```sql
SELECT COUNT(*) FROM notifications WHERE user_id = 1 AND lu = FALSE;
```

---

## ✅ AVANTAGES

1. **Personnalisé** : Chaque utilisateur voit uniquement ses notifications
2. **Automatique** : Notifications créées automatiquement lors des interactions
3. **Sécurisé** : Impossible de voir les notifications des autres
4. **Complet** : Gestion du statut lu/non lu
5. **Performant** : Requêtes optimisées avec includes

---

## 🆘 DÉPANNAGE

### Problème : Aucune notification
- Vérifiez que la table `notifications` existe
- Exécutez `npm run db:reset` puis `npm run seed`

### Problème : Notifications de tous les utilisateurs
- Vérifiez que le filtre `where: { user_id: userId }` est bien dans le service

### Problème : Erreur "Notification model not found"
- Vérifiez que `Notification` est bien exporté dans `models/index.js`

---

**Système de notifications complet et sécurisé ! 🎉**

Chaque utilisateur voit **UNIQUEMENT** ses propres notifications.
