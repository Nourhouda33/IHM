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
  const user = req.user.toJSON ? req.user.toJSON() : { ...req.user };
  delete user.motDePasse;
  res.json({
    ok: true,
    user: {
      ...user,
      username: user.pseudo,
      fullName: `${user.prenom || ''} ${user.nom || ''}`.trim(),
      firstName: user.prenom,
      lastName: user.nom,
      phone: user.telephone,
      avatar: user.avatar || user.pseudo?.charAt(0).toUpperCase() || 'U',
    }
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.json({ ok: true, user });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body);
    res.json({ ok: true, message: 'Mot de passe changé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me, updateProfile, changePassword };
