# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Floor.delete_all
Floor.create!([
  {name: "Floor 1", level:1, json: "[]"},
  {name: "Floor 2", level:2, json: "[]"},
  {name: "Floor 3", level:3, json: "[]"}
])