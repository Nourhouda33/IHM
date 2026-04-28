const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};

const me = (req, res) => {
  const user = req.user.toJSON ? req.user.toJSON() : req.user;
  delete user.motDePasse;
  res.json({
    ok: true,
    user: {
      ...user,
      username: user.pseudo,
      fullName: `${user.prenom} ${user.nom}`,
      firstName: user.prenom,
      lastName: user.nom,
      phone: user.telephone,
      avatar: user.avatar || user.pseudo?.charAt(0).toUpperCase() || 'U',
    }
  });
};

module.exports = { register, login, me };
