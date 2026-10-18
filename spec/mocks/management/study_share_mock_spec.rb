require "rails_helper"

RSpec.describe Management::StudyShareMock do
  subject(:share) { described_class.new.props }

  let(:total) { share[:by_sector].sum { |slice| slice[:hours] } }

  it "splits the training hours replaced among the work sectors only, most first" do
    expect(share[:by_sector]).to eq([
      {label: "Atendimento", hours: 74},
      {label: "Comercial", hours: 23},
      {label: "Logística", hours: 6}
    ])
  end

  it "shows the four people who study the most by first name and folds the rest into Outros" do
    expect(share[:by_person]).to eq([
      {label: "Carla", hours: 23},
      {label: "Diego", hours: 23},
      {label: "Rafael", hours: 14},
      {label: "Lucas", hours: 14},
      {label: "Outros", hours: 29}
    ])
  end

  it "adds up to the same total in both charts" do
    expect(share[:by_person].sum { |slice| slice[:hours] }).to eq(total)
    expect(total).to eq(103)
  end
end
