const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    names: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    update_date: {
        type: Date,
        default: Date.now
    },
    deletion_date: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Item', itemSchema);
