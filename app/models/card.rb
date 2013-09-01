class Card < ActiveRecord::Base
  belongs_to :user, :foreign_key => :author_id, :primary_key => :id

end