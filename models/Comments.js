const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    articleId: {
        type: Schema.Types.ObjectId,
        ref: 'Articles'
    },
    content: {
        type: String
    },
});

CommentSchema.set('toObject', { virtuals: true });
CommentSchema.set('toJSON', { virtuals: true });

module.exports = Comments = mongoose.model('Comments', CommentSchema);