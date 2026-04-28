/**
 * Middleware de gestion globale des erreurs
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message || err);

  // Erreur Sequelize de validation
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ ok: false, message: messages.join(', ') });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ ok: false, message: 'Token invalide ou expiré' });
  }

  const status = err.status || 500;
  const message = err.message || 'Erreur interne du serveur';
  res.status(status).json({ ok: false, message });
};

module.exports = errorHandler;
