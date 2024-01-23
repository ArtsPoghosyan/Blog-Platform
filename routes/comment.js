const express = require('express');
const CommentController = require('../controllers/CommentController');
const authorizationAccept = require("../middlewares/authorization/authorizationAccept");
const { createValidator, updateValidator } = require('../middlewares/blog/comment/validator');
const router = express.Router();

/* POST, PUT and DELETE comments listing. */
router.post('/add', authorizationAccept, createValidator, CommentController.addComment);
router.put('/update', authorizationAccept, updateValidator, CommentController.updateComment);
router.post('/delete', authorizationAccept, CommentController.deleteComment);

module.exports = router;