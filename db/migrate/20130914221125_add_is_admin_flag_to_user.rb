class AddIsAdminFlagToUser < ActiveRecord::Migration
  def change
    add_column :users, :is_admin, :boolean, :null => false, :default => 0
  end
end
