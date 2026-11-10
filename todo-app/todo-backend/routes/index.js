const express = require('express');
const router = express.Router();

let visits = 0;

router.get('/', (_req, res) => {
  visits++;
  res.json({ visits });
});

module.exports = router;