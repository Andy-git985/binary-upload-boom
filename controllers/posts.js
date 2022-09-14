const mongoose = require('mongoose');
const cloudinary = require('../middleware/cloudinary');
const calculate = require('../helpers/timeDiff.js');
const Post = require('../models/Post');
const User = require('../models/User');
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
      // const timeSpan = calculate.timeDiff(post.createdAt);
      res.render('post.ejs', {
        post: post,
        user: req.user,
        // timeSpan: timeSpan,
        calculate: calculate,
        users: users,
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
      const comment = { comment: req.body.comment.trim() };
      const user = await User.findOne({ _id: req.user.id });
      comment.user = user;
      post.comments.push(comment);
      await post.save();
      console.log('Comment added');
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  addReply: async (req, res) => {
    try {
      // console.log(req.params.id);
      // console.log(req.body.reply);
      const user = await User.findOne({ _id: req.user.id });
      console.log(user);
      const post = await Post.findOne({
        'comments._id': { _id: req.params.id },
      });
      const postId = post._id;
      post.comments.id(req.params.id).replies.push({
        comment: req.body.reply,
        user: user,
      });
      console.log(post);
      await post.save();
      res.redirect(`/post/${postId}`);
    } catch (err) {
      console.log(err);
    }
  },
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
