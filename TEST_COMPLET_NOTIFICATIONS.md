# 🧪 TEST COMPLET - NOTIFICATIONS PERSONNALISÉES

## ✅ OBJECTIF

Vérifier que **chaque utilisateur voit UNIQUEMENT ses propres notifications**, pas celles des autres.

---

## 🚀 ÉTAPE 1 : RÉINITIALISER LA BASE

```bash
cd backend
npm run db:reset
```

**Résultat attendu** :
```
✅ Connecté
🗑️  Suppression de toutes les tables...
✅ Tables supprimées
🔨 Création des tables...
✅ Tables créées avec succès
```

Cela crée la table `notifications` dans MySQL.

---

## 🌱 ÉTAPE 2 : REMPLIR AVEC DES DONNÉES

```bash
npm run seed
```

**Résultat attendu** :
```
✅ 4 utilisateurs créés
✅ 4 topics créés
✅ 4 posts créés
✅ 5 interactions créées
```

---

## 🧪 ÉTAPE 3 : TESTER LES NOTIFICATIONS

```bash
node scripts/testNotifications.js
```

**Résultat attendu** :
```
🧪 Test du système de notifications

✅ Connecté à MySQL

📋 Vérification de la table notifications...
✅ Table notifications existe

📊 4 utilisateurs trouvés :
   - AdminHkeya (admin@hkeya.tn) - ADMIN
   - ModSarra (moderateur@hkeya.tn) - MODERATEUR
   - YassineT (user1@hkeya.tn) - CLIENT
   - AmiraG (user2@hkeya.tn) - CLIENT

🔔 Création de notifications de test...
✅ Notification créée : AmiraG → YassineT (LIKE)
✅ Notification créée : AdminHkeya → YassineT (VALIDATION)
✅ Notification créée : YassineT → AmiraG (COMMENTAIRE)

🔍 Vérification de l'isolation des notifications...

📬 Notifications de YassineT (CLIENT) :
   - [LIKE] AmiraG a aimé votre publication (de: AmiraG)
   - [POST_VALIDE] Votre publication a été validée par un modérateur (de: AdminHkeya)

📬 Notifications de AmiraG (CLIENT) :
   - [COMMENTAIRE] YassineT a commenté votre publication (de: YassineT)

📬 Notifications de AdminHkeya (ADMIN) :
   Aucune notification

📊 Total notifications : 3
📊 Non lues : 3

✅ Test terminé avec succès !
```

**✅ SUCCÈS** : Chaque utilisateur voit UNIQUEMENT ses notifications !

---

## 🔍 ÉTAPE 4 : VÉRIFIER DANS PHPMYADMIN

1. Ouvrez http://localhost/phpmyadmin
2. Cliquez sur `hkeya_db`
3. Cliquez sur `notifications`

**Vous devez voir** :

| id | user_id | from_user_id | type | message | lu |
|----|---------|--------------|------|---------|-----|
| 1 | 3 | 4 | LIKE | AmiraG a aimé votre publication | 0 |
| 2 | 3 | 1 | POST_VALIDE | Votre publication a été validée... | 0 |
| 3 | 4 | 3 | COMMENTAIRE | YassineT a commenté... | 0 |

**Explication** :
- `user_id` = Destinataire (qui reçoit la notification)
- `from_user_id` = Expéditeur (qui a fait l'action)
- Chaque notification est bien isolée par `user_id`

---

## 🌐 ÉTAPE 5 : TESTER AVEC L'API

### 1. Démarrer le backend
```bash
npm run dev
```

### 2. Se connecter (user1)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@hkeya.tn","motDePasse":"User123!"}'
```

**Copiez le token** dans la réponse.

### 3. Voir les notifications de user1
```bash
curl http://localhost:4000/api/notifications \
  -H "Authorization: Bearer <TOKEN_USER1>"
```

**Résultat** : Vous verrez les 2 notifications de YassineT (user1) :
```json
{
  "ok": true,
  "notifications": [
    {
      "id": 1,
      "type": "LIKE",
      "message": "AmiraG a aimé votre publication",
      "lu": false,
      "expediteur": {
        "id": 4,
        "pseudo": "AmiraG",
        "avatar": "A"
      }
    },
    {
      "id": 2,
      "type": "POST_VALIDE",
      "message": "Votre publication a été validée par un modérateur",
      "lu": false,
      "expediteur": {
        "id": 1,
        "pseudo": "AdminHkeya",
        "avatar": "M"
      }
    }
  ]
}
```

### 4. Se connecter (user2)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user2@hkeya.tn","motDePasse":"User123!"}'
```

### 5. Voir les notifications de user2
```bash
curl http://localhost:4000/api/notifications \
  -H "Authorization: Bearer <TOKEN_USER2>"
```

**Résultat** : Vous verrez la notification de AmiraG (user2) :
```json
{
  "ok": true,
  "notifications": [
    {
      "id": 3,
      "type": "COMMENTAIRE",
      "message": "YassineT a commenté votre publication",
      "lu": false,
      "expediteur": {
        "id": 3,
        "pseudo": "YassineT",
        "avatar": "Y"
      }
    }
  ]
}
```

**✅ SUCCÈS** : user1 et user2 voient des notifications différentes !

---

## 🎯 ÉTAPE 6 : TESTER DANS LE FRONTEND

### 1. Démarrer le frontend
```bash
cd frontend
npm run dev
```

### 2. Se connecter
- Ouvrez http://localhost:5174
- Connectez-vous : `user1@hkeya.tn` / `User123!`

### 3. Vérifier les notifications
- Cliquez sur l'icône 🔔 en haut à droite
- Vous devez voir les notifications de user1 UNIQUEMENT

### 4. Changer d'utilisateur
- Déconnectez-vous
- Connectez-vous : `user2@hkeya.tn` / `User123!`
- Cliquez sur 🔔
- Vous devez voir les notifications de user2 UNIQUEMENT

**✅ SUCCÈS** : Chaque utilisateur voit ses propres notifications !

---

## 🔄 ÉTAPE 7 : TESTER LA CRÉATION AUTOMATIQUE

### Scénario : user2 like un post de user1

1. **Connectez-vous** : `user1@hkeya.tn` / `User123!`
2. **Créez un post**
3. **Notez l'ID du post** (par exemple : 5)
4. **Déconnectez-vous**
5. **Connectez-vous** : `user2@hkeya.tn` / `User123!`
6. **Likez le post** de user1

**Avec l'API** :
```bash
curl -X POST http://localhost:4000/api/interactions \
  -H "Authorization: Bearer <TOKEN_USER2>" \
  -H "Content-Type: application/json" \
  -d '{"post_id":5,"type":"LIKE"}'
```

7. **Déconnectez-vous**
8. **Reconnectez-vous** : `user1@hkeya.tn` / `User123!`
9. **Vérifiez les notifications**

**Résultat** : user1 voit une nouvelle notification "AmiraG a aimé votre publication" !

---

## 📊 VÉRIFICATION FINALE

### Requête SQL pour voir toutes les notifications
```sql
SELECT 
  n.id,
  u1.pseudo as destinataire,
  u2.pseudo as expediteur,
  n.type,
  n.message,
  n.lu
FROM notifications n
LEFT JOIN users u1 ON n.user_id = u1.id
LEFT JOIN users u2 ON n.from_user_id = u2.id
ORDER BY n.created_at DESC;
```

**Résultat attendu** :
```
| id | destinataire | expediteur  | type        | message                          | lu |
|----|--------------|-------------|-------------|----------------------------------|-----|
| 1  | YassineT     | AmiraG      | LIKE        | AmiraG a aimé votre publication  | 0   |
| 2  | YassineT     | AdminHkeya  | POST_VALIDE | Votre publication a été validée  | 0   |
| 3  | AmiraG       | YassineT    | COMMENTAIRE | YassineT a commenté...           | 0   |
```

---

## ✅ CRITÈRES DE SUCCÈS

- ✅ Table `notifications` créée dans MySQL
- ✅ Chaque utilisateur voit UNIQUEMENT ses notifications
- ✅ Les notifications sont créées automatiquement lors des interactions
- ✅ L'API `/api/notifications` filtre par `user_id`
- ✅ Impossible de voir les notifications d'un autre utilisateur
- ✅ Le frontend affiche les bonnes notifications

---

## 🆘 EN CAS DE PROBLÈME

### Erreur : "Table notifications doesn't exist"
```bash
cd backend
npm run db:reset
npm run seed
```

### Erreur : "Cannot find module Notification"
Vérifiez que `backend/models/Notification.js` existe et que `backend/models/index.js` l'exporte.

### Notifications vides
Exécutez le script de test :
```bash
node scripts/testNotifications.js
```

---

## 📝 RÉSUMÉ

**AVANT** : Pas de notifications ou notifications partagées

**MAINTENANT** :
- ✅ Table `notifications` dans MySQL
- ✅ Chaque utilisateur voit UNIQUEMENT ses notifications
- ✅ Notifications créées automatiquement
- ✅ Sécurité garantie (filtrage par user_id)
- ✅ Fonctionne avec le frontend

**Tout est prêt ! Exécutez les commandes et testez.** 🎉
