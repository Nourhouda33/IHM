const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Toutes les routes admin nécessitent le rôle ADMIN
router.use(authenticate, authorize('ADMIN'));

// GET /api/admin/users
router.get('/users', ctrl.getUsers);

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', ctrl.setRole);

// DELETE /api/admin/users/:id
router.delete('/users/:id', ctrl.deleteUser);

// DELETE /api/admin/posts/:postId/moderer
router.delete('/posts/:postId/moderer', ctrl.moderatePost);

module.exports = router;
