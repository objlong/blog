Vue.http.options.emulateJSON = true;

var vm = new Vue({
	el: '#posts',
	data: {
		articleList: []
	},
	computed: {
		load: function () {
			this.$http.get('/posts/list', {
				author: 'objlong007'
			}).then(function(res) {
				return this.articleList = res.body;
			}), function () {
				alert('网络链接失败');
			}
		}
	}
})