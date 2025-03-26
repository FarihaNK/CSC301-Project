const express = require('express');
const { register, login, getUser } = require('../controllers/authContoller.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getUser);

module.exports = router;
