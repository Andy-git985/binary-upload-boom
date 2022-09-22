const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  parent: {
    type: Boolean,
  },
  postId: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
  },
  comment: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CommentSchema.add({ replies: [CommentSchema] });

module.exports = mongoose.model('Comment', CommentSchema);
