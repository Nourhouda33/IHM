const { validationResult } = require('express-validator');

/**
 * Récupère les erreurs de express-validator et renvoie 422 si invalide
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      ok: false,
      message: 'Données invalides',
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }
  next();
};

module.exports = validate;
