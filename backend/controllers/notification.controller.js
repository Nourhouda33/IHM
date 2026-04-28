const notificationService = require('../services/notification.service');

/**
 * GET /api/notifications
 * Récupérer les notifications de l'utilisateur connecté
 */
const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getUserNotifications(userId);
    
    res.json({ ok: true, notifications });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/notifications/unread-count
 * Compter les notifications non lues
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await notificationService.countUnread(userId);
    
    res.json({ ok: true, count });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Marquer une notification comme lue
 */
const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id);
    
    await notificationService.markAsRead(notificationId, userId);
    
    res.json({ ok: true, message: 'Notification marquée comme lue' });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/read-all
 * Marquer toutes les notifications comme lues
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await notificationService.markAllAsRead(userId);
    
    res.json({ ok: true, message: 'Toutes les notifications marquées comme lues' });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications/:id
 * Supprimer une notification
 */
const deleteOne = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id);
    
    await notificationService.deleteNotification(notificationId, userId);
    
    res.json({ ok: true, message: 'Notification supprimée' });
  } catch (err) {
    next(err);
  }
};

module.exports = { 
  getAll, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteOne 
};
