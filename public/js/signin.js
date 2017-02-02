Vue.http.options.emulateJSON = true;
var vm = new Vue({
	el: '#main',
	data: {
		userName: null,
		password: null,
		register: false,
		name: '',
		gender: 'm',
		bio: '',
		password: '',
		repassword: ''
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
		},
		tabRegister: function() {
			this.register = !this.register;
		},
		toRegister: function() {
	        if (!(this.name.length >= 1 && this.name.length <= 10)) {
	            return alert('名字请限制在 1-10 个字符');
	        }
	        if (['m', 'f', 'x'].indexOf(this.gender) === -1) {
	            return alert('性别只能是 男、女 或 保密');
	        }
	        if (!(this.bio.length >= 1 && this.bio.length <= 30)) {
	            return alert('个人简介请限制在 1-30 个字符');
	        }
	        if (this.password.length < 6) {
	            return alert('密码至少 6 个字符');
	        }
	        if (this.password !== this.repassword) {
	            return alert('两次输入密码不一致');
	        }
			this.$http.post('/signup', {
				name: this.name,
				gender: this.gender,
				bio: this.bio,
				password: this.password,
				repassword: this.repassword
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