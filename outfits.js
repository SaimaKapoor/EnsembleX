const router = require('express').Router();
const Outfit = require('../models/Outfit');
const verifyToken = require('../middlewares/verifyToken'); // Middleware for authentication

// Upload new outfit
router.post('/', verifyToken, async (req, res) => {
    try {
        const newOutfit = new Outfit({
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            user: req.user._id // User ID from authenticated token
        });
        const savedOutfit = await newOutfit.save();
        res.status(201).json(savedOutfit);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all outfits (for homepage - Image 2)
router.get('/', async (req, res) => {
    try {
        const outfits = await Outfit.find().populate('user', 'username profilePicture').sort({ createdAt: -1 });
        res.status(200).json(outfits);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a single outfit with comments (for detail page - Image 3)
router.get('/:id', async (req, res) => {
    try {
        const outfit = await Outfit.findById(req.params.id)
            .populate('user', 'username profilePicture')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username profilePicture'
                }
            });
        if (!outfit) return res.status(404).send('Outfit not found');
        res.status(200).json(outfit);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Like/Unlike an outfit
router.put('/:id/like', verifyToken, async (req, res) => {
    try {
        const outfit = await Outfit.findById(req.params.id);
        if (!outfit) return res.status(404).send('Outfit not found');

        if (outfit.likes.includes(req.user._id)) {
            outfit.likes.pull(req.user._id); // Unlike
        } else {
            outfit.likes.push(req.user._id); // Like
        }
        await outfit.save();
        res.status(200).json(outfit.likes);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add a comment
router.post('/:id/comment', verifyToken, async (req, res) => {
    try {
        const newComment = new Comment({
            text: req.body.text,
            user: req.user._id,
            outfit: req.params.id
        });
        const savedComment = await newComment.save();

        const outfit = await Outfit.findById(req.params.id);
        outfit.comments.push(savedComment._id);
        await outfit.save();

        // Populate user details for the returned comment
        const populatedComment = await Comment.findById(savedComment._id).populate('user', 'username profilePicture');

        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Save/Unsave an outfit (for user's saved ideas)
router.put('/:id/save', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send('User not found');

        const outfitId = req.params.id;
        if (user.savedOutfits.includes(outfitId)) {
            user.savedOutfits.pull(outfitId); // Unsave
        } else {
            user.savedOutfits.push(outfitId); // Save
        }
        await user.save();
        res.status(200).json(user.savedOutfits);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;