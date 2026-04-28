const router = require('express').Router();
const ctrl = require('../controllers/notification.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// GET /api/notifications
router.get('/', authenticate, ctrl.getAll);

// GET /api/notifications/unread-count
router.get('/unread-count', authenticate, ctrl.getUnreadCount);

// PATCH /api/notifications/read-all
router.patch('/read-all', authenticate, ctrl.markAllAsRead);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticate, ctrl.markAsRead);

// DELETE /api/notifications/:id
router.delete('/:id', authenticate, ctrl.deleteOne);

module.exports = router;
