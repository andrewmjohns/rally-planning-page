function RallyWebService(onload)
{	
    this.getToken = function()
    {
		this.sendRequest('GET', 'security/authorize', this.tokenResponse);
	};
		
	this.sendRequest = function(method, uri, callback, content)
	{
		this.xmlhttp.open(method, this.baseUrl + uri, true);
		this.xmlhttp.withCredentials = true;
		this.xmlhttp.onload = $.proxy(callback, this);
    	this.xmlhttp.send(content);
	};

	this.tokenResponse = function()
	{
		try
		{
			var response = $.parseJSON(this.xmlhttp.response);
    		this.securityToken = response.OperationResult.SecurityToken;
    	}
    	catch(err)
    	{
    		console.error(err);
			throw 'Could not parse security token. ' + this.xmlhttp.response;
		}
		if(this.onload !== undefined)
		{ 
			this.onload(response);
		}
	};
	this.xmlhttp = new XMLHttpRequest();
	this.baseUrl = 'https://rally1.rallydev.com/slm/webservice/v2.0/';
	this.onload = onload;
	this.securityToken = '';
	
	this.getToken();
}

function wsDelete(objectID, type)
{
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
        {
			onComplete('','');

			document.getElementById(objectID).parentNode.removeChild(document.getElementById(objectID));
		}
		else if (xmlhttp.readyState === 4)
		{
			onError(xmlhttp);
		}
    };

	xmlhttp.open('DELETE', RALLY_WEB_SERVICE_URL + type + '/' + objectID, true);
    xmlhttp.send();
}
	
function updateStory(StoryRef,key,value)
{ 
	var change = {};

	change._ref = StoryRef;
	change[key] = value;
	rallyDataSource.update(change, onComplete, onError);
}