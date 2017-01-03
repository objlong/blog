module.exports = function (app) {
	app.get('/', function (req, res) {
		res.redirect('signin');
	});
	app.post('/signin', function (req, res, next) {
		console.log(req.body)
		res.send({a: 1})
	})
	app.use('/signup', require('./signup'));
	app.use('/signin', require('./signin'));
	app.use('/signout', require('./signout'));
	app.use('/posts', require('./posts'));
}