const mongoose = require('mongoose');

const task = new mongoose.Schema({
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
    deadline: Date,
    status: {
        type: String,
        enum: ['to do', 'in progress', 'done', 'blocked'],
        default: 'to do'
    },
    category: String
});

module.exports = task;
