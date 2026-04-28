# 🔧 Test du Login Corrigé

## ✅ Corrections Appliquées

Le backend accepte maintenant **les deux formats** :

### Format Frontend (actuel)
```json
{
  "identifier": "admin@hkeya.tn",
  "password": "password123"
}
```

### Format Backend (original)
```json
{
  "email": "admin@hkeya.tn",
  "motDePasse": "password123"
}
```

---

## 🧪 Test Rapide

### Option 1 : Avec PowerShell

```powershell
$body = @{
    identifier = "admin@hkeya.tn"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

### Option 2 : Avec le fichier HTML

Ouvre `backend/test-browser.html` dans ton navigateur et clique sur **Login**.

### Option 3 : Avec curl

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"admin@hkeya.tn\",\"password\":\"password123\"}"
```

---

## 🔄 Si le Backend ne Redémarre pas

Si tu as lancé avec `npm run dev`, nodemon devrait redémarrer automatiquement.

Sinon, arrête et relance :

```bash
# Dans le terminal backend
Ctrl+C
npm run dev
```

---

## ✅ Résultat Attendu

```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nom": "Kchaou",
    "prenom": "Mahmoud",
    "email": "admin@hkeya.tn",
    "telephone": "+21620000001",
    "pseudo": "AdminHkeya",
    "avatar": "M",
    "veut_etre_moderateur": false,
    "role": "ADMIN",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

## 📝 Changements Effectués

### 1. `backend/routes/auth.routes.js`
- Accepte maintenant `identifier` OU `email`
- Accepte maintenant `password` OU `motDePasse`

### 2. `backend/services/auth.service.js`
- `login()` : Support des deux formats
- `register()` : Support de `firstName/lastName/username/phone` en plus de `prenom/nom/pseudo/telephone`

---

## 🚀 Prochaine Étape

Une fois le login fonctionnel, le frontend devrait pouvoir :
1. ✅ Se connecter
2. ✅ Récupérer les posts
3. ✅ Créer des posts
4. ✅ Ajouter des interactions

---

Teste maintenant et dis-moi si ça fonctionne ! 🎯
