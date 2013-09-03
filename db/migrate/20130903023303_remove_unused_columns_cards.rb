class RemoveUnusedColumnsCards < ActiveRecord::Migration
  def change
    remove_column :cards, :title, :string
    remove_column :cards, :description, :string
  end
end
