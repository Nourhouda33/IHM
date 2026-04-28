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

module.exports = { getUsers, setRole, deleteUser, moderatePost };
