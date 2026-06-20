const { body, validationResult } = require('express-validator');

const validateAddLink = [
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isString()
    .withMessage('URL must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }
    next();
  },
];

module.exports = { validateAddLink };
