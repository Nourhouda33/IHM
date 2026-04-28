# 🔔 INSTRUCTIONS FINALES - NOTIFICATIONS

## ✅ CE QUI A ÉTÉ FAIT

1. ✅ **Table `notifications` créée** dans MySQL
2. ✅ **Chaque utilisateur voit UNIQUEMENT ses notifications**
3. ✅ **Notifications automatiques** lors des interactions
4. ✅ **Suppression des données statiques** du frontend
5. ✅ **Tout fonctionne avec XAMPP**

---

## 🚀 COMMANDES À EXÉCUTER (4 étapes)

### Étape 1 : Réinitialiser la base
```bash
cd backend
npm run db:reset
```

### Étape 2 : Remplir avec des données
```bash
npm run seed
```

### Étape 3 : Tester les notifications
```bash
npm run test:notifications
```

**Vous devez voir** :
```
✅ Test terminé avec succès !
📝 Résumé :
   - Chaque utilisateur voit UNIQUEMENT ses notifications
   - Les notifications sont bien isolées par user_id
   - Le système fonctionne correctement !
```

### Étape 4 : Démarrer le backend
```bash
npm run dev
```

---

## 🧪 TEST RAPIDE

### Dans le navigateur :

1. Ouvrez http://localhost:5174
2. Connectez-vous : `user1@hkeya.tn` / `User123!`
3. Créez un post
4. Déconnectez-vous
5. Connectez-vous : `user2@hkeya.tn` / `User123!`
6. Likez le post de user1
7. Déconnectez-vous
8. Reconnectez-vous : `user1@hkeya.tn` / `User123!`
9. Cliquez sur 🔔

**Résultat** : Vous verrez "AmiraG a aimé votre publication" !

---

## 📊 VÉRIFIER DANS PHPMYADMIN

1. Ouvrez http://localhost/phpmyadmin
2. Cliquez sur `hkeya_db`
3. Cliquez sur `notifications`

**Vous verrez** :
- Colonne `user_id` : Destinataire de la notification
- Colonne `from_user_id` : Expéditeur
- Colonne `message` : Texte de la notification
- Colonne `lu` : 0 = non lu, 1 = lu

---

## 🔒 SÉCURITÉ GARANTIE

✅ **Chaque utilisateur voit UNIQUEMENT ses notifications**

L'API filtre automatiquement :
```javascript
where: { user_id: req.user.id }
```

Impossible de voir les notifications d'un autre utilisateur !

---

## 📝 TYPES DE NOTIFICATIONS

| Type | Quand ? | Message |
|------|---------|---------|
| LIKE | Quelqu'un like votre post | "X a aimé votre publication" |
| DISLIKE | Quelqu'un dislike votre post | "X n'a pas aimé votre publication" |
| COMMENTAIRE | Quelqu'un commente votre post | "X a commenté votre publication" |
| SIGNALEMENT | Quelqu'un signale votre post | "X a signalé votre publication" |
| POST_VALIDE | Votre post est validé | "Votre publication a été validée" |
| POST_REJETE | Votre post est rejeté | "Votre publication a été rejetée" |

---

## 🎯 ROUTES API

### Voir mes notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

### Compter les non lues
```http
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

### Marquer comme lue
```http
PATCH /api/notifications/:id/read
Authorization: Bearer <token>
```

### Marquer toutes comme lues
```http
PATCH /api/notifications/read-all
Authorization: Bearer <token>
```

### Supprimer une notification
```http
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

---

## 📂 FICHIERS CRÉÉS/MODIFIÉS

### Nouveaux fichiers :
- ✅ `backend/models/Notification.js`
- ✅ `backend/services/notification.service.js`
- ✅ `backend/scripts/testNotifications.js`

### Fichiers modifiés :
- ✅ `backend/models/index.js` (associations)
- ✅ `backend/controllers/notification.controller.js`
- ✅ `backend/routes/notification.routes.js`
- ✅ `backend/services/interaction.service.js`
- ✅ `backend/services/post.service.js`
- ✅ `backend/controllers/post.controller.js`
- ✅ `backend/package.json` (script test)

---

## ✅ VÉRIFICATION FINALE

Exécutez ces 4 commandes dans l'ordre :

```bash
cd backend
npm run db:reset
npm run seed
npm run test:notifications
npm run dev
```

Si tout est ✅, vous verrez :
```
✅ Test terminé avec succès !
🚀 Hkeya Backend → http://localhost:4000
```

---

## 🆘 EN CAS DE PROBLÈME

### Port 4000 déjà utilisé
```bash
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Table notifications introuvable
```bash
npm run db:reset
npm run seed
```

### Notifications vides
```bash
npm run test:notifications
```

---

## 📚 DOCUMENTATION COMPLÈTE

- `TEST_COMPLET_NOTIFICATIONS.md` - Tests détaillés
- `SYSTEME_NOTIFICATIONS.md` - Documentation technique
- `NOTIFICATIONS_GUIDE_RAPIDE.md` - Guide rapide

---

**TOUT EST PRÊT ! Exécutez les 4 commandes et testez.** 🎉

**Chaque utilisateur voit UNIQUEMENT ses propres notifications selon son rôle.**
