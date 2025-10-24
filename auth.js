const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register (similar to Image 6 left)
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username, // You might need to add a username field to registration
            email: req.body.email,
            password: hashedPassword,
            name: req.body.fullName // Assuming fullName maps to name
        });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login (similar to Image 6 right)
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid Credentials');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalid Credentials');

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('auth-token', token).send({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;