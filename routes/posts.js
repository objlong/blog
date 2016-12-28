var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;
var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');
// GET /posts wenzhangye
// eg: GET /posts/?author=xxx
router.get('/', function (req, res, next) {
	var author = req.query.author;
	PostModel.getPosts(author)
		.then(function (posts) {
			res.render('posts', {posts: posts});
		})
		.catch(next);
});

// POST /posts fabiaowenzhang
router.post('/', checkLogin, function (req, res, next) {
	var author = req.session.user._id,
		title = req.fields.title,
		content = req.fields.content;
	try {
		if (!title.length) {
			throw new Error('lose title');
		}
		if (!content.length) {
			throw new Error('lose content');
		}
	} catch (e) {
		req.flash('error', e.message);
		return res.redirect('back');
	}
	var post = {
		author: author,
		title: title,
		content: content,
		pv: 0
	};
	PostModel.create(post)
		.then(function (result) {
			post = result.ops[0];
			req.flash('success', '发表成功');
			res.redirect(`/posts/${post._id}`);
		})
		.catch(next);
});

// GET /posts/create fabiaowenzhangyemian
router.get('/create', checkLogin, function (req, res, next) {
	res.render('create');
});

// GET /posts/:postId danduwenzhangye
router.get('/:postId', checkLogin, function (req, res, next) {
	var postId = req.params.postId;
	Promise.all([
		PostModel.getPostById(postId),
		CommentModel.getComments(postId),
		PostModel.incPv(postId)
	])
	.then(function (result) {
		var post = result[0];
		var comments = result[1];
		if (!post) {
			throw new Error('no article');
		}
		res.render('post', {
			post: post,
			comments: comments
		});
	})
	.catch(next);
});

// GET /posts/:postId/edit bianjiwenzhangye
router.get('/:postId/edit', checkLogin, function (req, res, next) {
	var postId = req.params.postId,
		author = req.session.user._id;
	PostModel.getRawPostById(postId)
		.then(function (post) {
			if (!post) {
				throw new Error('no article');
			}
			if (author.toString() !== post.author._id.toString()) {
				throw new Error('权限不足');
			}
			res.render('edit', {
				post: post
			})
		})
		.catch(next);
});

// POST /posts/:postId/edit bianjiwenzhang
router.post('/:postId/edit', checkLogin, function (req, res, next) {
	var postId = req.params.postId,
		author = req.session.user._id,
		title = req.fields.title,
		content = req.fields.content;
	PostModel.updatePostById(postId, author, {title: title, content: content})
		.then(function () {
			req.flash('success', 'edit success');
			res.redirect(`/posts/${postId}`);
		})
		.catch(next);
});


// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
  	var postId = req.params.postId,
  		author = req.session.user._id;
  	PostModel.delPostById(postId, author)
  		.then(function () {
  			req.flash('success', 'delete success');
  			res.redirect('/posts');
  		})
  		.catch(next);
});

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
  	var author = req.session.user._id,
  		postId = req.params.postId,
  		content = req.fields.content,
  		comment = {
  			author: author,
  			postId: postId,
  			content: content
  		};
  	CommentModel.create(comment)
  		.then(function () {
  			req.flash('success', 'leave message success');
  			res.redirect('back');
  		})
  		.catch(next);
});

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
	var commentId = req.params.commentId,
		author = req.session.user._id;
	CommentModel.delCommentById(commentId, author)
		.then(function () {
			req.flash('success', 'delete message success');
			res.redirect('back');
		})
		.catch(next)
});

module.exports = router;