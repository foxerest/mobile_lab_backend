const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            tasks: [],
            categories: [{ name: 'General' }]
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Помилка під час реєстрації', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Невірний пароль' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        console.log(token)
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Помилка входу', error: error.message });
    }
};
