const express = require('express');
const { register, login, getUser , getDoctors} = require('../controllers/authContoller.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getUser);
router.get("/doctors", authMiddleware, getDoctors);

module.exports = router;
