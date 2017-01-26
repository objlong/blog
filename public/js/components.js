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
	            <div class="article-btn">\
	            	<a v-if="articleItem.edit === 1" :href="editUrl" class="edit-article">编辑</a>\
	            	<a v-if="articleItem.edit === 1" href="javascript:;" class="del-article" @click="delArticle">删除</a>\
	            </div>\
	        </div>\
	    </div>\
	',
	props: ['articleItem', 'delArticle'],
	data: function () {
		return {
			url: '/posts/?id=' + this.articleItem._id,
			editUrl: '/posts/public/?id=' + this.articleItem._id
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
            <a v-if="comment.is_delete" @click="deleteComment" :data-comment_id="comment._id" href="javascript:void(0)" class="delete-comment">删除</a>\
        </div>\
	',
	props: ['comment', 'deleteComment']
});