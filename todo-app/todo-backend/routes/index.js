const express = require('express');
const router = express.Router();
const redis = require('../redis');

let visits = 0;

router.get('/', (_req, res) => {
  visits++;
  res.json({ visits });
});

// Exercise 10: GET /statistics endpoint
router.get('/statistics', async (req, res) => {
  const count = await redis.get('added_todos');
  res.json({
    added_todos: count ? parseInt(count, 10) : 0
  });
});

module.exports = router;