class Floor < ActiveRecord::Base
    validates :name, presence: true
    validates :level, :inclusion => 1..3
    validates :json, length: { minimum: 0, allow_nil: false, message: "can't be nil" }
end
