const express = require('express');
const { signup, login, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { signupValidator, loginValidator } = require('../validators/authValidators');

const router = express.Router();

router.post('/signup', signupValidator, validationMiddleware, signup);
router.post('/login', loginValidator, validationMiddleware, login);
router.get('/me', authMiddleware, me);

module.exports = router;
