class AddVoteType < ActiveRecord::Migration
  def change
    add_column :votes, :vote_type, :string
    change_column :votes, :user_id, :integer, :null => false
    change_column :votes, :card_id, :integer, :null => false
  end
end
