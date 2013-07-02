function Story(data, iterations, releases)
{
	this.model = data;
	this.iterations = iterations;
	this.releases = releases;
	
	this.display = function () 
	{        
		var releaseName = (this.model.Release !== null ? this.model.Release.Name : "");
   		var iterationName = (this.model.Iteration !== null ? this.model.Iteration.Name : "");
		
		var tr = document.createElement('tr');
		tr.className = 'UserStory';
		tr.id = this.model.ObjectID; //Must give the row an ID to support drag and drop changing the rank

		var tdClasses = ['_ref', 'Rank', 'ID', 'Name', 'Points', 'Parent', 'Release', 'Iteration', 'EditLinks'];
		var tds = [];

		//Create td elements and set the class names for each one		
		for(i = 0; i < tdClasses.length; i++)
		{
			tds[i] = document.createElement('td');
			tds[i].className = tdClasses[i];
			tr.appendChild(tds[i]);
		}
		
		tds[0].innerHTML = this.model._ref;
		tds[1].innerHTML = this.model.Rank;
		tds[2].innerHTML = this.model.FormattedID;
	    var editLink = new rally.sdk.ui.basic.EditLink
	    (
	    	{
	    		item: this.model._ref,
	    		text: this.model.Name
	    	}
	    );
	    editLink.display(tds[3]);
	        		
	    tds[4].innerHTML = "<input type='text' size='2' name='" + this.model._ref 
        				+ "' value='" + (this.model.PlanEstimate !== null ? this.model.PlanEstimate : "")
        				+ "' onchange='javascript:updateStory(this.name,\"PlanEstimate\",this.value);'>"
        				+ "</input>";
        		
        tds[5].innerHTML = (this.model.Parent != null ? this.model.Parent.Name : "");
	        		
		//Make release a select box
   		var releaseHTML = "<select name='" + this.model._ref 
   						+ "' onchange='javascript:updateStory(this.name,\"Release\",this.options[this.selectedIndex].value)'>"
        				+ "<option value=''" + (releaseName === "" ? "selected='selected'" : "") + "></option>";

		for(var j=0; j < this.releases.length; ++j)
		{
    		releaseHTML += "<option value='" + this.releases[j]._ref + "' ";
			if(releaseName === this.releases[j].Name)
			{
				releaseHTML += "selected='selected'";
			}
			releaseHTML += ">" + this.releases[j].Name + "</option>";
        }
		releaseHTML += "</select>";
		tds[6].innerHTML = releaseHTML;
	        		
       	//Make Iteration a select box
	    var iterationHTML	= "<select name='" + this.model._ref 
	    					+ "' onchange='javascript:updateStory(this.name,\"Iteration\",this.options[this.selectedIndex].value);calculateVelocity();'>"
							+ "<option value=''" + (iterationName === "" ? "selected='selected'" : "") + "></option>";

        //If the story's iteration is never found then add it to the selection box (it is in a past iteration)
       	for(var j=0; j < this.iterations.length; ++j)
       	{
        	iterationHTML += "<option value='" + this.iterations[j]._ref + "' ";
            if(iterationName === this.iterations[j].Name)
            {
	            iterationHTML += "selected='selected'";
            }
            iterationHTML += ">" + this.iterations[j].Name + "</option>";
	    } 
	    iterationHTML += "</select>";
	    tds[7].innerHTML = iterationHTML;
	            	
		//Add an add sibling button if the story is not a defect and has a parent
	    if(this.model._type !== "Defect" && this.model.Parent !== null)
	    {
			tds[8].innerHTML = "<a title='Create sibling story' style='background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -1139px;'"
		   					+ "href='#' onclick='rally.sdk.util.Navigation.popupCreatePage(\"HierarchicalRequirement\", {parent: "
		   					+ this.model.Parent.ObjectID + "})'></a>"
	    }
    	//Add an add child button if the story is not a defect
        if(this.model._type !== "Defect")
        {
        	tds[8].innerHTML += "<a title='Create child story' style='background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -1122px;'"
	        				+ "href='#' onclick='rally.sdk.util.Navigation.popupCreatePage(\"HierarchicalRequirement\", {parent: "
	            			+ this.model.ObjectID + "})'></a>"
        }
    	//Add a edit button
        tds[8].innerHTML += "<a title='Edit story' style='background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -595px;'"
    					+ "href='#' onclick='rally.sdk.util.Navigation.popupEditPage(\"/"
						+ this.model._type + "/" + this.model.ObjectID + "\")'></a>";
                   
        //Add a delete button
    	tds[8].innerHTML += "<a title='Delete story' style='background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -442px;'"
	                    + "href='#' onclick='javascript:wsDelete(\"" + this.model.ObjectID + "\", \"" + this.model._type + "\");'></a>";
	    
    	return tr;
	}
	
	this.updateRank = function(newRank)
	{
		this.model.Rank = newRank;
		document.getElementById(this.model.FormattedID).childNodes[1].innerHTML = newRank;
	}
}