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