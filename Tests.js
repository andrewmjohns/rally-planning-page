function initializeKeyTest(assert)
{
	var ws = new RallyWebService(testKey);
	
	function testKey(response)
	{
		assert.ok(ws.securityKey !== '', "Valid key.");
		start();
	}
}

asyncTest( 'Initialize key test', 1, initializeKeyTest);