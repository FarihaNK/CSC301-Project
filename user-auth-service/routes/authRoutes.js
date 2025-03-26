const express = require('express');
const { register, login, getUser } = require('../controllers/authContoller.js');
const {resetPassword, forgotPassword} = require('../controllers/passResetController.js')
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getUser);

router.post("/forgot-password", forgotPassword); //send reset email
router.post("/reset-password/:token", resetPassword); //reset password using token

module.exports = router;
