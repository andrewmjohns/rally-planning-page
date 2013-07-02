//Constants
var DaysInIteration = 14;
var API = '1.43';
var today = toISOString(new Date());
var ERRORCOLOR = '#F78181';
var SUCCESSCOLOR = 'PaleGreen';
var WARNINGCOLOR = '#F3F781';
var RALLY_WEB_SERVICE_URL = 'https://rally1.rallydev.com/slm/webservice/' + API + '/';
		
var rallyDataSource;
var teamVelocity;
var backlog;

rally.addOnLoad(onLoad);

function onLoad() 
{
	rallyDataSource = new rally.sdk.data.RallyDataSource('__WORKSPACE_OID__',
   	                                                     '__PROJECT_OID__',
       	                                                 '__PROJECT_SCOPING_UP__',
           	                                             '__PROJECT_SCOPING_DOWN__');
	rallyDataSource.setApiVersion(API);
	
	var velocity = document.createElement('div');
	velocity.id = 'velocity';
	
	var status = document.createElement('div');
	status.id = 'status';
	
	var create = document.createElement('div');
	create.id = 'CreateNewIteration';
	create.innerHTML = '<input type="text" id="NewIterationName"></input><button type="button" onclick="CreateNewIteration(this);">Create New Iteration</button><br/><button type="button" onclick="rally.sdk.util.Navigation.popupCreatePage(\'HierarchicalRequirement\', {})">New Story</button>';

	var backlog = document.createElement('div');
	backlog.id = 'backlog';
	
	var _body = document.getElementsByTagName('body') [0];
	
	_body.appendChild(velocity);
	_body.appendChild(status);
	_body.appendChild(create);
	_body.appendChild(backlog);
						
	teamVelocity = new Velocity(rallyDataSource, velocity);
	backlog = new Backlog(rallyDataSource, backlog);
}	
	
function CreateNewIteration(button)
{
	var IterationName = document.getElementById('NewIterationName').value;
	var queryObject = 
	{
       	key: 'Iterations',
      	type: 'Iteration',
   	 	fetch: 'EndDate',
   		order: 'EndDate desc',
       	pagesize: 1
	};
	if(IterationName != '')
	{
		function getStartDate(results)
		{
			var StartDate = new Date(results.Iterations[0].EndDate);
			var EndDate = new Date(StartDate);
			var newIteration = {};

   	        StartDate.setHours(0);
			StartDate.setDate(StartDate.getDate() + 1);
			EndDate.setDate(EndDate.getDate() + DaysInIteration);

			newIteration["Name"] = IterationName;
			newIteration["StartDate"] = StartDate.toISOString();
			newIteration["EndDate"] = EndDate.toISOString();
			newIteration["State"] = "Planning";
				
			rallyDataSource.create("Iteration", newIteration, onComplete,onError);			
		}
   	    rallyDataSource.find(queryObject, getStartDate);
		document.getElementById('NewIterationName').value = '';
	}
}