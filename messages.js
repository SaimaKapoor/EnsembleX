const router = require('express').Router();
const Message = require('../models/Message');
const verifyToken = require('../middlewares/verifyToken');

// Send a new message
router.post('/', verifyToken, async (req, res) => {
    try {
        const newMessage = new Message({
            sender: req.user._id,
            receiver: req.body.receiverId,
            content: req.body.content,
            outfitShared: req.body.outfitId || null
        });
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get messages for a user (Inbox - Image 5)
router.get('/:userId', verifyToken, async (req, res) => {
    if (req.user._id !== req.params.userId) return res.status(403).send('Unauthorized');
    try {
        const messages = await Message.find({
            $or: [{ sender: req.params.userId }, { receiver: req.params.userId }]
        })
        .populate('sender', 'username profilePicture')
        .populate('receiver', 'username profilePicture')
        .populate('outfitShared')
        .sort({ createdAt: -1 });

        // Group messages into conversations or unique senders/receivers
        const conversationsMap = new Map();
        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === req.params.userId ? msg.receiver : msg.sender;
            if (!conversationsMap.has(otherUser._id.toString())) {
                conversationsMap.set(otherUser._id.toString(), {
                    otherUser: otherUser,
                    lastMessage: msg,
                    count: 1 // Example for unread count
                });
            } else {
                // Update last message if newer
                const existing = conversationsMap.get(otherUser._id.toString());
                if (msg.createdAt > existing.lastMessage.createdAt) {
                    existing.lastMessage = msg;
                }
                existing.count++;
            }
        });
        const conversations = Array.from(conversationsMap.values()).sort((a,b) => b.lastMessage.createdAt - a.lastMessage.createdAt);

        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get specific chat history between two users
router.get('/:user1Id/:user2Id', verifyToken, async (req, res) => {
    if (req.user._id !== req.params.user1Id) return res.status(403).send('Unauthorized');
    try {
        const chat = await Message.find({
            $or: [
                { sender: req.params.user1Id, receiver: req.params.user2Id },
                { sender: req.params.user2Id, receiver: req.params.user1Id }
            ]
        })
        .populate('sender', 'username profilePicture')
        .populate('receiver', 'username profilePicture')
        .populate('outfitShared')
        .sort({ createdAt: 1 }); // Sort by time ascending for chat history
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;