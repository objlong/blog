	var sha1 = require('sha1');
	var express = require('express');
	var router = express.Router();

	var UserModel = require('../models/users');
	var checkNotLogin = require('../middlewares/check').checkNotLogin;

	// GET /signin 登录页
	router.get('/', checkNotLogin, function(req, res, next) {
		res.render('signin.html');
	});

	// POST /signin 用户登录
	router.post('/new', checkNotLogin, function(req, res, next) {
		var name = req.fields.name,
			password = req.fields.password;
		UserModel.getUserByName(name)
		.then(function (user) {
			if (!user) {
				req.flash('error', 'no user');
				return res.redirect('back');
			}
			//checkpsw
			if (sha1(password) !== user.password) {
				req.flash('error', 'psw error');
				return res.redirect('back');
			}
			req.flash('success', 'login success');
			//session
			delete user.password;
			req.session.user = user;
			res.redirect('/posts');
		})
		.catch(next);
	});

	module.exports = router;