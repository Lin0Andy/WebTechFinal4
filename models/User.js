const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    creation_date: { type: Date, required: true },
    admin_status: { type: Boolean, required: false },
    deletion_date: { type: Date, default: null, required: false },
    update_date: { type: Date, default: null, required: false },
})
const User = mongoose.model('User', userSchema);

module.exports = User;
