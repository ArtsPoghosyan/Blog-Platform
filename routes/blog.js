const express = require('express');
const CommentRouter = require("./comment");
const BlogController = require('../controllers/BlogController');
const authorizationAccept = require("../middlewares/authorization/authorizationAccept");
const { createValidator, updateValidator } = require('../middlewares/blog/validator');
const router = express.Router();

/* POST, PUT, DELETE and GET blogs listing. */
router.get('/get/', BlogController.readBlog);
router.post('/create', authorizationAccept, createValidator, BlogController.createBlog);
router.put('/update', authorizationAccept, updateValidator, BlogController.updateBlog);
router.post('/delete', authorizationAccept, BlogController.deleteBlog);

router.use('/comment', CommentRouter);

module.exports = router;