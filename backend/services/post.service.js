const { Post, User, Topic, Interaction } = require('../models');
const notificationService = require('./notification.service');

const getAllPosts = async () => {
  const posts = await Post.findAll({
    where: { statut: true },
    include: [
      { model: User, as: 'auteur', attributes: ['id', 'pseudo', 'avatar', 'role'] },
      { model: Topic, as: 'topic', attributes: ['id', 'nom'] },
      { model: Interaction, as: 'Interactions', attributes: ['id', 'type'] },
    ],
    order: [['created_at', 'DESC']],
  });

  return posts.map(p => {
    const interactions = p.Interactions || [];
    const json = p.toJSON();
    return {
      ...json,
      author: json.auteur?.pseudo || 'Anonyme',
      authorAvatar: (json.auteur?.avatar || json.auteur?.pseudo?.charAt(0) || 'A').charAt(0).toUpperCase(),
      content: json.texte || '',
      topic: json.topic?.nom || '',
      createdAt: json.created_at,
      likesCount: interactions.filter(i => i.type === 'LIKE').length,
      dislikesCount: interactions.filter(i => i.type === 'DISLIKE').length,
      commentsCount: interactions.filter(i => i.type === 'COMMENTAIRE').length,
      signalementsCount: interactions.filter(i => i.type === 'SIGNALEMENT').length,
      Interactions: undefined,
    };
  });
};

const getPendingPosts = async () => {
  const posts = await Post.findAll({
    where: { statut: false },
    include: [
      { model: User, as: 'auteur', attributes: ['id', 'pseudo', 'avatar', 'role'] },
      { model: Topic, as: 'topic', attributes: ['id', 'nom'] },
    ],
    order: [['created_at', 'DESC']],
  });

  return posts.map(p => {
    const j = p.toJSON();
    return {
      ...j,
      author: j.auteur?.pseudo || 'Anonyme',
      authorAvatar: (j.auteur?.avatar || j.auteur?.pseudo?.charAt(0) || 'A').charAt(0).toUpperCase(),
      content: j.texte || '',
      topic: j.topic?.nom || '',
      createdAt: j.created_at,
    };
  });
};

const createPost = async ({ user_id, topic_id, texte, image, topic }) => {
  let resolvedTopicId = topic_id ? parseInt(topic_id) : null;

  if (!resolvedTopicId && topic) {
    const found = await Topic.findOne({ where: { nom: topic } });
    if (found) resolvedTopicId = found.id;
  }

  if (!resolvedTopicId) {
    const first = await Topic.findOne({ order: [['id', 'ASC']] });
    if (first) resolvedTopicId = first.id;
  }

  const topicRecord = await Topic.findByPk(resolvedTopicId);
  if (!topicRecord) throw { status: 404, message: 'Aucun topic trouvé. Lancez: node scripts/seed.js' };

  const post = await Post.create({ user_id, topic_id: resolvedTopicId, texte, image, statut: false });

  // ── Notifier tous les modérateurs et admins qu'un nouveau post est en attente ──
  const moderators = await User.findAll({
    where: {
      role: ['MODERATEUR', 'ADMIN']
    },
    attributes: ['id']
  });

  const author = await User.findByPk(user_id, { attributes: ['pseudo'] });
  const authorName = author?.pseudo || 'Un utilisateur';

  // Créer une notification pour chaque modérateur/admin
  for (const moderator of moderators) {
    await notificationService.createNotification({
      user_id: moderator.id,
      from_user_id: user_id,
      post_id: post.id,
      type: 'NOUVEAU_POST',
      message: `${authorName} a créé une nouvelle publication en attente de validation`,
    });
  }

  return post;
};

const updatePost = async (id, userId, role, { texte, image }) => {
  const post = await Post.findByPk(id);
  if (!post) throw { status: 404, message: 'Post introuvable' };
  if (post.user_id !== userId && role === 'CLIENT') throw { status: 403, message: 'Accès refusé' };
  await post.update({ texte, image });
  return post;
};

const deletePost = async (id, userId, role) => {
  const post = await Post.findByPk(id);
  if (!post) throw { status: 404, message: 'Post introuvable' };
  if (post.user_id !== userId && role === 'CLIENT') throw { status: 403, message: 'Accès refusé' };
  await post.destroy();
};

const validatePost = async (id, moderatorId) => {
  const post = await Post.findByPk(id);
  if (!post) throw { status: 404, message: 'Post introuvable' };
  await post.update({ statut: true });
  
  // ── Créer une notification pour l'auteur du post ──
  await notificationService.createNotification({
    user_id: post.user_id,
    from_user_id: moderatorId,
    post_id: post.id,
    type: 'POST_VALIDE',
    message: 'Votre publication a été validée par un modérateur',
  });
  
  return post;
};

const rejectPost = async (id, moderatorId) => {
  const post = await Post.findByPk(id);
  if (!post) throw { status: 404, message: 'Post introuvable' };
  
  // ── Créer une notification avant de supprimer ──
  await notificationService.createNotification({
    user_id: post.user_id,
    from_user_id: moderatorId,
    post_id: null, // Le post va être supprimé
    type: 'POST_REJETE',
    message: 'Votre publication a été rejetée par un modérateur',
  });
  
  await post.destroy();
};

const getMyPosts = async (userId) => {
  const posts = await Post.findAll({
    where: { user_id: userId },
    include: [
      { model: Topic, as: 'topic', attributes: ['id', 'nom'] },
    ],
    order: [['created_at', 'DESC']],
  });
  return posts.map(p => {
    const j = p.toJSON();
    return { ...j, content: j.texte || '', topic: j.topic?.nom || '', createdAt: j.created_at };
  });
};

module.exports = { getAllPosts, getPendingPosts, getMyPosts, createPost, updatePost, deletePost, validatePost, rejectPost };
