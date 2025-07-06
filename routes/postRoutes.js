const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Post = require("../models/post");

// GET all posts
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "_id name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

// GET single post
router.get("/getsinglepost/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "_id name email"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

// CREATE post
router.post("/", auth, async (req, res) => {
  const { title, excerpt, content, category } = req.body;

  if (!title || !excerpt || !content) {
    return res.status(400).json({
      success: false,
      message: "Title, excerpt, and content are required",
    });
  }

  try {
    const newPost = new Post({
      title,
      excerpt,
      content,
      category,
      author: req.user.id,
    });

    await newPost.save();

    await newPost.populate("author", "_id name email");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

// UPDATE post
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check permissions
    if (
      post.author.toString() !== req.user.id &&
      !["admin", "superadmin"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Not allowed to edit this post",
      });
    }

    post.title = req.body.title ?? post.title;
    post.excerpt = req.body.excerpt ?? post.excerpt;
    post.content = req.body.content ?? post.content;
    post.category = req.body.category ?? post.category;

    await post.save();

    await post.populate("author", "_id name email");

    res.json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

// DELETE post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (
      post.author.toString() !== req.user.id &&
      !["admin", "superadmin"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Not allowed to delete this post",
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
