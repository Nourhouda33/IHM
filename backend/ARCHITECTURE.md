# 🏗️ Architecture Backend Hkeya

## 📐 Architecture MVC

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React)                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/JSON + JWT
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    ROUTES (Express)                      │
│  ┌──────────┬──────────┬──────────┬──────────┬────────┐ │
│  │   Auth   │  Posts   │Interact. │  Topics  │ Admin  │ │
│  └──────────┴──────────┴──────────┴──────────┴────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   MIDDLEWARES                            │
│  • authenticate (JWT)                                    │
│  • authorize (rôles)                                     │
│  • validate (express-validator)                          │
│  • errorHandler                                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   CONTROLLERS                            │
│  • Reçoivent req/res                                     │
│  • Appellent les services                                │
│  • Renvoient les réponses JSON                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVICES                              │
│  • Logique métier                                        │
│  • Validation des règles                                 │
│  • Appels aux modèles                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  MODELS (Sequelize)                      │
│  • User, Topic, Post, Interaction                        │
│  • Associations (hasMany, belongsTo)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   MySQL Database                         │
│  • users, topics, posts, interactions                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Flux d'Authentification

```
1. Client → POST /api/auth/register
   ↓
2. Controller → authService.register()
   ↓
3. Service → bcrypt.hash(password)
   ↓
4. Service → User.create()
   ↓
5. Service → jwt.sign({ id, role })
   ↓
6. Controller → res.json({ token, user })
   ↓
7. Client stocke token dans localStorage
   ↓
8. Client → GET /api/posts (Header: Authorization: Bearer <token>)
   ↓
9. Middleware authenticate → jwt.verify(token)
   ↓
10. Middleware → req.user = user
   ↓
11. Controller → postService.getAllPosts()
   ↓
12. Service → Post.findAll({ where: { statut: true } })
   ↓
13. Controller → res.json({ posts })
```

---

## 🗂️ Relations Sequelize

### User ↔ Post
```javascript
User.hasMany(Post, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'auteur' });
```
- Un utilisateur peut avoir plusieurs posts
- Si l'utilisateur est supprimé → tous ses posts sont supprimés

### Topic ↔ Post
```javascript
Topic.hasMany(Post, { foreignKey: 'topic_id', onDelete: 'RESTRICT' });
Post.belongsTo(Topic, { foreignKey: 'topic_id', as: 'topic' });
```
- Un topic contient plusieurs posts
- On ne peut pas supprimer un topic s'il a des posts (RESTRICT)

### User ↔ Interaction
```javascript
User.hasMany(Interaction, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Interaction.belongsTo(User, { foreignKey: 'user_id', as: 'auteur' });
```

### Post ↔ Interaction
```javascript
Post.hasMany(Interaction, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Interaction.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });
```

---

## 🛡️ Middlewares

### 1. `authenticate`
Vérifie le JWT et attache `req.user`

```javascript
const token = req.headers.authorization.slice(7); // "Bearer xxx"
const decoded = jwt.verify(token, JWT_SECRET);
req.user = await User.findByPk(decoded.id);
```

### 2. `authorize(...roles)`
Vérifie que `req.user.role` est dans la liste autorisée

```javascript
authorize('ADMIN', 'MODERATEUR')
// → Bloque si role = 'CLIENT'
```

### 3. `validate`
Récupère les erreurs de `express-validator`

```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(422).json({ errors });
```

### 4. `errorHandler`
Catch global des erreurs

```javascript
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});
```

---

## 📊 Calcul Dynamique des Compteurs

Les likes/dislikes/commentaires ne sont **pas stockés** dans la table `posts`.  
Ils sont calculés dynamiquement via Sequelize :

```javascript
Post.findAll({
  attributes: {
    include: [
      [fn('COUNT', literal("CASE WHEN interactions.type = 'LIKE' THEN 1 END")), 'likesCount'],
      [fn('COUNT', literal("CASE WHEN interactions.type = 'DISLIKE' THEN 1 END")), 'dislikesCount'],
      [fn('COUNT', literal("CASE WHEN interactions.type = 'COMMENTAIRE' THEN 1 END")), 'commentsCount'],
    ],
  },
  include: [{ model: Interaction, attributes: [] }],
  group: ['Post.id'],
});
```

---

## 🔄 Gestion des Rôles

| Rôle | Permissions |
|------|-------------|
| **CLIENT** | Créer posts, liker, commenter, signaler |
| **MODERATEUR** | + Valider posts, voir signalements, supprimer posts |
| **ADMIN** | + Gérer users, gérer topics, changer rôles, modérer |

---

## 🚨 Règles de Modération

### Validation de post
- Seuls MODERATEUR et ADMIN peuvent valider
- `statut: false` → `statut: true`

### Suppression de post signalé
```javascript
DELETE /api/admin/posts/:postId/moderer
Body: { deleteAuthor: false }  → Supprime le post uniquement
Body: { deleteAuthor: true }   → Supprime le post + l'auteur + tous ses posts
```

---

## 📦 Upload d'Images

Utilise **multer** pour stocker les images dans `backend/uploads/`

```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
```

Les images sont servies via :
```javascript
app.use('/uploads', express.static('uploads'));
```

URL d'accès : `http://localhost:4000/uploads/1234567890-image.jpg`

---

## 🧪 Tests Recommandés

### 1. Tester l'authentification
```bash
# Register
POST /api/auth/register
# Login
POST /api/auth/login
# Me
GET /api/auth/me (avec token)
```

### 2. Tester les posts
```bash
# Créer un post
POST /api/posts (CLIENT)
# Valider le post
PATCH /api/posts/:id/valider (MODERATEUR)
# Voir les posts
GET /api/posts
```

### 3. Tester les interactions
```bash
# Like
POST /api/interactions { type: "LIKE", post_id: 1 }
# Commentaire
POST /api/interactions { type: "COMMENTAIRE", post_id: 1, contenu: "..." }
# Signalement
POST /api/interactions { type: "SIGNALEMENT", post_id: 1, raison: "..." }
```

### 4. Tester l'admin
```bash
# Changer rôle
PATCH /api/admin/users/:id/role { role: "MODERATEUR" }
# Supprimer user
DELETE /api/admin/users/:id
```

---

## 🔧 Configuration Avancée

### CORS
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
```

### JWT Expiration
Configurable dans `.env` :
```env
JWT_EXPIRES_IN=7d  # 7 jours
JWT_EXPIRES_IN=24h # 24 heures
JWT_EXPIRES_IN=30m # 30 minutes
```

### Sequelize Sync
En développement : `sync({ alter: true })` → met à jour les tables  
En production : utiliser des migrations Sequelize

---

## 📈 Améliorations Futures

- [ ] Pagination des posts
- [ ] Recherche full-text
- [ ] Notifications en temps réel (WebSocket)
- [ ] Rate limiting (express-rate-limit)
- [ ] Compression des réponses (compression)
- [ ] Logs structurés (winston)
- [ ] Tests unitaires (Jest)
- [ ] CI/CD (GitHub Actions)
- [ ] Docker + docker-compose
- [ ] Migrations Sequelize
- [ ] Cache Redis pour les posts populaires

---

## 📞 Support

Pour toute question : **admin@hkeya.tn**
