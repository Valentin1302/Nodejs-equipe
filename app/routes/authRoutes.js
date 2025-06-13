const express = require('express');
const router = express.Router();

router.post('/auth/register', (req, res) => {
  res.json({ message: 'Register route V2' });
});
router.get('/auth/register', (req, res) => {
  res.json({ message: 'Register route V2 get' });
});

module.exports = router;
