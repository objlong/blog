var vm = new Vue({
	el: '#main',
	data: {
		userName: null,
		password: null
	},
	methods: {
		login: function () {
			this.$http.post('/signin', {
				user_name: vm.userName,
				password: vm.password
			}).then(function (res) {
				console.log(res)
			}, function(res) {
				console.log(res)
			});
		}
	}
})