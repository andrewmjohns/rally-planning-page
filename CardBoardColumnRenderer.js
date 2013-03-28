function VelocityColumnRenderer(board, value, options) {
	//Extend the basic renderer
    rally.sdk.ui.cardboard.BasicColumnRenderer.call(this, board, value, options);

	var that = this;
	var dndContainer;
	var cards = 0;
	var columnDiv;
	var capacity = Infinity;
	var resourcesDisplay;

    this.render = function() {
    	columnDiv = document.createElement("div");
    	dojo.addClass(columnDiv, "column");

        var columnHeader = document.createElement("div");
        dojo.addClass(columnHeader, "columnHeader");
        columnHeader.appendChild(document.createTextNode(options.displayValue || value));
        
        if (options && options.wipLimit) {
        	capacity = options.wipLimit;
           	resourcesDisplay = document.createElement("div");
           	dojo.addClass(resourcesDisplay,"capacityDisplay");
           	setCapacityText();
           	columnHeader.appendChild(resourcesDisplay);
        }

		columnDiv.appendChild(columnHeader);

        dndContainer = document.createElement("div");
        dojo.addClass(dndContainer, "columnContent");
        columnDiv.appendChild(dndContainer);

         return columnDiv;
       };

      function setCapacityText() {
         if (options && options.wipLimit) {
           dojo.empty(resourcesDisplay);
           resourcesDisplay.innerHTML = getCapacityText(cards, capacity);
           if (capacity >= cards) {
             dojo.removeClass(columnDiv, "overCapacity");
           } else {
             dojo.addClass(columnDiv, "overCapacity");
           }
         }
       }

       function getCapacityText(cards, wip) {
         if (wip === Infinity) {
           return " (" + cards + '/<span class="infinitySymbol">&#8734;</span>)';
         }
           else {
             return " (" + cards + "/" + wip + ")";
         }
       }

       this.addNoDropClass = function(items) {
         if (capacity === Infinity) {
           return false;
         }
         return capacity <= cards;
       };

       this.cardRemoved = function(card) {
         cards-=card.PlanEstimate;
         setCapacityText();
       };

       this.cardAdded = function(card) {
         cards+=card.PlanEstimate;
         setCapacityText();
       };

       this.getDndContainer = function() {
         return dndContainer;
       };

       this.getColumnNode = function() {
         return columnDiv;
       };

       this.clear = function() {
         dojo.empty(that.getDndContainer());
         cards = 0;
         setCapacityText();
       };
    };
