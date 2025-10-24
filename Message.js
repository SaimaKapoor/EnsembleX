// server/models/Message.js
const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    outfitShared: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit' }, // Optional: for sharing outfits
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', MessageSchema);