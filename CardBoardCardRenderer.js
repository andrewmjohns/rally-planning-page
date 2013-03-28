var FullCardRenderer = function(column, item, options) {
	//This will allow you to inherit functionality from the BasicCardRenderer
    rally.sdk.ui.cardboard.BasicCardRenderer.call(this, column, item, options);
    var that = this;

    this.getCardBody = function() {
		var contentDiv = document.createElement("div");
    	contentDiv.innerHTML = item.Name;

        //Show discussions
        if(item.Discussion && item.Discussion.length > 0) {
        	var discussionDiv = document.createElement("div");
        	discussionDiv.appendChild(document.createTextNode(
            	item.Discussion.length + " Discussions"));
        	contentDiv.appendChild(discussionDiv);
         }

        //Show tags
        if(item.Tags && item.Tags.length > 0) {
        	var tagDiv = document.createElement("div");
        	var tagNames = [];
        	rally.forEach(item.Tags, function(tag) {
            	tagNames.push(tag.Name);
           	});
          	tagDiv.appendChild(document.createTextNode("Tags: " + tagNames.join(", ")));
	        contentDiv.appendChild(tagDiv);
		}

		return contentDiv;
    };
};