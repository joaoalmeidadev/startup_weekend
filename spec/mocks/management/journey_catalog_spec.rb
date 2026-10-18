require "rails_helper"

RSpec.describe Management::JourneyCatalog do
  def person(name) = Management::PeopleMock::PEOPLE.find { |row| row[:name] == name }

  it "gives every journey a kind, an audience and a flat ordered list of modules" do
    journey = described_class.find("atendimento-na-pratica")

    expect(journey).to include(kind: "sector", audience: {type: "sectors", names: ["Atendimento"]},
      modules: %w[tratamento-de-reclamacoes uso-do-sistema], status: "active")
    expect(described_class.all.pluck(:kind).uniq).to contain_exactly("base", "company", "sector")
  end

  it "counts the people of the audience still leveling, and nobody while it is a draft" do
    expect(described_class.find("atendimento-na-pratica")[:people_in_progress]).to eq(3)
    expect(described_class.find("base-nivela")[:people_in_progress]).to eq(7)
    expect(described_class.find("promocao-para-lider")).to include(status: "draft", people_in_progress: 0,
      audience: {type: "sectors", names: ["Staff"]})
  end

  it "finds the journeys that use a module" do
    expect(described_class.using_module("nossa-historia-e-valores").pluck(:id)).to eq(["jeito-distribuidora-sul"])
  end

  it "gives a person every active journey of their sector, groups or name" do
    expect(described_class.for_person(person("Maria Souza")).pluck(:id))
      .to eq(%w[base-nivela jeito-distribuidora-sul atendimento-na-pratica])
    expect(described_class.for_person(person("Paula Santos")).pluck(:id)).to eq(%w[base-nivela jeito-distribuidora-sul])
  end

  it "reaches people named one by one" do
    stub_const("Management::JourneyCatalog::JOURNEYS", described_class::JOURNEYS.merge(
      "so-a-paula" => {name: "Só a Paula", kind: "sector", status: "active", badge: "Selo",
                       audience: {type: "people", names: ["Paula Santos"]}, modules: %w[vendas-basico]}
    ))

    expect(described_class.for_person(person("Paula Santos")).pluck(:id)).to include("so-a-paula")
    expect(described_class.path_for(person("Paula Santos"))[:sector]).to eq(%w[vendas-basico])
  end

  it "builds the person's path by kind: Base, then Empresa, then Setor" do
    expect(described_class.path_for(person("Marcos Oliveira"))).to eq(
      base: %w[conversa-clara matematica-do-dia-a-dia],
      company: %w[nossa-historia-e-valores rotinas-de-atendimento],
      sector: %w[conferencia-de-carga seguranca-no-armazem]
    )
    expect(described_class.path_for(person("Paula Santos"))[:sector]).to eq([])
  end

  it "keeps a module shared by two journeys only where it first appears" do
    stub_const("Management::JourneyCatalog::JOURNEYS", described_class::JOURNEYS.merge(
      "logistica-na-pratica" => described_class::JOURNEYS["logistica-na-pratica"]
        .merge(modules: %w[conversa-clara conferencia-de-carga])
    ))

    path = described_class.path_for(person("Marcos Oliveira"))
    expect(path[:base]).to eq(%w[conversa-clara matematica-do-dia-a-dia])
    expect(path[:sector]).to eq(%w[conferencia-de-carga])
  end

  it "names the journeys of each kind the person receives" do
    expect(described_class.names_for(person("Paula Santos")))
      .to eq(base: ["Base Nivela"], company: ["Jeito Distribuidora Sul"], sector: [])
  end

  it "lists the journeys a whole sector receives" do
    expect(described_class.for_sector("Logística").pluck(:name))
      .to eq(["Base Nivela", "Jeito Distribuidora Sul", "Logística na prática"])
  end
end
