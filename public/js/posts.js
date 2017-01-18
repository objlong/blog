Vue.http.options.emulateJSON = true;

var vm = new Vue({
	el: '#posts',
	data: {
		info: {
			articleList: [],
			comments: []
		},
		content: ''
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
				return this.info.articleList = res.body.data;
			}), function () {
				alert('网络链接失败');
			}
		},
		loadOne: function () {
			this.$http.get('/posts/one', {
				params: {id: this.local().id}
			}).then(function(res) {
				if (res.body.errmsg) return alert(res.body.errmsg);
				return this.info = {
					articleList: res.body.data.post,
					comments: res.body.data.comments
				};
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
		submit: function () {
			this.$http.post('/posts/submit_comment', {
				postId: this.local().id,
				content: this.content
			}).then(function(res) {
				console.log(res)
				if (res.body.errnum == '100000') {
					window.location.href = '/signin';
					return;
				}
				if (res.body.errmsg) return alert(res.body.errmsg);
				return this.info.comments = res.body.data;
			});
		},
		deleteComment: function() {
			alert(1)
		}	
	}
});