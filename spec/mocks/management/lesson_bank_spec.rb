require "rails_helper"

RSpec.describe Management::LessonBank do
  let(:bank) { described_class.new(Management::ModuleCatalog.find("conversa-clara")) }

  it "varies the format of the lessons, always in the same order" do
    module_of_eight = described_class.new(Management::ModuleCatalog.find("rotinas-de-atendimento"))

    expect((1..8).map { |position| module_of_eight.media(position)[:format] })
      .to eq(%w[video text audio image quiz text quiz text])
  end

  it "tells how long each format takes" do
    expect((1..4).map { |position| bank.media(position)[:duration] })
      .to eq(["3:20", "2 min de leitura", "2:45", "1 min"])
  end

  it "credits the Sebrae video as the first lesson of the customer service product, and no other" do
    service = described_class.new(Management::ModuleCatalog.find("atendimento-ao-cliente"))

    expect(service.media(1)).to include(format: "video", credit: "Sebrae · curso gratuito (ilustrativo)")
    expect(service.media(2)[:credit]).to be_nil
    expect(bank.media(1)[:credit]).to be_nil
  end

  it "counts the formats of the whole module" do
    expect(bank.formats).to eq(video: 1, text: 1, audio: 1, image: 1)
  end

  it "keeps the SAC questions of the AI module" do
    sac = described_class.new(Management::ModuleCatalog.find("rotinas-de-atendimento"))

    expect(sac.question(2)[:prompt]).to include("atraso")
  end
end
