class VotesController < ApplicationController
  before_filter :authenticate_user!

  def create
    user = User.find(current_user.id)
    vote = user.votes.new(vote_params)

    if !vote.valid?
      render :json => { :status => 'error',
        :result =>  { :errors => vote.errors}
      }
    elsif vote.save!
      render :json => { :status => 'success',
        :result => { :message => 'Thanks for your vote!'}
      }
    else
      render :json => { :status => 'error',
        :result =>  { :message => 'Oops! Could not save your vote. Please try again later.'}
      }
    end
  end

  private
  def vote_params
    params.require(:vote).permit(:card_id,:vote_type)
  end
end