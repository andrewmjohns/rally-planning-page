function padzero(n) {
    return n < 10 ? '0' + n : n;
}

function pad2zeros(n) {
    if (n < 100) {
        n = '0' + n;
    } 
    if (n < 10) {
        n = '0' + n;
    }
    return n;
}
    
function toISOString(d) {
    return d.getUTCFullYear() + '-' +  padzero(d.getUTCMonth() + 1) + '-' + padzero(d.getUTCDate()) + 'T' + padzero(d.getUTCHours()) + ':' +  padzero(d.getUTCMinutes()) + ':' + padzero(d.getUTCSeconds()) + '.' + pad2zeros(d.getUTCMilliseconds()) + 'Z';
}

function onError(response)
{
	updateStatus('Update did not complete. Please check javascript log.', ERRORCOLOR);
	console.log(response);
}

function onComplete(object, warnings)
{
	if(warnings.length !== 0)
	{
		updateStatus('Update completed with warnings. ' + warnings[0], WARNINGCOLOR);
		console.log(warnings);
	} 
	else 
	{
		updateStatus('Update successful.', SUCCESSCOLOR);
	}
}

//Changes the text and color of the status element on the screen to the specified text and color
function updateStatus(statusString, statusColor)
{
	document.getElementById('status').innerHTML = statusString;
    document.getElementById('status').style.background = statusColor;
    
	function resetStatus()
	{
		document.getElementById('status').innerHTML = '';
        document.getElementById('status').style.background='';
    }

	setTimeout(resetStatus, 2000);
}

//Sort an array of user stories based on rank
function sortFunc(a, b)
{
	return a.Rank - b.Rank;
}