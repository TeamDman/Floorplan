class CreateFloors < ActiveRecord::Migration
  def change
    create_table :floors do |t|
      t.string :name
      t.string :json
      t.integer :level
      t.timestamps null: false
    end
  end
end
