const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/post.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const multer = require('multer');
const path = require('path');

// Config upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/posts
router.get('/', authenticate, ctrl.getAll);

// GET /api/posts/approved (alias)
router.get('/approved', authenticate, ctrl.getAll);

// GET /api/posts/mine — posts de l'utilisateur connecté
router.get('/mine', authenticate, ctrl.getMine);

// GET /api/posts/pending (modérateur / admin)
router.get('/pending', authenticate, authorize('MODERATEUR', 'ADMIN'), ctrl.getPending);

// POST /api/posts
router.post(
  '/',
  authenticate,
  upload.single('image'),
  [body('topic_id').optional().isInt().withMessage('topic_id doit être un entier')],
  validate,
  ctrl.create
);

// PUT /api/posts/:id
router.put('/:id', authenticate, ctrl.update);

// DELETE /api/posts/:id
router.delete('/:id', authenticate, ctrl.remove);

// POST /api/posts/:postId/approve  (modérateur / admin)
router.post(
  '/:id/approve',
  authenticate,
  authorize('MODERATEUR', 'ADMIN'),
  ctrl.validate
);

// POST /api/posts/:postId/reject  (modérateur / admin)
router.post(
  '/:id/reject',
  authenticate,
  authorize('MODERATEUR', 'ADMIN'),
  ctrl.reject
);

module.exports = router;
