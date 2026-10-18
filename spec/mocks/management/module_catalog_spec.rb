require "rails_helper"

RSpec.describe Management::ModuleCatalog do
  it "tags every module with one of the three origins and the hours of hand-off it replaces" do
    described_class::MODULES.each_value do |mod|
      expect(described_class::SOURCES).to include(mod[:source])
      expect(mod[:teaching_hours]).to be_between(2, 6)
    end
  end

  it "takes every Base module from the Nivela library" do
    base = described_class::MODULES.values.select { |mod| mod[:stretch] == :base }

    expect(base.pluck(:source).uniq).to eq(["nivela"])
  end

  it "keeps the AI sample module under review" do
    expect(described_class.find("rotinas-de-atendimento")).to include(source: "ai", status: "in_review")
  end

  it "offers at least three modules for each origin, with AI and company ones outside Base" do
    described_class::SOURCES.each do |source|
      modules = described_class.by_source(source)

      expect(modules.size).to be >= 3
      expect(modules.pluck(:stretch).uniq).not_to include("base") unless source == "nivela"
    end
  end

  it "lists a summary with the origin, the hours and the goal competency it covers" do
    expect(described_class.summary("conversa-clara")).to include(
      source: "nivela", teaching_hours: 3, covers: "Comunicação e Escuta Ativa", stretch: "base"
    )
    expect(described_class.summary("matematica-do-dia-a-dia")[:covers]).to eq("Matemática básica")
  end

  it "offers ready-made Nivela products for general work skills beyond Base" do
    nivela = described_class.by_source("nivela")

    expect(nivela.pluck(:stretch).uniq).to contain_exactly("base", "sector")
    expect(nivela.pluck(:id)).to include("atendimento-ao-cliente", "interpretacao-de-instrucoes", "vendas-basico")
  end

  it "highlights the skills companies struggle with the most, first" do
    highlighted = described_class.by_source("nivela").select { |mod| mod[:research_share] }

    expect(highlighted.pluck(:id, :research_share)).to eq([
      ["raciocinio-logico", 56], ["interpretacao-de-instrucoes", 44], ["conversa-clara", 44], ["escrita-no-trabalho", 38]
    ])
    expect(described_class.by_source("nivela").first(4)).to eq(highlighted)
  end
end
