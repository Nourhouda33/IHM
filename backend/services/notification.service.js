const { Notification, User, Post } = require('../models');

/**
 * Créer une notification
 */
const createNotification = async (data) => {
  try {
    const { user_id, from_user_id, post_id, type, message } = data;
    
    // Ne pas créer de notification si l'utilisateur se notifie lui-même
    if (user_id === from_user_id) return null;
    
    const notification = await Notification.create({
      user_id,
      from_user_id,
      post_id,
      type,
      message,
      lu: false,
    });
    
    return notification;
  } catch (err) {
    console.error('Erreur création notification:', err);
    return null;
  }
};

/**
 * Récupérer les notifications d'un utilisateur
 */
const getUserNotifications = async (userId) => {
  const notifications = await Notification.findAll({
    where: { user_id: userId },
    include: [
      {
        model: User,
        as: 'expediteur',
        attributes: ['id', 'pseudo', 'avatar'],
      },
      {
        model: Post,
        as: 'post',
        attributes: ['id', 'texte'],
      },
    ],
    order: [['created_at', 'DESC']],
    limit: 50,
  });

  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    message: n.message,
    lu: n.lu,
    createdAt: n.created_at,
    expediteur: n.expediteur
      ? {
          id: n.expediteur.id,
          pseudo: n.expediteur.pseudo,
          avatar: n.expediteur.avatar,
        }
      : null,
    post: n.post
      ? {
          id: n.post.id,
          texte: n.post.texte?.substring(0, 50) + '...',
        }
      : null,
  }));
};

/**
 * Marquer une notification comme lue
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId },
  });

  if (!notification) {
    throw new Error('Notification introuvable');
  }

  notification.lu = true;
  await notification.save();

  return notification;
};

/**
 * Marquer toutes les notifications comme lues
 */
const markAllAsRead = async (userId) => {
  await Notification.update(
    { lu: true },
    { where: { user_id: userId, lu: false } }
  );
};

/**
 * Compter les notifications non lues
 */
const countUnread = async (userId) => {
  const count = await Notification.count({
    where: { user_id: userId, lu: false },
  });
  return count;
};

/**
 * Supprimer une notification
 */
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId },
  });

  if (!notification) {
    throw new Error('Notification introuvable');
  }

  await notification.destroy();
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  countUnread,
  deleteNotification,
};
