class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.integer :user_id
      t.integer :card_id
      t.timestamps
    end

    #add foreign key reference to users
    reversible do |dir|
      dir.up do
        execute "ALTER TABLE votes ADD CONSTRAINT fk_votes_users FOREIGN KEY (user_id) REFERENCES users(id);"
        execute "ALTER TABLE votes ADD CONSTRAINT fk_votes_cards FOREIGN KEY (card_id) REFERENCES cards(id);"
      end
      dir.down do
        execute "ALTER TABLE votes DROP FOREIGN KEY fk_votes_users;"
        execute "ALTER TABLE votes DROP FOREIGN KEY fk_votes_cards;"
      end
    end
  end
end