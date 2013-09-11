class Card < ActiveRecord::Base
  belongs_to :user, :foreign_key => :author_id, :primary_key => :id
  validates :excerpt, length: { maximum: 140 }, presence: true
  validates :title, presence: true
end