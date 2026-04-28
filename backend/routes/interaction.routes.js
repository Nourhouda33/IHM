const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/interaction.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// GET /api/interactions/signalements  (modérateur / admin)
router.get(
  '/signalements',
  authenticate,
  authorize('MODERATEUR', 'ADMIN'),
  ctrl.signalements
);

// GET /api/interactions/post/:postId/comments
router.get('/post/:postId/comments', authenticate, ctrl.getComments);

// POST /api/interactions
router.post(
  '/',
  authenticate,
  [
    body('post_id').notEmpty().withMessage('post_id requis'),
    body('type')
      .isIn(['LIKE', 'DISLIKE', 'COMMENTAIRE', 'SIGNALEMENT'])
      .withMessage('Type invalide'),
  ],
  validate,
  ctrl.add
);

// DELETE /api/interactions/:id
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;
