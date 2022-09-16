const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  postId: {
    type: String,
    require: true,
  },
  commentId: {
    type: String,
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
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ReplySchema.add({ replies: [ReplySchema] });

module.exports = mongoose.model('Reply', ReplySchema);
