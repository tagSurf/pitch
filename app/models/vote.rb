class Vote < ActiveRecord::Base
  belongs_to :user, :foreign_key => :user_id, :primary_key => :id
  belongs_to :card, :foreign_key => :card_id, :primary_key => :id
end