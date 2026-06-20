const express = require('express');
const router = express.Router();
const { addLink, getLinksByDate, getActiveDates, deleteLink } = require('../controllers/linkController');
const { postLinkLimiter } = require('../middleware/rateLimiter');
const { validateAddLink } = require('../middleware/validateRequest');

// GET /api/links/dates must come before GET /api/links/:anything
router.get('/dates', getActiveDates);

router
  .route('/')
  .get(getLinksByDate)
  .post(postLinkLimiter, validateAddLink, addLink);

router.delete('/:id', deleteLink);

module.exports = router;
