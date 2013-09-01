class CardController < ApplicationController
  before_filter :authenticate_user!

  def index
    all_cards = Card.all
    render :json => { :status => 'success',
      :result =>  { :data => all_cards}
    }
  end

  def show
    #for viewing the specific details of a card.
  end

  def create
    #POST to create a card

  end

  def edit

  end

  def update
    #edit an old card, can only access this if you created this card
    @card = Card.find(params[:id])

    if @card.nil?
      render_404
      return
    end
    if current_user.id <> @card.user.id
      render_403
      return
    end
  end

  def destroy
    #can't destroy this card
    @card = Card.find(params[:id])
  end
end
