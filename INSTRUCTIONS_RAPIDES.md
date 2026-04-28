# 🚀 INSTRUCTIONS RAPIDES - Démarrage Hkeya

## ⚠️ PROBLÈME ACTUEL
Votre backend crash avec : **"Too many keys specified; max 64 keys allowed"**

## ✅ SOLUTION EN 4 COMMANDES

Ouvrez un terminal dans le dossier `backend` et exécutez :

### 1️⃣ Arrêter le backend (si il tourne)
Appuyez sur `Ctrl+C` dans le terminal où tourne le backend

### 2️⃣ Réinitialiser la base de données
```bash
cd backend
npm run db:reset
```
✅ Cela va supprimer et recréer toutes les tables proprement

### 3️⃣ Remplir avec des données de test
```bash
npm run seed
```
✅ Cela va créer 4 utilisateurs, 4 topics, des posts et interactions

### 4️⃣ Redémarrer le backend
```bash
npm run dev
```
✅ Le backend devrait démarrer sans erreur !

---

## 🔐 COMPTES POUR SE CONNECTER

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| 👑 **Admin** | admin@hkeya.tn | Admin123! |
| 👮 **Modérateur** | moderateur@hkeya.tn | Modo123! |
| 👤 **Membre 1** | user1@hkeya.tn | User123! |
| 👤 **Membre 2** | user2@hkeya.tn | User123! |

---

## 🌐 DÉMARRER LE FRONTEND

Dans un **nouveau terminal** :

```bash
cd frontend
npm run dev
```

Puis ouvrez : **http://localhost:5173**

---

## 🧹 SI VOUS AVEZ DES ERREURS DANS LE FRONTEND

1. Ouvrez http://localhost:5173
2. Appuyez sur `F12` (console)
3. Tapez :
```javascript
localStorage.clear();
location.reload();
```

---

## ✅ VÉRIFIER QUE TOUT MARCHE

1. Backend : http://localhost:4000/api/health
   - Vous devez voir : `{"ok":true,"service":"hkeya-backend",...}`

2. Frontend : http://localhost:5173
   - Connectez-vous avec `admin@hkeya.tn` / `Admin123!`
   - Vous devez voir l'interface admin

---

## 📞 BESOIN D'AIDE ?

Si ça ne marche toujours pas, copiez-collez l'erreur complète !
