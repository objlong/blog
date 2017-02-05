Vue.http.options.emulateJSON = true;
var vm = new Vue({
	el: '#main',
	data: {
		title: '',
		content: '',
		ifLogin: false
	},
	computed: {
		load: function () {
			var postId = this.local().id;
			if (postId) {
				this.$http.get('/posts/edit/', {
					params: {
						post_id: postId
					}
				}).then(function(res) {
					if (res.body.errmsg) return alert(res.body.errmsg);
					var post = res.body.data.post;
					this.title = post.title;
					this.content = post.content;
					this.ifLogin = res.body.data.if_login;
				})
			}
		}
	},
	methods: {
		local: function() {
			var e = location.search.slice(1).split("&"),
				t = {};
			for(var n in e){
				var i = e[n].split("=");
				t[i[0]] = decodeURIComponent(i[1] || "")
			}
			return t;
		},
		createArticle: function() {
			if (!this.title) return alert('请输入标题');
			if (!this.content) return alert('请输入内容');
			this.$http.post('/posts/', {
				title: this.title,
				content: this.content
			}).then(function (res) {
				if (res.body.errmsg) return alert(res.body.errmsg);
				window.location.href = '/posts/?id=' + res.body.data._id;
			});			
		},
		editArticle: function() {
			if (!this.title) return alert('请输入标题');
			if (!this.content) return alert('请输入内容');
			this.$http.post('/posts/edit/', {
				post_id: this.local().id,
				title: this.title,
				content: this.content
			}).then(function (res) {
				if (res.body.errmsg) return alert(res.body.errmsg);
				window.location.href = '/posts/?id=' + this.local().id;
			})
		},
		submitArticle: function () {
			this.local().id ? this.editArticle() : this.createArticle();
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
