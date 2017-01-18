Vue.component('post', {
	template: '\
		<div class="article-item">\
	        <a :href="url">\
		        <div class="author">\
		            <img :src="articleItem.author.avatar" alt="">\
		            <p class="author-name">{{articleItem.author.name}}</p>\
		        </div>\
	        </a>\
	        <div class="article">\
	            <p class="article-title">{{articleItem.title}}</p>\
	            <p class="article-content" v-html="articleItem.content"></p>\
	        </div>\
	    </div>\
	',
	props: ['articleItem'],
	data: function () {
		return {
			url: '/posts/?id=' + this.articleItem._id
		}
	}
});
Vue.component('comment', {
	template: '\
        <div class="comments-item">\
            <div class="comments-info">\
                <img :src="comment.author.avatar" alt="头像">\
                <p>{{comment.author.name}}</p>\
                <p>{{comment.created_at}}</p>\
            </div>\
            <div class="comments-content" v-html="comment.content">\
            </div>\
            <a v-if="comment.is_delete" @click="deleteComment" href="javascript:void(0)" class="delete-comment">删除</a>\
        </div>\
	',
	props: ['comment', 'deleteComment']
});