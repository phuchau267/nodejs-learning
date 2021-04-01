const express = require('express');
const router = express.Router();

const CommentController = require('../app/controllers/CommentController');
const UserController = require('../app/controllers/UserController');

router.post('/:chapterSlug',UserController.checkLogin, CommentController.postComment);

module.exports = router;
