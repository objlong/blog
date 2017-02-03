Vue.http.options.emulateJSON = true;

var vm = new Vue({
	el: '#posts',
	data: {
		info: {
			articleList: [],
			comments: []
		},
		content: '',
		ifLogin: false
	},
	computed: {
		load: function () {
			this.local().id ? this.loadOne() : this.loadAll();
		}
	},
	methods: {
		loadAll: function () {
			this.$http.get('/posts/list', {}).then(function(res) {
				if (res.body.errmsg) return alert(res.body.errmsg);
				this.info.articleList = res.body.data.posts;
				this.ifLogin = res.body.data.if_login;
			}), function () {
				alert('网络链接失败');
			}
		},
		loadOne: function () {
			this.$http.get('/posts/one', {
				params: {id: this.local().id}
			}).then(function(res) {
				if (res.body.errmsg) return alert(res.body.errmsg);
				this.info = {
					articleList: res.body.data.post,
					comments: res.body.data.comments
				};
				this.ifLogin = res.body.data.if_login;
			}), function () {
				alert('网络链接失败');
			}
		},
		local: function() {
			var e = location.search.slice(1).split("&"),
				t = {};
			for(var n in e){
				var i = e[n].split("=");
				t[i[0]] = decodeURIComponent(i[1] || "")
			}
			return t;
		},
		delArticle: function() {
			var r = confirm('确定要删除此文章吗?');
			if (r) {
				this.$http.post('/posts/remove/', {
					post_id: this.local().id
				}).then(function(res) {
					if (res.body.errmsg) return alert(res.body.errmsg);
					window.location.href = "/posts/";
				})
			}
		},
		submit: function () {
			this.$http.post('/posts/submit_comment', {
				postId: this.local().id,
				content: this.content
			}).then(function(res) {
				if (res.body.errnum == '100000') {
					window.location.href = '/signin';
					return;
				}
				if (res.body.errmsg) return alert(res.body.errmsg);
				this.content = '';
				return this.info.comments = res.body.data;
			});
		},
		deleteComment: function(e) {
			var comment_id = e.target.dataset.comment_id;
			this.$http.post('/posts/remove_comment/', {
				comment_id: comment_id
			}).then(function(res) {
				if (res.body.errmsg) return alert(res.body.errmsg);
				for (var i = 0; i < this.info.comments.length; i++) {
					if (comment_id == this.info.comments[i]._id) {
						this.info.comments.splice(i, 1);
					}
				}
			})
		},
		inOrOut: function() {
			if (this.ifLogin) {
				this.$http.post('/signout', {}).then(function(res) {
					if (res.body.errmsg) return alert(res.body.errmsg);
					window.location.href = "/posts";
				})
			} else {
				window.location.href = "/signin";
			}
		}	
	}
});