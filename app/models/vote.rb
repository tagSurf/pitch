class Vote < ActiveRecord::Base
  belongs_to :user, :foreign_key => :user_id, :primary_key => :id
  belongs_to :card, :foreign_key => :card_id, :primary_key => :id

  def no?
    self.vote_type == 'no'
  end

  def yes?
    self.vote_type == 'yes'
  end

  def maybe?
    self.vote_type == 'maybe'
  end
end