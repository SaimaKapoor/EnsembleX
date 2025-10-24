const router = require('express').Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/verifyToken');

// Get user profile (for Image 7 layout)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password
        if (!user) return res.status(404).send('User not found');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update user profile
router.put('/:id', verifyToken, async (req, res) => {
    if (req.user._id !== req.params.id) return res.status(403).send('You can only update your own profile!');
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select('-password');
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get user's saved outfits (for Image 4)
router.get('/:id/saved', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('savedOutfits');
        if (!user) return res.status(404).send('User not found');
        res.status(200).json(user.savedOutfits);
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;