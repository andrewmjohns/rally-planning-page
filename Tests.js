function simpleTest()
{
	ok( 1 === 1, "Passed!" );
}

test( "hello test", simpleTest);
test( 'Add Stories Defect', AddStoriesDefectsTest);
test( 'Compare Stories Test', CompareStoriesTest);

function AddStoriesDefectsTest()
{
	var Story1 = { Rank: 1 };
	var Story2 = { Rank: 2 };
	var Story3 = { Rank: 2 };
	var Backlog = new BacklogModel();

	ok( 1 === 1, "Passed!" );
}

function CompareStoriesTest()
{
	var Story1 = { Rank: 1 };
	var Story2 = { Rank: 2 };
	var Story3 = { Rank: 2 };
	var Backlog = new BacklogModel();
	
	ok(Backlog.compareStories(Story1, Story2) < 0, "Properly compares greater than.");
	ok(Backlog.compareStories(Story2, Story1) > 0, "Properly compares less than.");
	ok(Backlog.compareStories(Story2, Story2) === 0, "Properly compares equal.");	
}