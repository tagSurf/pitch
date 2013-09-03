class CardsController < ApplicationController
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

  def new
    @card = Card.new
    render "edit"
  end

  def create
    #POST to create a card
    user = User.find(current_user.id)
    card = user.cards.new(card_params)
    save_and_render_result(card)
  end

  def edit
    @card = Card.find(params[:id])
    render "edit"
  end

  def update
    #edit an old card, can only access this if you created this card
    @card = Card.find(params[:id])
    if @card.nil?
      render_404
      return
    end
    if current_user.id != @card.user.id
      render_403
      return
    end
    @card.update_attributes(card_params)
    save_and_render_result(@card)
  end

  def destroy
    if @card.nil?
      render_404
      return
    end
    if current_user.id != @card.user.id
      render_403
      return
    end
    @card = Card.find(params[:id])
  end

  private
  def save_and_render_result(card)
    if !card.valid?
      render :json => { :status => 'error',
        :result =>  { :errors => card.errors}
      }
    elsif card.save!
      render :json => { :status => 'success',
        :result => { :message => 'Successfully saved your card!'}
      }
    else
      render :json => { :status => 'error',
        :result =>  { :message => 'Could not save this card.'}
      }
    end
  end

  def card_params
    params.require(:card).permit(:excerpt)
  end
end
