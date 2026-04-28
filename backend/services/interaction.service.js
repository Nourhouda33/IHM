const { Interaction, Post, User } = require('../models');
const notificationService = require('./notification.service');

const addInteraction = async ({ user_id, post_id, type, contenu, raison }) => {
  const post = await Post.findByPk(post_id);
  if (!post) throw { status: 404, message: 'Post introuvable' };

  // Un seul LIKE ou DISLIKE par user/post
  if (type === 'LIKE' || type === 'DISLIKE') {
    const existing = await Interaction.findOne({
      where: { user_id, post_id, type },
    });
    if (existing) throw { status: 409, message: `Vous avez déjà mis un ${type} sur ce post` };
  }

  if (type === 'COMMENTAIRE' && !contenu?.trim()) {
    throw { status: 400, message: 'Le contenu du commentaire est requis' };
  }

  if (type === 'SIGNALEMENT' && !raison?.trim()) {
    throw { status: 400, message: 'La raison du signalement est requise' };
  }

  const interaction = await Interaction.create({ user_id, post_id, type, contenu, raison });

  // ── Créer une notification pour l'auteur du post ──
  const author = await User.findByPk(user_id, { attributes: ['pseudo'] });
  const authorName = author?.pseudo || 'Quelqu\'un';

  let notificationMessage = '';
  switch (type) {
    case 'LIKE':
      notificationMessage = `${authorName} a aimé votre publication`;
      break;
    case 'DISLIKE':
      notificationMessage = `${authorName} n'a pas aimé votre publication`;
      break;
    case 'COMMENTAIRE':
      notificationMessage = `${authorName} a commenté votre publication`;
      break;
    case 'SIGNALEMENT':
      notificationMessage = `${authorName} a signalé votre publication`;
      break;
  }

  if (notificationMessage) {
    await notificationService.createNotification({
      user_id: post.user_id, // Destinataire = auteur du post
      from_user_id: user_id,  // Expéditeur = celui qui interagit
      post_id: post_id,
      type: type,
      message: notificationMessage,
    });
  }

  return interaction;
};

const deleteInteraction = async (id, userId, role) => {
  const interaction = await Interaction.findByPk(id);
  if (!interaction) throw { status: 404, message: 'Interaction introuvable' };

  if (interaction.user_id !== userId && role === 'CLIENT') {
    throw { status: 403, message: 'Accès refusé' };
  }

  await interaction.destroy();
};

const getSignalements = async () => {
  return Interaction.findAll({
    where: { type: 'SIGNALEMENT' },
    include: [
      { model: User, as: 'auteur', attributes: ['id', 'pseudo', 'avatar'] },
      { model: Post, as: 'post', attributes: ['id', 'texte', 'user_id'] },
    ],
    order: [['created_at', 'DESC']],
  });
};

const getComments = async (postId) => {
  return Interaction.findAll({
    where: { post_id: postId, type: 'COMMENTAIRE' },
    include: [
      { model: User, as: 'auteur', attributes: ['id', 'pseudo', 'avatar'] },
    ],
    order: [['created_at', 'ASC']],
  });
};

module.exports = { addInteraction, deleteInteraction, getSignalements, getComments };
