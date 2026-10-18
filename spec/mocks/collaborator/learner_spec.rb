require "rails_helper"

RSpec.describe Collaborator::Learner do
  subject(:props) { described_class.new.props }

  it "lists Maria's journeys in order: finished, the one she is doing and the queue" do
    expect(props[:journeys].map { |journey| journey.values_at(:name, :status) }).to eq(
      [["Base Nivela", "done"], ["Jeito Distribuidora Sul", "active"], ["Atendimento na prática", "queued"]]
    )
  end

  it "prices each step by its hours, Maria's own hour and the company share" do
    company = props[:journeys].second
    expect(company[:steps].map { |step| step.values_at(:name, :hours, :points, :status) }).to eq(
      [["Nossa História e Valores", 2, 8, "done"], ["Rotinas de atendimento", 6, 23, "current"]]
    )
    expect(company).to include(points_earned: 8, points_total: 31)
  end

  it "tells the next step and how much it is worth" do
    expect(props[:next_step]).to include(journey: "Jeito Distribuidora Sul", name: "Rotinas de atendimento", points: 23)
  end

  it "adds the points of study and of shared knowledge, minus what was redeemed" do
    expect(props[:points]).to include(study: 30, sharing: 8, total: 38, balance: 13)
  end

  it "brings the streak and the badges" do
    expect(props[:streak_days]).to eq(3)
    expect(props[:badges].pluck(:earned)).to include(true, false)
  end
end
