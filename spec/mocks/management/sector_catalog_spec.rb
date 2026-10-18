require "rails_helper"

RSpec.describe Management::SectorCatalog do
  it "lists the work sectors and the custom groups" do
    expect(described_class.all.map { |sector| sector.values_at(:name, :kind) })
      .to eq([["Atendimento", "sector"], ["Comercial", "sector"], ["Logística", "sector"], ["Staff", "group"]])
  end

  it "puts each person in their work sector" do
    members = described_class.members("Atendimento").pluck(:name)

    expect(members).to include("Maria Souza", "Carla Silveira")
    expect(members).to all(satisfy { |name| Management::PeopleMock::PEOPLE.find { |p| p[:name] == name }[:sector] == "Atendimento" })
  end

  it "builds a group from people of different sectors" do
    staff = described_class.members("Staff")

    expect(staff.pluck(:name)).to contain_exactly("Carla Silveira", "Diego Fernandes", "Lucas Pereira", "Rafael Lima")
    expect(staff.pluck(:sector).uniq).to contain_exactly("Atendimento", "Comercial")
  end

  it "gives the target of the sector level, or nil without a goal" do
    expect(described_class.target("Atendimento")).to eq(75)
    expect(described_class.target("Staff")).to eq(60)
    expect(described_class.target("Logística")).to be_nil
  end

  it "lists the audience options with how many people each one has" do
    expect(described_class.audience_options).to include(
      {name: "Atendimento", kind: "sector", people_count: 5},
      {name: "Staff", kind: "group", people_count: 4}
    )
  end

  it "finds a sector by its slug" do
    expect(described_class.find_by_slug("logistica")[:name]).to eq("Logística")
    expect(described_class.find_by_slug("nope")).to be_nil
  end
end
