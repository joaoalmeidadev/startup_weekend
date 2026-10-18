require "rails_helper"

RSpec.describe Management::PersonRewards do
  it "never lets anyone redeem more points than they earned" do
    Management::PeopleMock::PEOPLE.each do |person|
      rewards = Management::PersonMock.new(person[:name].parameterize).props[:rewards]

      expect(rewards[:balance]).to be >= 0, "#{person[:name]} has a negative balance"
    end
  end
end
