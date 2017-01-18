module.exports = {
	checkLogin: function checkLogin(req, res, next) {
		if (!req.session.user) {
			return res.send({
				errnum: '100000',
				errmsg: '用户未登录',
				data: null
			});
		}
		next();
	},
	checkNotLogin: function checkNotLogin(req, res, next) {
		if (req.session.user) {
			return res.send({
				errnum: '100000',
				errmsg: '用户未登录',
				data: null
			});
		}
		next();
	}
}