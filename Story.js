function Story(data, iterations, releases)
{
	this.Release = new SelectBox(data.Release !== null ? data.Release.Name : "", data._ref, releases, 'Release');
	this.Iteration = new SelectBox(data.Iteration !== null ? data.Iteration.Name : "", data._ref, iterations, 'Iteration');
	this.model = data;
	
	this.display = function () 
	{        
		var tr = document.createElement('tr');
		tr.className = 'UserStory';
		tr.id = this.model.ObjectID; //Must give the row an ID to support drag and drop changing the rank
		tr.appendChild(this.storyField(this.model._ref, '_ref'));
		tr.appendChild(this.storyField(this.model.Rank, 'Rank'));
		tr.appendChild(this.storyField(this.model.FormattedID, 'ID'));

		var tdClasses = ['Name', 'Points', 'Parent', 'Release', 'Iteration', 'EditLinks'];
		var tds = [];

		//Create td elements and set the class names for each one		
		for(i = 0; i < tdClasses.length; i++)
		{
			tds[i] = document.createElement('td');
			tds[i].className = tdClasses[i];
			tr.appendChild(tds[i]);
		}
		
		var editLink = new rally.sdk.ui.basic.EditLink
		(
			{
				item: this.model._ref,
				text: this.model.Name
			}
		);
		editLink.display(tds[0]);

		tds[1].innerHTML = "<input type='text' size='2' name='" + this.model._ref +
						"' value='" + (this.model.PlanEstimate !== null ? this.model.PlanEstimate : "") + 
						"' onchange='javascript:updateStory(this.name,\"PlanEstimate\",this.value);'>" + 
						"</input>";

		tds[2].innerHTML = (this.model.Parent ? this.model.Parent.Name : "");
		tds[3].innerHTML = this.Release.display();
		tds[4].innerHTML = this.Iteration.display();

		//Add an add sibling button if the story is not a defect and has a parent
		if(this.model._type !== "Defect" && this.model.Parent !== null)
		{
			tds[5].innerHTML = "<a title='Create sibling story' style='background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -1139px;'" +
								"href='#' onclick='rally.sdk.util.Navigation.popupCreatePage(\"HierarchicalRequirement\", {parent: " +
								this.model.Parent.ObjectID + "})'></a>";
		}
		//Add an add child button if the story is not a defect
        if(this.model._type !== "Defect")
        {
			tds[5].innerHTML += "<a title='Create child story' style='background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -1122px;'" +
								"href='#' onclick='rally.sdk.util.Navigation.popupCreatePage(\"HierarchicalRequirement\", {parent: " +
								this.model.ObjectID + "})'></a>";
		}
		//Add a edit button
        tds[5].innerHTML += "<a title='Edit story' style='background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -595px;'" +
							"href='#' onclick='rally.sdk.util.Navigation.popupEditPage(\"/" +
							this.model._type + "/" + this.model.ObjectID + "\")'></a>";
                   
        //Add a delete button
		tds[5].innerHTML += "<a title='Delete story' style='background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -442px;'" +
							"href='#' onclick='javascript:wsDelete(\"" + this.model.ObjectID + "\", \"" + this.model._type + "\");'></a>";

		return tr;
	};
	
	this.updateRank = function(newRank)
	{
		this.model.Rank = newRank;
		document.getElementById(this.model.ObjectID).childNodes[1].innerHTML = newRank;

	};
	
	this.storyField = function (data, className)
	{
		var td = document.createElement('td');
		td.className = className;
		td.innerHTML = data;

		return td;
	}

}
function SelectBox(name, ref, options, key)
{
	this._name = name;
	this._ref = ref;
	this._options = [{_ref: '', Name: ''}].concat(options);
	this._key = key;
	
	this.display = function()
	{
		//Make release a select box
		var releaseHTML = "<select name='" + this._ref +
							"' onchange='javascript:updateStory(this.name,\"" + key + "\",this.options[this.selectedIndex].value)' " +
							"onclick='this.focus()'>";
							
		for(var j=0; j < this._options.length; ++j)
		{
			releaseHTML += "<option value='" + this._options[j]._ref + "' ";
			if(this._name === this._options[j].Name)
			{
				releaseHTML += "selected='selected'";
			}
			releaseHTML += ">" + this._options[j].Name + "</option>";
        }
		releaseHTML += "</select>";
		return releaseHTML;
	}
}