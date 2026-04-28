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

// DELETE /api/interactions/signalements/:id/ignorer  — ignorer un signalement
router.delete('/signalements/:id/ignorer', authenticate, authorize('MODERATEUR', 'ADMIN'), ctrl.ignorerSignalement);

// POST /api/interactions/signalements/:id/supprimer-post  — supprimer le post signalé
router.post('/signalements/:id/supprimer-post', authenticate, authorize('MODERATEUR', 'ADMIN'), ctrl.supprimerPostSignale);

// POST /api/interactions/signalements/:id/suspendre-user  — suspendre l'auteur
router.post('/signalements/:id/suspendre-user', authenticate, authorize('MODERATEUR', 'ADMIN'), ctrl.suspendreUser);

// GET /api/interactions/post/:postId/comments
router.get('/post/:postId/comments', authenticate, ctrl.getComments);

// GET /api/interactions/liked — posts likés par l'utilisateur connecté
router.get('/liked', authenticate, ctrl.getLikedPosts);

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
