class VotesController < ApplicationController
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
        :result =>  { :message => 'Could not save this vote.'}
      }
    end
  end
  def vote_params
    params.require(:vote).permit(:card_id)
  end
end