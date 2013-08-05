//=require jquery.pep.min.js

var Pitch = {
	centerCard : function (){
		if(Pitch.data.$elem  !== "undefined"){
			var $elem = Pitch.data.$elem;

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
		Pitch.data = {};
		Pitch.data.$elem = $(elem);
		Pitch.data.$elem.pep({
			droppable: '.drop-target',
			overlapFunction: function($a, $b){
				var cardRect = $b[0].getBoundingClientRect();
    			var regionRect = $a[0].getBoundingClientRect();

    			if($a.hasClass("top")){
    				return cardRect.top < regionRect.bottom;
    			} else if ( $a.hasClass("left-corner") ){
    				//the card is going down, and the distance between the region's right edge
    				//and its left edge is more than 50% of the card's width
    				return cardRect.bottom > regionRect.bottom && 
    					(cardRect.left < regionRect.right) &&
    					cardRect.right - regionRect.right < (cardRect.width/ 2);
    			} else if ( $a.hasClass("right-corner") ){
    				//the card is going down, and the distance between the region's left edge
    				//and its right edge is more than 50% of the card's width
    				return cardRect.bottom > regionRect.bottom && 
    					(cardRect.right > regionRect.left) &&
    					cardRect.right - regionRect.left > (cardRect.width/ 2);
    			}
    			return false;
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
					Pitch.centerCard();
				}
			},
			rest: function(ev, obj) {
				//the card has come to rest
				
			}, 
			drag: function(ev, obj) {
			}
		});
		Pitch.resizeParent();
	},
	resizeParent : function() {
		if(Pitch.data.$elem  !== "undefined"){
			var $parent = Pitch.data.$elem.parent();
			$parent.height(window.innerHeight - $parent.position().top);
			Pitch.centerCard();
		}
	},
};

$(document).ready(function() {
	Pitch.init("nav","#card");

	$(window).resize(function(){
		Pitch.resizeParent();		
	});
});

