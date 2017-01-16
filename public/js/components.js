Vue.component('post', {
	template: '\
		<div class="article-item">\
	        <div class="author">\
	            <img :src="articleItem.author.avatar" alt="">\
	            <p class="author-name">{{articleItem.author.name}}</p>\
	        </div>\
	        <div class="article">\
	            <p class="article-title">{{articleItem.title}}</p>\
	            <p class="article-content">{{articleItem.content}}</p>\
	        </div>\
	    </div>\
	',
	props: ['articleItem']
});