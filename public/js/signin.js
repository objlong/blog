Vue.http.options.emulateJSON = true;
var vm = new Vue({
	el: '#main',
	data: {
		userName: null,
		password: null
	},
	methods: {
		login: function () {
			if (!this.userName) {
				return alert('请输入账号');
			} else if (!this.password) {
				return alert('请输入密码');
			}
			this.$http.post('/signin', {
				user_name: vm.userName,
				password: vm.password
			}).then(function (res) {
				if (res.body.errmsg) {
					return alert(res.body.errmsg);
				}
				window.location.href = '/posts';
			}, function(res) {
				alert('网络连接失败');
			});
		}
	}
})