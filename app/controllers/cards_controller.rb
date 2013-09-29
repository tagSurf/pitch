class CardsController < ApplicationController
  before_filter :authenticate_user!

  def index
    user = User.find(current_user.id)
    if user.nil?
      return render_403
    end
    if user.is_admin
      @all_cards = Card.all
    else
      #this is a naiive approach to get new cards to vote on:
      #get the next 20 cards such that:
      # - never show yes or no votes again
      # - never show the user's cards
      # - show maybe votes again, but always after new content
      #get all votes by this user ordered by date
      previous_votes = Vote.where("user_id = ? AND vote_type in ('no', 'yes')", user.id).map {|v| v.card_id}
      if previous_votes.any?
        @all_cards = Card.where('author_id <> ? AND id NOT in (?)', user.id, previous_votes).order("created_at DESC").limit(20)
      else
        @all_cards = Card.where('author_id <> ?', user.id).order("created_at DESC").limit(20)
      end
    end

    respond_to do |format|
      format.html { render "index" }
      format.json { render :json => { :status => 'success', :result =>  { :cards => @all_cards } } }
    end
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
    params.require(:card).permit(:excerpt,:title)
  end
end
