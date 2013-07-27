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
			start : function(ev, obj){
				//the card has started moving
			},
			stop : function(ev, obj){
				//the card has stopped moving

			},
			rest: function(ev, obj){
				//the card has come to rest
				
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
	}
};

$(document).ready(function() {
	Pitch.init("nav","#card");

	$(window).resize(function(){
		Pitch.resizeParent();		
	});
});

