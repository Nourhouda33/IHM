require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { sequelize } = require('./models');
const errorHandler = require('./middlewares/error.middleware');

// ── Routes ────────────────────────────────────────────────────
const authRoutes         = require('./routes/auth.routes');
const postRoutes         = require('./routes/post.routes');
const interactionRoutes  = require('./routes/interaction.routes');
const topicRoutes        = require('./routes/topic.routes');
const adminRoutes        = require('./routes/admin.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middlewares globaux ───────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir les images uploadées
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/posts',         postRoutes);
app.use('/api/interactions',  interactionRoutes);
app.use('/api/topics',        topicRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'hkeya-backend', timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Route introuvable' });
});

// ── Gestion des erreurs ───────────────────────────────────────
app.use(errorHandler);

// ── Démarrage ─────────────────────────────────────────────────
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connecté');

    // sync({ force: true }) pour recréer les tables (⚠️ supprime les données)
    // sync({ alter: true }) pour mettre à jour sans supprimer
    if (process.env.NODE_ENV !== 'production') {
      // Utiliser force: true UNIQUEMENT la première fois ou si problème d'index
      await sequelize.sync({ force: false, alter: false });
      console.log('✅ Tables synchronisées');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Hkeya Backend → http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Impossible de démarrer :', err.message);
    process.exit(1);
  }
};

start();
