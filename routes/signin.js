	var sha1 = require('sha1');
	var express = require('express');
	var router = express.Router();

	var UserModel = require('../models/users');
	var checkNotLogin = require('../middlewares/check').checkNotLogin;

	// GET /signin 登录页
	router.get('/', function(req, res, next) {
		res.render('signin.html');
	});

	// POST /signin 用户登录
	router.post('/', checkNotLogin, function(req, res, next) {
		var name = req.fields.user_name,
			password = req.fields.password;
		UserModel.getUserByName(name)
		.then(function (user) {
			if (!user) {
				res.send({
					errnum: '',
					errmsg: '账号密码错误',
					data: null
				});
				return;
			}
			//checkpsw
			if (sha1(password) !== user.password) {
				res.send({
					errnum: '',
					errmsg: '账号密码错误',
					data: null
				});
				return;
			} 
			//session
			delete user.password;
			req.session.user = user;
			res.send({
				errnum: '',
				errmsg: '',
				data: 'success'
			});
		})
		.catch(next);
	});

	module.exports = router;