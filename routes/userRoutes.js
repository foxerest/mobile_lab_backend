const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/UserController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/me', authMiddleware, (req, res) => {
    res.json(req.user);
});

module.exports = router;
