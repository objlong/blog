var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;
var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');
router.get('/', function (req, res, next) {
	res.render('posts.html');
});
//获取文章列表
router.get('/list', function (req, res, next) {
	var author = req.query.author;
	PostModel.getPosts(author)
		.then(function (posts) {
			posts.forEach((p, i, a) => {
				delete p.author.password;
			});
			res.send({
				errnum: '',
				errmsg: '',
				data: posts
			});
		})
		.catch(next);
});

// POST /posts 发表文章
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

// GET /posts/create 发表文章页面
router.get('/create', checkLogin, function (req, res, next) {
	res.render('create');
});

// GET /posts/one?id=postId 单独文章页
router.get('/one', function (req, res, next) {
	var postId = req.query.id;
	Promise.all([
		PostModel.getPostById(postId),
		CommentModel.getComments(postId),
		PostModel.incPv(postId)
	])
	.then(function (result) {
		var post = result[0];
		var comments = result[1];
		if (!post) {
			res.send({
				errnum: '',
				errmsg: '没有此篇文章',
				data: null
			});			
		} else {
			delete post.author.password;
  			var author = req.session.user._id;
			comments.forEach((one, index, comments) => {
				one.is_delete = one.author._id == author ? 1 : 0;
 			});			
			res.send({
				errnum: '',
				errmsg: '',
				data: {
					post: [post],
					comments: comments
				}
			});				
		}
	})
	.catch(next);
});

// GET /posts/:postId/edit 编辑文章页面
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

// POST /posts/:postId/edit 编辑文章
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

// POST /posts/comment/?id=postId 创建一条留言
router.post('/submit_comment/', checkLogin, function(req, res, next) {
	console.log(req.session)
  	var author = req.session.user._id,
  		postId = req.fields.postId,
  		content = req.fields.content,
  		comment = {
  			author: author,
  			postId: postId,
  			content: content
  		};
  	CommentModel.create(comment)
	.then(function () {
		CommentModel.getComments(postId)
		.then(function (result) {
			result.forEach((one, index, result) => {
				one.is_delete = one.author._id == author ? 1 : 0;
 			});
			res.send({
				errmsg: '',
				errnum: '',
				data: result
			});
		});
	})
	.catch(next);
});

// GET /posts/remove_comment/?comment_id=commentId 删除一条留言
router.post('/posts/remove_comment/', checkLogin, function(req, res, next) {
	var commentId = req.fields.comment_id,
		author = req.session.user._id;
	CommentModel.delCommentById(commentId, author)
		.then(function () {
			res.send({
				errmsg: '',
				errnum: '',
				data: {
					commnet_id: commentId
				}
			});
		})
		.catch(next)
});

module.exports = router;