var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.post('/', checkLogin, function(req, res, next) {
  	// 清空 session 中用户信息
  	req.session.user = null;
  	res.send({
  		errmsg: '',
  		errnum: '',
  		data: 'signout success'
  	});
});

module.exports = router;