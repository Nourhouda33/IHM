const adminService = require('../services/admin.service');

const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({ ok: true, users });
  } catch (err) {
    next(err);
  }
};

const setRole = async (req, res, next) => {
  try {
    const user = await adminService.setRole(req.params.id, req.body.role);
    res.json({ ok: true, user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({ ok: true, message: 'Utilisateur supprimé' });
  } catch (err) {
    next(err);
  }
};

const moderatePost = async (req, res, next) => {
  try {
    const deleteAuthor = req.body.deleteAuthor === true;
    await adminService.moderatePost(req.params.postId, deleteAuthor);
    res.json({ ok: true, message: deleteAuthor ? 'Post et auteur supprimés' : 'Post supprimé' });
  } catch (err) {
    next(err);
  }
};

const suspendUser = async (req, res, next) => {
  try {
    const { User } = require('../models');
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ ok: false, message: 'Utilisateur introuvable' });
    if (user.role === 'ADMIN') return res.status(403).json({ ok: false, message: 'Impossible de suspendre un administrateur' });
    await user.update({ suspendu: true });
    res.json({ ok: true, message: `${user.pseudo} suspendu` });
  } catch (err) { next(err); }
};

const unsuspendUser = async (req, res, next) => {
  try {
    const { User } = require('../models');
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ ok: false, message: 'Utilisateur introuvable' });
    await user.update({ suspendu: false });
    res.json({ ok: true, message: `${user.pseudo} réactivé` });
  } catch (err) { next(err); }
};

module.exports = { getUsers, setRole, deleteUser, moderatePost, suspendUser, unsuspendUser };
