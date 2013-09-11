class DoNotAllowNilValues < ActiveRecord::Migration
  def change
    change_column :votes, :vote_type, :string, :null => false
    change_column :cards, :excerpt, :string, :null => false
  end
end
