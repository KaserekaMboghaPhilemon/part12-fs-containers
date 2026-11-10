const express = require('express');
const router = express.Router();
const redis = require('../redis')

let visits = 0;

router.get('/', (_req, res) => {
  visits++;
  res.json({ visits });
});

module.exports = router;