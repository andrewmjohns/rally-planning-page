function Iteration (RallyDataSource, today, callback){
	this.Name = "";
	this._ref = "";
	var that = this;
	RallyDataSource.findAll( {
	     	key: 'iterations',
	        type: 'Iteration',
         	fetch: 'Name',
	     	query: '(StartDate >= "' + today + '")'
		}, function (results) {
			that.Name = results.iterations[0].Name;
			that._ref = results.iterations[0]._ref;
			callback();
		}
	);
}