const mongoose = require('mongoose');
const cloudinary = require('../middleware/cloudinary');
const calculate = require('../helpers/timeDiff.js');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { cloudinary_js_config } = require('../middleware/cloudinary');

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render('profile.ejs', { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: 'desc' }).lean();
      res.render('feed.ejs', { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const users = await User.find();
      const comments = await Comment.find({
        postId: req.params.id,
        parent: true,
      });
      console.log(comments);
      res.render('post.ejs', {
        post: post,
        user: req.user,
        calculate: calculate,
        users: users,
        comments: comments,
      });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log('Post has been added!');
      res.redirect('/profile');
    } catch (err) {
      console.log(err);
    }
  },
  addComment: async (req, res) => {
    try {
      const post = await Post.findOne({ _id: req.params.id });
      const user = await User.findOne({ _id: String(req.user.id) });
      const comment = {
        comment: req.body.comment,
        user: user,
      };
      const commentQuery = await Comment.findOne({
        _id: req.params.id,
      });
      let postId;
      if (post) {
        comment.parent = true;
        comment.postId = req.params.id;
        const newComment = await Comment.create(comment);
        post.comments.push(newComment);
        await post.save();
        postId = req.params.id;
      } else if (commentQuery) {
        comment.parentId = req.params.id;
        comment.postId = commentQuery.postId;
        const newReply = await Comment.create(comment);
        commentQuery.replies.push(newReply);
        await commentQuery.save();
        postId = commentQuery.postId;
      }
      console.log('Comment added');
      res.redirect(`/post/${postId}`);
    } catch (err) {
      console.log(err);
    }
  },
  // addReply: async (req, res) => {
  //   try {
  //     console.log(req.params.id);
  //     const user = await User.findOne({ _id: String(req.user.id) });
  //     const reply = {
  //       comment: req.body.reply,
  //       user: user,
  //     };
  //     const commentQuery = await Comment.findOne({ _id: req.params.id });
  //     let postId;
  //     if (commentQuery) {
  //       reply.commentId = req.params.id;
  //       reply.postId = commentQuery.postId;
  //       const newReply = await Reply.create(reply);
  //       commentQuery.replies.push(newReply);
  //       commentQuery.save();
  //       postId = commentQuery.postId;
  //     } else if (replyQuery) {
  //       reply.parentId = req.params.id;
  //       reply.postId = replyQuery.postId;
  //       const newReply = await Reply.create(reply);
  //       replyQuery.replies.push(newReply);
  //       replyQuery.save();
  //       postId = replyQuery.postId;
  //     }
  //     console.log('Reply added');
  //     res.redirect(`/post/${postId}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log('Likes +1');
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log('Deleted Post');
      res.redirect('/profile');
    } catch (err) {
      res.redirect('/profile');
    }
  },
};
