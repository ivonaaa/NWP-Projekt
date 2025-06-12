const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rateSchema = new Schema({
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
});

const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;

