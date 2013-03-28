function backlog(rallyDataSource, callback){
	var that = this;
	this.stories = [];
		
	rallyDataSource.findAll( [ {
	        key: 'stories',
	        type: 'HierarchicalRequirement',
	        fetch: 'Name,FormattedID,Owner,ObjectID,PlanEstimate,ScheduleState,Rank,Iteration,Children',
	        query: '((ScheduleState != "Accepted") AND (DirectChildrenCount = 0))'
		}, {
			key: 'defects',
	        type: 'defects',
	        fetch: 'Name,FormattedID,Owner,ObjectID,PlanEstimate,ScheduleState,Rank,Iteration',
	        query: '(ScheduleState != "Accepted")'
		} ],
		function (results) {
    		//combine the stories and defects into one list sort them by rank
        	that.stories = results.stories.concat(results.defects);
	        that.stories.sort(function sortFunc(a, b){return a.Rank - b.Rank});
        	callback("backlog");
	    }
	);
}