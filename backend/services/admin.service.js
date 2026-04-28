const { User, Post, Interaction } = require('../models');

const getAllUsers = () =>
  User.findAll({ attributes: { exclude: ['motDePasse'] }, order: [['created_at', 'DESC']] });

const setRole = async (userId, role) => {
  const allowed = ['CLIENT', 'MODERATEUR', 'ADMIN'];
  if (!allowed.includes(role)) throw { status: 400, message: 'Rôle invalide' };

  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: 'Utilisateur introuvable' };

  await user.update({ role });
  const { motDePasse: _, ...data } = user.toJSON();
  return data;
};

const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: 'Utilisateur introuvable' };
  // CASCADE supprime aussi ses posts et interactions
  await user.destroy();
};

/**
 * Modération : supprimer le contenu d'un post signalé
 * Si deleteAuthor = true → supprime aussi l'auteur (et tous ses posts en cascade)
 */
const moderatePost = async (postId, deleteAuthor = false) => {
  const post = await Post.findByPk(postId);
  if (!post) throw { status: 404, message: 'Post introuvable' };

  if (deleteAuthor) {
    const user = await User.findByPk(post.user_id);
    if (user) await user.destroy(); // cascade supprime posts + interactions
  } else {
    await post.destroy();
  }
};

module.exports = { getAllUsers, setRole, deleteUser, moderatePost };
