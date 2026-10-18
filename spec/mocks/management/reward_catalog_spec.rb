require "rails_helper"

RSpec.describe Management::RewardCatalog do
  it "prices a reward so it costs at most 40% of the training it saved" do
    expect(described_class.points_for(25)).to eq(53)
    expect(described_class.points_for(150)).to eq(313)
  end

  it "still asks for some effort when the reward costs nothing" do
    expect(described_class.points_for(0)).to eq(30)
  end

  it "tells how much in-person training the points saved" do
    expect(described_class.saved_for(53)).to eq(63.6)
  end

  it "keeps every reward and idea within the rule" do
    (described_class.rewards + described_class.ideas).each do |reward|
      expect(reward[:cost]).to be <= described_class.saved_for(reward[:points]) * 0.4
    end
  end

  it "offers six rewards and a few ideas to register" do
    expect(described_class.rewards.pluck(:name)).to eq(
      ["Caneca Nivela", "Vale-lanche", "Ingresso de cinema", "Escolher a escala da semana", "Meio período de folga", "Dia de folga"]
    )
    expect(described_class.ideas.pluck(:name)).to include("Almoço com o gestor", "Vale-combustível")
  end

  it "finds a reward by name" do
    expect(described_class.find("Vale-lanche")).to include(cost: 30, points: 63)
  end
end
