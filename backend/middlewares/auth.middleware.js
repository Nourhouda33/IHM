const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Vérifie le JWT et attache req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'Token manquant' });
    }

    const token = authHeader.slice(7).trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['motDePasse'] },
    });

    if (!user) {
      return res.status(401).json({ ok: false, message: 'Utilisateur introuvable' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'Token invalide ou expiré' });
  }
};

/**
 * Autorise uniquement certains rôles
 * Usage : authorize('ADMIN') ou authorize('MODERATEUR', 'ADMIN')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Accepte les deux formats : 'ADMIN' et 'Administrateur'
    const roleAliases = {
      'Administrateur': 'ADMIN',
      'Moderateur': 'MODERATEUR',
      'Membre': 'CLIENT',
    };
    const userRole = req.user?.role;
    const normalizedRole = roleAliases[userRole] || userRole;

    if (!userRole || !roles.includes(normalizedRole)) {
      return res.status(403).json({ ok: false, message: 'Accès refusé' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
