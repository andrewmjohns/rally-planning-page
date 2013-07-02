function Backlog(rallyDataSource, element)
{
	var that = this;
	this.stories = [];
	this.displayElement = element;
		
	rallyDataSource.findAll(
		[ 
	 		{
	        	key: 'stories',
		        type: 'HierarchicalRequirement',
		        fetch: 'Name,FormattedID,ObjectID,PlanEstimate,Rank,Iteration,Release,Parent',
	    	    query: '((ScheduleState != "Accepted") AND (DirectChildrenCount = 0))'
			}, 
			{
				key: 'defects',
	        	type: 'defects',
		        fetch: 'Name,FormattedID,ObjectID,PlanEstimate,Rank,Iteration,Release',
		        query: '(ScheduleState != "Accepted")'
			},
			{
	         	key: 'Iterations',
	      		type: 'Iteration',
	         	fetch: 'Name',
	         	query: '(State != "Accepted")'
			},
			{
	      		key: 'Releases',
	          	type: 'Release',
	         	fetch: 'Name',
    	     	query: '(State != "Accepted")'
			}
		],
		function (results) 
		{
    		//combine the stories and defects into one list sort them by rank and create an array of story objects
        	results.stories = results.stories.concat(results.defects);
	        results.stories.sort(function sortFunc(a, b){return a.Rank - b.Rank});
	        for(i = 0; i < results.stories.length; i++) 
	        {
	        	that.stories[i] = new Story(results.stories[i], results.Iterations, results.Releases);
	        }
        	that.display();
	    }
	);
	
	this.display = function () 
	{        
	   	//begin the table
       	var table = document.createElement("table");
       	table.id = 'backlog';
       	var thead = table.createTHead();
       	var row = thead.insertRow(0);

		var classes = ['_ref','Rank','ID','Name','Points','Parent','Release','Iteration','EditButtons'];
		var text = ['','','ID','Name','Points','Parent','Release','Iteration',''];

		for(i = 0; i < classes.length; ++i)
		{
			var cell = row.insertCell(i);
			cell.className = classes[i];
			cell.innerHTML = text[i];
		}
			
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
			
       	for(var i = 0; i < this.stories.length; i++)
       	{
   			tbody.appendChild(this.stories[i].display());
        }
        	    		
    	//make all the this.stories of the table draggable and droppable so that they can be reordered
    		
    	this.displayElement.appendChild(table);
    	$("#backlog tbody").sortable({helper:'clone',update:updateRank}).disableSelection();
	}
}
//when a row has been dropped this function is called to update the rank in the database and refresh the table
function updateRank(event, ui){
	//get _ref from the first column of the row that was dragged so we can update it
	var draggedRef = ui.item[0].childNodes[0].innerHTML;
	var newRank = 0;
		
	//get Rank from the second column of the row that was dropped onto 
	var previousRank = parseInt($($("#" + ui.item[0].id).prev()).find(".Rank").text());
	var nextRank = parseInt($($("#" + ui.item[0].id).next()).find(".Rank").text());
	
	//handle the case where the item is dropped in the first place (so the previous row is the header row)
	if(isNaN(previousRank))
	{
		newRank = nextRank - 10;
	} 
	//handle the case where the item is dropped in the last place (so the next row is not existant)
	else if(isNaN(nextRank))
	{
		newRank = previousRank + 10;
	}
	else
	{
		newRank = (nextRank + previousRank) / 2;
	}
	
	//make the dragged item a lower priority than the dropped item and redraw table
	rallyDataSource.update({"_ref":draggedRef, Rank: newRank}, onComplete, onError);
}