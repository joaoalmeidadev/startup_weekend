class AddRoleToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :role, :string, null: false, default: "collaborator"
    add_index :users, :role
  end
end
