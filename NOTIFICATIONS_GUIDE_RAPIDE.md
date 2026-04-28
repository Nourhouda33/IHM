# 🔔 NOTIFICATIONS PERSONNALISÉES - GUIDE RAPIDE

## ✅ VOTRE DEMANDE

> "En tant que n'importe quel user, il faut que je reçoive seulement les notifications destinées pour moi-même"

**C'EST FAIT !** ✅

---

## 🎯 CE QUI A ÉTÉ AJOUTÉ

### Chaque utilisateur reçoit des notifications quand :

1. ❤️ Quelqu'un **like** son post
2. 👎 Quelqu'un **dislike** son post
3. 💬 Quelqu'un **commente** son post
4. 🚩 Quelqu'un **signale** son post
5. ✅ Son post est **validé** par un modérateur
6. ❌ Son post est **rejeté** par un modérateur

---

## 🔒 SÉCURITÉ

✅ **Vous voyez UNIQUEMENT vos propres notifications**
✅ **Impossible de voir les notifications des autres**
✅ **Pas de notification si vous interagissez avec votre propre post**

---

## 🚀 ACTIVATION (3 commandes)

```bash
cd backend
npm run db:reset
npm run seed
npm run dev
```

---

## 🧪 TESTER

### Scénario simple :

1. **Connectez-vous** avec `user1@hkeya.tn` / `User123!`
2. **Créez un post**
3. **Déconnectez-vous**
4. **Connectez-vous** avec `user2@hkeya.tn` / `User123!`
5. **Likez le post** de user1
6. **Déconnectez-vous**
7. **Reconnectez-vous** avec `user1@hkeya.tn`
8. **Cliquez sur l'icône de notification** 🔔

**Résultat** : Vous verrez "YassineT a aimé votre publication" !

---

## 📊 API

### Voir mes notifications
```http
GET /api/notifications
Authorization: Bearer <votre_token>
```

### Compter les non lues
```http
GET /api/notifications/unread-count
Authorization: Bearer <votre_token>
```

### Marquer comme lue
```http
PATCH /api/notifications/:id/read
Authorization: Bearer <votre_token>
```

---

## 🎨 DANS LE FRONTEND

Le frontend appelle déjà `/api/notifications` automatiquement.

Le badge rouge 🔴 s'affiche quand vous avez des notifications non lues.

---

## 📝 EXEMPLE DE NOTIFICATION

```json
{
  "id": 1,
  "type": "LIKE",
  "message": "YassineT a aimé votre publication",
  "lu": false,
  "createdAt": "2026-04-27T22:30:00.000Z",
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
```

---

## ✅ VÉRIFICATION

### Dans phpMyAdmin :
1. Ouvrez http://localhost/phpmyadmin
2. Cliquez sur `hkeya_db`
3. Cliquez sur `notifications`
4. Vous verrez toutes les notifications avec `user_id` (destinataire)

### Dans l'API :
Ouvrez (après connexion) : http://localhost:4000/api/notifications

---

## 📚 DOCUMENTATION COMPLÈTE

Voir `SYSTEME_NOTIFICATIONS.md` pour tous les détails techniques.

---

**C'est tout ! Chaque utilisateur voit uniquement SES notifications.** 🎉
