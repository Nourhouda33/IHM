const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/topic.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// GET /api/topics  (public après auth)
router.get('/', authenticate, ctrl.getAll);

// POST /api/topics  (admin seulement)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  [body('nom').notEmpty().withMessage('Le nom du topic est requis')],
  validate,
  ctrl.create
);

// PUT /api/topics/:id  (admin seulement)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  [body('nom').notEmpty().withMessage('Le nom du topic est requis')],
  validate,
  ctrl.update
);

// DELETE /api/topics/:id  (admin seulement)
router.delete('/:id', authenticate, authorize('ADMIN'), ctrl.remove);

module.exports = router;
