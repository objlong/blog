var User = require('../lib/mongo').User;

module.exports = {
	//register
	create: function create(user) {
		return User.create(user).exec();
	},
	//getUserInfo
	getUserByName: function getUserByName(name) {
		return User
			.findOne({ name: name })
			.addCreatedAt()
			.exec();
	}
};