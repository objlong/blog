module.exports = function (app) {
	app.get('/', function (req, res) {
		if (req.session.user) {
			res.redirect('posts');
		} else {
			res.redirect('signin');
		}
	});
	app.use('/signup', require('./signup'));
	app.use('/signin', require('./signin'));
	app.use('/signout', require('./signout'));
	app.use('/posts', require('./posts'));
}