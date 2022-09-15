const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reply', ReplySchema);
