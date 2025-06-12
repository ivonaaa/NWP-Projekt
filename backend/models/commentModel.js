const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    recipe_id: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
