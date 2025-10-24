// server/models/Outfit.js
const mongoose = require('mongoose');
const OutfitSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Outfit', OutfitSchema);