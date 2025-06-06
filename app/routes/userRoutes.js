const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.get('/', async (req, res) => {
  const users = await User.getAll();
  res.json(users);
});

router.post('/', async (req, res) => {
  const id = await User.create(req.body);
  res.status(201).json({ id });
});

module.exports = router;
