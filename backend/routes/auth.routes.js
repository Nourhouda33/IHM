const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// POST /api/auth/register
router.post(
  '/register',
  [
    body('nom').optional().notEmpty().withMessage('Le nom est requis'),
    body('lastName').optional().notEmpty().withMessage('Le nom est requis'),
    body('prenom').optional().notEmpty().withMessage('Le prénom est requis'),
    body('firstName').optional().notEmpty().withMessage('Le prénom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('pseudo').optional().notEmpty().withMessage('Le pseudo est requis'),
    body('username').optional().notEmpty().withMessage('Le pseudo est requis'),
    body('motDePasse').optional().isLength({ min: 6 }).withMessage('Mot de passe min 6 caractères'),
    body('password').optional().isLength({ min: 6 }).withMessage('Mot de passe min 6 caractères'),
  ],
  validate,
  ctrl.register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('identifier').optional().notEmpty().withMessage('Identifiant requis'),
    body('email').optional().isEmail().withMessage('Email invalide'),
    body('password').optional().notEmpty().withMessage('Mot de passe requis'),
    body('motDePasse').optional().notEmpty().withMessage('Mot de passe requis'),
  ],
  validate,
  ctrl.login
);

// GET /api/auth/me
router.get('/me', authenticate, ctrl.me);

module.exports = router;
