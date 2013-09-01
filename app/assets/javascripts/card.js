//=require jquery.pep.min.js

//this is inteded to encapsulate logic around the card
//it may be worth refactoring this code with Angular.js in the future to decouple
//the business logic from the UI.
var PitchCardView = {
	centerCard : function (){
		if(PitchCardView.data.$elem  !== "undefined"){
			var $elem = PitchCardView.data.$elem;

			var width = $elem.outerWidth();
			var height = $elem.outerHeight();

			var parentWidth = $elem.parent().width();
			var parentHeight = $elem.parent().height();

			var top = (parentHeight - height)/2;
			var left = (parentWidth - width)/2;

			$elem.css("left", left + "px");
			$elem.css("top", top + "px")
		}
	},
	init : function (nav, elem) {
		PitchCardView.data = {};
		PitchCardView.data.$elem = $(elem);
		PitchCardView.data.$elem.pep({
			droppable: '.drop-target',
			overlapFunction: function($a, $b){
				var cardRect = $b[0].getBoundingClientRect();
    			var regionRect = $a[0].getBoundingClientRect();

    			displayMaybe = function(){
    				$b.addClass("maybe");
    				$b.removeClass("no");
    				$b.removeClass("yes");
    			};

    			displayNo = function(){
    				$b.removeClass("maybe");
    				$b.addClass("no");
    				$b.removeClass("yes");
    			}

    			displayYes = function(){
    				$b.removeClass("maybe");
    				$b.removeClass("no");
    				$b.addClass("yes");
    			}

    			var overlaps = false;
    			if($a.hasClass("top")){
    				overlaps = cardRect.top < regionRect.bottom;
    				if(overlaps){
    					displayMaybe();
    				}
    			} else if ($a.hasClass("left")){
					overlaps = cardRect.left < regionRect.right;
					if(overlaps){
						displayNo();
					}
    			} else if ($a.hasClass("left-bottom")){
    				//the card is going down, and the distance between the region's right edge
    				//and its left edge is more than 50% of the card's width

    				overlaps = cardRect.bottom > regionRect.bottom &&
    					(cardRect.left < regionRect.right) &&
    					cardRect.right - regionRect.right < (cardRect.width/ 2);

    				if(overlaps){
    					displayNo();
    				}
    			} else if ($a.hasClass("right-bottom") ){
    				//the card is going down, and the distance between the region's left edge
    				//and its right edge is more than 50% of the card's width

    				overlaps = cardRect.bottom > regionRect.bottom &&
    					(cardRect.right > regionRect.left) &&
    					cardRect.right - regionRect.left > (cardRect.width/ 2);

    				if(overlaps){
    					displayYes();
    				}
    			} else if ($a.hasClass("right")){

    				overlaps = cardRect.right > regionRect.left;
    				if(overlaps){
    					displayYes();
    				}
    			}
    			return overlaps;
			},
 	 		//smooths out animation
 	 		useCSSTranslation: false,
			start : function(ev, obj) {
				//the card has started moving
			},
			stop : function(ev, obj) {
				//the card has stopped moving,
				//if its not moving back to the
				if (obj.activeDropRegions.length == 0) {
					//center the card
					PitchCardView.centerCard();
					PitchCardView.data.$elem.removeClass("maybe").removeClass("no").removeClass("yes");
				}
			},
			rest: function(ev, obj) {
				//the card has come to rest
				if(obj.activeDropRegions.length > 0){
					Pitch.submit();
				}
			},
			drag: function(ev, obj) {
			}
		});
		PitchCardView.resizeParent();
	},
	submit : function(){
		var elem = Pitch.data.$elem;
/*
		var $selection;
		for(var i =0; i < elem.activeDropRegions.length; i ++){
			var $region = elem.activeDropRegions[0];
			if(!$selection){
				//first selection
				$selection = $region;
			} else if(!$region.hasClass('top')){
				//give the yes and no region preference,
				//if there is overlap with maybe
				$selection = $region;
			}
		}

		if($selection){

		}
*/
	},
	resizeParent : function() {
		if(PitchCardView.data.$elem  !== "undefined"){
			var $parent = PitchCardView.data.$elem.parent();
			$parent.height(window.innerHeight - $parent.position().top);
			PitchCardView.centerCard();
		}
	},
};

