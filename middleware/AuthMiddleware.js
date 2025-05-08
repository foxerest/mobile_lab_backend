const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Відсутній токен авторизації' });
        }

        const token = authHeader.split(' ')[1];

        const decodedToken = jwt.verify(token, JWT_SECRET);

        const existingUser = await User.findById(decodedToken.id).select('-password');

        if (!existingUser) {
            return res.status(401).json({ message: 'Користувача не знайдено' });
        }

        req.user = existingUser;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Недійсний або прострочений токен',
            error: error.message
        });
    }
};

module.exports = authMiddleware;
