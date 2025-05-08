const mongoose = require('mongoose');
const taskSchema = require('./Task');
const categorySchema = require('./Category');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: [taskSchema],
    categories: [categorySchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
