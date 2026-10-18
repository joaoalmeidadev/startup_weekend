require "rails_helper"

RSpec.describe Management::PointsRule do
  it "costs the manager hour plus the person hour for each hour of in-person training" do
    expect(described_class.new.hour_cost).to eq(85)
  end

  it "turns the admin's share of that saving into points, 1 point = R$ 1 in rewards" do
    expect(described_class.new.points_per_hour).to eq(34)
    expect(described_class.new(reward_share: 0.5).points_per_hour).to eq(43)
  end

  it "prices a step by the hours of training it replaces" do
    rule = described_class.new

    expect(rule.points_for(6)).to eq(204)
    expect(rule.saved_for(6)).to eq(510)
  end

  it "shares the rule with the pages" do
    expect(described_class.new.props).to eq(manager_hourly: 60, person_hourly: 25, reward_share: 0.4)
  end
end
