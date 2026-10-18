require "rails_helper"

RSpec.describe Management::RewardCatalog do
  it "prices each reward at one point per real of cost" do
    expect(described_class.find("Caneca Nivela")).to include(cost: 25, points: 25)
    expect(described_class.find("Dia de folga")).to include(cost: 150, points: 150)
  end

  it "hand-sets the points of a reward that costs nothing" do
    expect(described_class.find("Escolher a escala da semana")).to include(cost: 0, points: 40)
  end

  it "keeps every reward and idea at or above its cost" do
    (described_class.rewards + described_class.ideas).each do |reward|
      expect(reward[:points]).to be >= reward[:cost]
    end
  end

  it "offers seven rewards, one cheap enough for the first study points, and a few ideas" do
    expect(described_class.rewards.pluck(:name)).to eq(
      ["Barra de chocolate", "Caneca Nivela", "Vale-lanche", "Ingresso de cinema", "Escolher a escala da semana", "Meio período de folga", "Dia de folga"]
    )
    expect(described_class.ideas.pluck(:name)).to include("Almoço com o gestor", "Vale-combustível")
    expect(described_class.ideas.first).to include(name: "Vale-combustível", cost: 50, points: 50)
  end

  it "finds a reward by name" do
    expect(described_class.find("Vale-lanche")).to include(cost: 30, points: 30)
  end
end
