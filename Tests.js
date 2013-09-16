function getTokenTest(assert)
{
	var ws = new RallyWebService(testToken);
	
	function testToken(response)
	{
		assert.ok(ws.securityToken !== '', "Valid Token.");
		start();
	}
}

asyncTest( 'Get Token Test', 1, getTokenTest);