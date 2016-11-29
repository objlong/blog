var marked = require('marked');
var Comment = require('../lib/mongo').Comment;

Comment.plugin('contentToHtml', {
	afterFind: function (comments) {
		return comments.map(function (comment) {
			comment.content = marked(comment.content);
			return comment;
		});
	}
});
module.exports = {
	//create comment
	create: function create(comment) {
		return Comment.create(comment).exec();
	},
	delCommentById: function delCommentById(commentId, author) {
		return Comment.remove({author: author, _id: commentId}).exec();
	},
	getComments: function getComments(postId) {
		return Comment
			.find({postId: postId})
			.populate({path: 'author', model: 'User'})
			.sort({_id: 1})
			.addCreatedAt()
			.contentToHtml()
			.exec();
	},
	getCommentsCount: function getCommentsCount(postId) {
		return Comment.count({postId: postId}).exec();
	}
}