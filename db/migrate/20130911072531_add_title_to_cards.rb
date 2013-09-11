class AddTitleToCards < ActiveRecord::Migration
  def change
    add_column :cards, :title, :string, :null => false
  end
end
