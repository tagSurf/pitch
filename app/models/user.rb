class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable
  has_many :cards, :foreign_key => :author_id, :primary_key => :id
  has_many :votes, :foreign_key => :user_id, :primary_key => :id
end
