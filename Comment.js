// server/models/Comment.js
const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    outfit: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit', required: true },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Comment', CommentSchema);