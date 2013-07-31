function Velocity (rallyDataSource, element)
{
	this.average = 0;
	this.last = 0;
	this.current = 0;
	this.currentAccepted = 0;
	this.currentIterationName = '';
	this.currentIterationRef = '';
	this.lastIterationName = '';
	this.lastIterationRef = '';
	this.numIterations = 0;
	
	this.displayElement = element;
	
	var today = toISOString(new Date());
	var that = this;
	
	//get the current iteration and the 3 previous iterations with current iteration first
	var queryObject = 
	{
		key: 'iterations',
		type: 'Iteration',
		fetch: 'Name,EndDate,ObjectID',
		order: 'EndDate desc',
		query: '(StartDate <= "' + today + '")',
		pagesize: 4
	};
	rallyDataSource.find(queryObject, getStories);
		
	function getStories(results) 
	{
		//get all stories and defects that occured in the current sprint and previous 3 sprints
		var queryObject = [];
		var queryString = '';
		
		that.numIterations = results.iterations.length - 1;
		
		if(results.iterations.length > 0)
		{
			that.currentIterationName = results.iterations[0].Name;
			that.currentIterationRef = results.iterations[0]._ref;
			queryString = '(Iteration.ObjectID = "' + results.iterations[0].ObjectID + '")';
		}
		
		if(results.iterations.length > 1)
		{
			that.lastIterationName = results.iterations[1].Name;
			that.lastIterationRef = results.iterations[1]._ref;
			for(i=1; i < results.iterations.length; ++i)
			{
				queryString = '(' + queryString;
				queryString += ' OR (Iteration.ObjectID = "' + results.iterations[i].ObjectID + '"))';
			}
		}
		queryObject[0] = 
		{
			key: 'stories',
			type: 'HierarchicalRequirement',
			fetch: 'true',
			query: queryString
		};
			
		queryObject[1] = 
		{
			key: 'defects',
			type: 'defects',
			fetch: 'true',
			query: queryString
		};
			
		rallyDataSource.findAll(queryObject, calculateVelocities);
	}
	
	function calculateVelocities(results)
	{
		//add story points of all stories and defects as well as just those done in the last sprint
		var points = results.stories.concat(results.defects);
	
		for(i=0; i < points.length; ++i)
		{
			if (points[i].Iteration._ref == that.lastIterationRef)
			{
				that.last += points[i].PlanEstimate;	
			}

			if (points[i].Iteration._ref == that.currentIterationRef)
			{
				that.current += points[i].PlanEstimate;
			
				if(points[i].ScheduleState == "Accepted")
				{
					that.currentAccepted += points[i].PlanEstimate;
				}
			} 
			else 
			{
				that.average += points[i].PlanEstimate;
			}
		}
		that.average = Math.round(that.average/that.numIterations);
		that.display();
	}

	this.display = function() {
		//create a table with three rows: average, last, current and two columns: name, velocity
		var velocityTable = document.createElement("table");

		var averageRow = document.createElement("tr");
		var averageNameData = document.createElement("td");
		var averageVelocityData = document.createElement("td");
		averageNameData.innerHTML = "Average: ";
		averageVelocityData.innerHTML = this.average;
		averageRow.appendChild(averageNameData);
		averageRow.appendChild(averageVelocityData);

		var lastRow = document.createElement("tr");
		var lastNameData = document.createElement("td");
		var lastVelocityData = document.createElement("td");
		lastNameData.innerHTML = this.lastIterationName + ": ";
		lastVelocityData.innerHTML = this.last;
		lastRow.appendChild(lastNameData);
		lastRow.appendChild(lastVelocityData);

		var currentRow = document.createElement("tr");
		var currentNameData = document.createElement("td");
		var currentVelocityData = document.createElement("td");
		currentNameData.innerHTML = this.currentIterationName + ": ";
		currentVelocityData.innerHTML = this.current + " (" + this.currentAccepted + ")";
		currentRow.appendChild(currentNameData);
		currentRow.appendChild(currentVelocityData);

		velocityTable.appendChild(averageRow);
		velocityTable.appendChild(lastRow);
		velocityTable.appendChild(currentRow);

		if(this.displayElement.hasChildNodes())
		{
			this.displayElement.replaceChild(velocityTable, this.displayElement.firstChild);
		}
		else
		{
			this.displayElement.appendChild(velocityTable);
		}
	};
}