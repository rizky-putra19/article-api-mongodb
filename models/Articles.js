const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticlesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }],
});

ArticlesSchema.virtual('commentCount', {
    ref: 'Comments',
    localField: 'comment',
    foreignField: 'articleId',
    count: true
});

ArticlesSchema.set('toObject', { virtuals: true });
ArticlesSchema.set('toJSON', { virtuals: true });

module.exports = Articles = mongoose.model('Articles', ArticlesSchema);