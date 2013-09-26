//Story with no parent, release, or iteration
var storyModel = 
{
	_ref: 'https://rally1.rallydev.com/', //URL to a story object
	ObjectID: '12345', //string
	Rank: '1', //number
	FormattedID: 'US12345', //string
	Name: 'Test Story', //string
	PlanEstimate: '3', //number
	Parent: null, //if type is not defect then it can be a story object itself that must have an ObjectID and Name
	Release: null, //an object that if not null must have a _ref and Name
	Iteration: null, //an object that if not null must have a _ref and Name
	_type: 'HierarchicalRequirment'//Defect or Hierarchical requirement
};
testStory = new Story(storyModel, [], []);

asyncTest( 'Initialize key test', 1, initializeKeyTest);
test('Story display test', storyDisplayTest);
test('Story field display test', storyFieldDisplayTest);
test('Select box display test', selectBoxDisplayTest);

function storyFieldDisplayTest(assert)
{
	var HTML = testStory.storyField('https://rally1.rallydev.com/', '_ref');
	var expectedHTML = '<td class="_ref">https://rally1.rallydev.com/</td>';

	assert.equal(expectedHTML, HTML.outerHTML, 'Story Field HTML is as expected.');
}

function selectBoxDisplayTest(assert)
{
	var test = new SelectBox('', 'https://rally1.rallydev.com/', [], 'Release');
	var HTML = test.display();
	var expectedHTML = "<select name='https://rally1.rallydev.com/' onchange='javascript:updateStory(this.name,\"Release\",this.options[this.selectedIndex].value)' onclick='this.focus()'><option value='' selected='selected'></option></select>";
	assert.equal(expectedHTML, HTML, 'Story Field HTML is as expected.');
}

function storyDisplayTest(assert)
{
	
	var tableRow = testStory.display();
	var expectedHTML = '<td class="_ref">https://rally1.rallydev.com/</td><td class="Rank">1</td><td class="ID">US12345</td><td class="Name"><a href="#">Test Story</a></td><td class="Points"><input size="2" name="https://rally1.rallydev.com/" value="3" onchange="javascript:updateStory(this.name,&quot;PlanEstimate&quot;,this.value);" type="text"></td><td class="Parent"></td><td class="Release"><select name="https://rally1.rallydev.com/" onchange="javascript:updateStory(this.name,&quot;Release&quot;,this.options[this.selectedIndex].value)" onclick="this.focus()"><option value="" selected="selected"></option></select></td><td class="Iteration"><select name="https://rally1.rallydev.com/" onchange="javascript:updateStory(this.name,&quot;Iteration&quot;,this.options[this.selectedIndex].value)" onclick="this.focus()"><option value="" selected="selected"></option></select></td><td class="EditLinks"><a title="Create child story" style="background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -1122px;" href="#" onclick="rally.sdk.util.Navigation.popupCreatePage(&quot;HierarchicalRequirement&quot;, {parent: 12345})"></a><a title="Edit story" style="background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -595px;" href="#" onclick="rally.sdk.util.Navigation.popupEditPage(&quot;/HierarchicalRequirment/12345&quot;)"></a><a title="Delete story" style="background:url(https://rally1.rallydev.com/slm/images/sprites.gif) 0 -442px;" href="#" onclick="javascript:wsDelete(&quot;12345&quot;, &quot;HierarchicalRequirment&quot;);"></a></td>'
	
	assert.equal(tableRow.innerHTML, expectedHTML, 'Story innerHTML is as expected.');
	
	//Story with a parent
	//Story without a release
	//Story with a release
	//Story without an iteration
	//Story with an iteration
	//Story with a list of releases
	//Story with a list of iterations
	//Defect
	//Story that is a parent (I don't show these so not sure how this works)?
}

function initializeKeyTest(assert)
{
	var ws = new RallyWebService(testKey);
	
	function testKey(response)
	{
		assert.ok(ws.securityKey !== '', 'Valid key.');
		start();
	}
}