# 🎯 AIDE-MÉMOIRE HKEYA

## 🚨 ERREUR ACTUELLE
```
❌ Impossible de démarrer : Too many keys specified; max 64 keys allowed
```

## ✅ SOLUTION (3 commandes)
```bash
cd backend
npm run db:reset    # Réinitialise la base
npm run seed        # Remplit avec des données
npm run dev         # Démarre le backend
```

---

## 🔐 COMPTES DE TEST

```
👑 Admin:      admin@hkeya.tn / Admin123!
👮 Modérateur: moderateur@hkeya.tn / Modo123!
👤 Membre:     user1@hkeya.tn / User123!
```

---

## 🚀 DÉMARRAGE

### Option 1 : Tout démarrer
```bash
npm run dev
```

### Option 2 : Séparément
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

---

## 🧹 NETTOYER LE FRONTEND

Console (F12) :
```javascript
localStorage.clear();
location.reload();
```

---

## 🔍 VÉRIFICATIONS

✅ Backend : http://localhost:4000/api/health
✅ Frontend : http://localhost:5173
✅ MySQL : XAMPP doit être démarré

---

## 📝 COMMANDES UTILES

```bash
cd backend

npm run dev        # Démarre le backend
npm run db:reset   # ⚠️ Réinitialise la base
npm run seed       # Remplit avec des données
```

---

## 🆘 EN CAS DE PROBLÈME

1. ✅ XAMPP MySQL démarré ?
2. ✅ Base `hkeya_db` existe ?
3. ✅ `npm run db:reset` exécuté ?
4. ✅ `npm run seed` exécuté ?
5. ✅ localStorage nettoyé ?

---

## 📂 FICHIERS IMPORTANTS

- `backend/.env` - Configuration
- `backend/server.js` - Point d'entrée
- `backend/models/index.js` - Associations
- `frontend/public/whisper-original.html` - Interface

---

## 🎯 ORDRE D'EXÉCUTION

1. Arrêter le backend (`Ctrl+C`)
2. `cd backend`
3. `npm run db:reset`
4. `npm run seed`
5. `npm run dev`
6. Ouvrir http://localhost:5173
7. Se connecter avec admin@hkeya.tn / Admin123!

---

**C'est tout ! 🎉**
