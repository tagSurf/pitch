#encoding: utf-8
class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|
      t.string :title
      t.string :excerpt
      t.string :description
      #add default timestamps
      t.timestamps
      t.integer :author_id, :null => false
    end
    #add foreign key reference to users
    reversible do |dir|
      dir.up do
        execute "ALTER TABLE cards ADD CONSTRAINT fk_cards_users FOREIGN KEY (author_id) REFERENCES users(id);"
      end
      dir.down do
        execute "ALTER TABLE cards DROP FOREIGN KEY fk_cards_users;"
      end
    end
  end
end