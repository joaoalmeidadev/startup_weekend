require "rails_helper"

RSpec.describe Management::KnowledgeSubmissionCatalog do
  it "keeps what the collaborators proposed, with author, hours and status" do
    expect(described_class.all.map { |item| item.values_at(:author, :status) }).to contain_exactly(
      ["Carla Silveira", "pending"], ["Rafael Lima", "pending"], ["Maria Souza", "approved"], ["Maria Souza", "pending"]
    )
  end

  it "suggests the points by the hours informed × the author's hour × the company share" do
    carla = described_class.all.find { |item| item[:author] == "Carla Silveira" }
    # 3 h × R$ 12/h × 40%
    expect(carla).to include(hours: 3, suggested_points: 14, awarded_points: nil)
  end

  it "gives the approved ones the awarded points" do
    approved = described_class.all.find { |item| item[:status] == "approved" }
    expect(approved).to include(title: "Clientes difíceis: o que funciona", awarded_points: 8)
  end

  it "brings each proposal with lessons and their answer key" do
    submissions = described_class.all
    submissions.each do |item|
      expect(item[:lessons]).not_to be_empty
      item[:lessons].each { |lesson| expect(lesson[:question][:options].count { |option| option[:correct] }).to eq(1) }
    end
  end

  it "adds up the points a person earned by sharing knowledge" do
    expect(described_class.points_for("Maria Souza")).to eq(8)
    expect(described_class.points_for("Bruna Costa")).to eq(0)
  end

  it "finds a proposal by id and lists the pending ones" do
    expect(described_class.pending.size).to eq(3)
    expect(described_class.find(described_class.pending.first[:id])).to be_present
  end
end
