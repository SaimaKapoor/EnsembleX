// server/models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    savedOutfits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Outfit' }],
    // Add other user details from Image 7 (e.g., name, dob, gender)
    name: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);