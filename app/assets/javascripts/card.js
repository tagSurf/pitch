//=require jquery.pep.min.js
//=require knockout-2.3.js

var CardModel = function(cardId, excerpt, title){
        var self = this;
        self.cardId = cardId;
        self.excerpt = excerpt;
        self.title = title;
        self.candidate = ko.observable("none");
        self.vote = ko.observable("none");

        self.candidate.subscribe(function(value){
            console.log("Candidate is now " + value);
        });
    };

var VoteViewModel = function(data, nextPage){
    var self = this;
    self.nextPage = nextPage;
    //all cards
    self.cards = ko.observableArray();
    //the card in view
    self.currentCard = ko.observable();

    self.currentCard.subscribe(
        function(card){
            if(!card){ return; }
            self.currentCard().vote.subscribe(
                function(vote){
                    if(vote === 'maybe' || vote === 'yes' || vote === 'no'){
                        var postUrl = '<%= votes_path() %>';
                        var data = {
                            'vote' : {
                                'card_id' : self.currentCard().cardId,
                                'vote_type' : vote
                            }
                        };

                        var deferred = Application.ajaxPost(postUrl, data);
                        deferred.done(function(data, textStatus, jqXHR) {
                                if(typeof data !== 'undefined' && typeof data.status != 'undefined'){
                                    var successful = data.status === 'success';

                                    if(successful && self.cards().length > 0){
                                        self.currentCard(self.cards.shift());
                                        CardUI.unbind();
                                        CardUI.init();
                                    } else {
                                        self.currentCard(null);
                                    }
                                }
                        });
                    }
                }
            );
        }
    );

    var mapDataToCards = function(cardsData){
        if( typeof cardsData === 'undefined' || !cardsData){ return; }

        for(var i = cardsData.length - 1; i >= 0; i --){
            var card = cardsData[i];
            if(!self.currentCard() || self.currentCard().cardId != card.id){
                //don't reappend the card we're already viewing
                var model = new CardModel(card.id, card.excerpt, card.title);
                //add the to the front of the array so that we keep the order consistent
                self.cards.unshift(model);
            }
        }
    };

    (function(){
        mapDataToCards(data);

        if(self.cards().length > 0){
            self.currentCard(self.cards.shift());
        }
        //try to get more cards every minute
        window.setInterval(
            function(){
                if(self.nextPage){
                    var deferred = $.ajax({
                        'type' : 'GET',
                        'url' : self.nextPage
                    });

                    deferred.done(
                        function(data, textStatus, jqXHR) {
                            if(typeof data !== 'undefined' && typeof data.status != 'undefined' && typeof data.result !== 'undefined'){
                                var successful = data.status === 'success';
                                if(successful && data.result.cards){
                                    mapDataToCards(data.result.cards);
                                }
                            }
                        }
                    );
                }
            },
        60 * 1000);
    })();
};

var CardUI = {
    centerCard : function(){
        var width = CardUI.$element.outerWidth();
        var height = CardUI.$element.outerHeight();

        var parentWidth = CardUI.$element.parent().innerWidth();
        var parentHeight = CardUI.$element.parent().innerHeight();


  var parentPadding = 10;
        var top = (parentHeight - height)/2 + parentPadding;
        var left = (parentWidth - width)/2 + parentPadding;

        CardUI.$element.css("left", left + "px");
        CardUI.$element.css("top", top + "px")
    },
    resizeParent : function(){
        var $parent = CardUI.$element.parent();
        $parent.height(window.innerHeight - $parent.position().top);
        CardUI.centerCard();
    },
    init : function(){
        CardUI.$element = $("#card");
  var observable = CardUI.viewModel.currentCard().candidate;
  var settle = CardUI.viewModel.currentCard().vote;

        CardUI.$element.pep({
            droppable: '.drop-target',
            //smooths out animation
            useCSSTranslation: false,
            overlapFunction: function($a, $b){

                var cardRect = $b[0].getBoundingClientRect();
            var regionRect = $a[0].getBoundingClientRect();

            var overlaps = false;

            if($a.hasClass("top")){
                overlaps = cardRect.top < regionRect.bottom;
                if(overlaps){
                    observable("maybe");
                }
            } else if ($a.hasClass("left")){
                    overlaps = cardRect.left < regionRect.right;
                    if(overlaps){
                        observable("no");
                    }
            } else if ($a.hasClass("left-bottom")){
                //the card is going down, and the distance between the region's right edge
                //and its left edge is more than 50% of the card's width
                overlaps = cardRect.bottom > regionRect.bottom && (cardRect.left < regionRect.right) &&
                    (cardRect.right - regionRect.right) < (cardRect.width/ 2);

                if(overlaps){
                    observable("no");
                }
            } else if ($a.hasClass("right-bottom") ){
                //the card is going down, and the distance between the region's left edge
                //and its right edge is more than 50% of the card's width

                overlaps = cardRect.bottom > regionRect.bottom &&
                    (cardRect.right > regionRect.left) &&
                    cardRect.right - regionRect.left > (cardRect.width/ 2);

                if(overlaps){
                    observable("yes");
                }
            } else if ($a.hasClass("right")){

                overlaps = cardRect.right > regionRect.left;
                if(overlaps){
                    observable("yes");
                }
            }
            return overlaps;
            },
            start : function(ev, obj) {
                //the card has started moving
            },
            drag : function(ev, obj){
                if(obj.activeDropRegions.length == 0) {
                    observable("none");
                }
            },
            stop : function(ev, obj) {
                //the card has stopped moving,
                //if its not moving back to the
                if (obj.activeDropRegions.length == 0) {
                    //center the card
                    CardUI.centerCard();
                    observable("none");
                }
            },
            rest: function(ev, obj){
                if(obj.activeDropRegions.length > 0){
                    settle(observable());
                }
            }
        });

        CardUI.resizeParent();

        $(window).resize(function(){
            CardUI.resizeParent();
        });
    },
    unbind : function(){
        $.pep.unbind(CardUI.$element);
    }
};