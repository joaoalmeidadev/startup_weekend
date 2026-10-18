module Management
  # Example journeys built by HR. Each one has a kind (Base, Empresa or Setor), who receives it
  # (sectors/groups or specific people) and an ordered list of modules. A person receives every active
  # journey that reaches them and studies them in the kind order: Base → Empresa → Setor.
  module JourneyCatalog
    STRETCHES = {base: "Base", company: "Empresa", sector: "Setor"}.freeze

    # "Base Nivela pronta": only ready-made Nivela products, for a company that has no material yet
    READY_BASE = %w[raciocinio-logico interpretacao-de-instrucoes conversa-clara escrita-no-trabalho matematica-do-dia-a-dia].freeze

    ALL_SECTORS = %w[Atendimento Comercial Logística].freeze

    JOURNEYS = {
      "base-nivela" => {
        name: "Base Nivela", kind: "base", status: "active", badge: "Base Nivela concluída",
        audience: {type: "sectors", names: ALL_SECTORS}, modules: %w[conversa-clara matematica-do-dia-a-dia]
      },
      "jeito-distribuidora-sul" => {
        name: "Jeito Distribuidora Sul", kind: "company", status: "active", badge: "Jeito Distribuidora Sul",
        audience: {type: "sectors", names: ALL_SECTORS}, modules: %w[nossa-historia-e-valores rotinas-de-atendimento]
      },
      "atendimento-na-pratica" => {
        name: "Atendimento na prática", kind: "sector", status: "active", badge: "Nivelado em Atendimento",
        audience: {type: "sectors", names: ["Atendimento"]}, modules: %w[tratamento-de-reclamacoes uso-do-sistema]
      },
      "logistica-na-pratica" => {
        name: "Logística na prática", kind: "sector", status: "active", badge: "Nivelado em Logística",
        audience: {type: "sectors", names: ["Logística"]}, modules: %w[conferencia-de-carga seguranca-no-armazem]
      },
      "promocao-para-lider" => {
        name: "Promoção para líder", kind: "company", status: "draft", badge: "Pronto para liderar",
        audience: {type: "sectors", names: ["Staff"]}, modules: %w[postura-e-empatia trabalho-em-equipe escrita-no-trabalho]
      }
    }.freeze

    def self.find(id)
      journey = JOURNEYS.fetch(id) { raise ActiveRecord::RecordNotFound, "Journey #{id} not found" }
      journey.merge(id: id, people_in_progress: people_in_progress(journey))
    end

    def self.all
      JOURNEYS.keys.map { |id| find(id) }
    end

    def self.using_module(module_id)
      all.select { |journey| journey[:modules].include?(module_id) }
    end

    # Drafts reach nobody yet
    def self.active = all.select { |journey| journey[:status] == "active" }

    def self.for_person(person)
      active.select { |journey| reaches?(journey[:audience], person) }
    end

    def self.for_sector(sector)
      active.select { |journey| journey[:audience][:type] == "sectors" && journey[:audience][:names].include?(sector) }
    end

    # Module ids by kind, from every journey the person receives; a module shared by two journeys counts once
    def self.path_for(person)
      seen = []
      by_kind(person) do |journeys|
        (journeys.flat_map { |journey| journey[:modules] } - seen).uniq.tap { |ids| seen.concat(ids) }
      end
    end

    def self.names_for(person)
      by_kind(person) { |journeys| journeys.pluck(:name) }
    end

    def self.by_kind(person)
      journeys = for_person(person)
      STRETCHES.keys.to_h { |kind| [kind, yield(journeys.select { |journey| journey[:kind] == kind.to_s })] }
    end

    def self.reaches?(audience, person)
      return audience[:names].include?(person[:name]) if audience[:type] == "people"

      audience[:names].any? { |name| SectorCatalog.members(name).any? { |member| member[:name] == person[:name] } }
    end

    # Audience members still leveling
    def self.people_in_progress(journey)
      return 0 if journey[:status] == "draft"

      audience_members(journey[:audience]).count { |person| person[:status] != "leveled" }
    end

    def self.audience_members(audience)
      return PeopleMock::PEOPLE.select { |person| audience[:names].include?(person[:name]) } if audience[:type] == "people"

      audience[:names].flat_map { |name| SectorCatalog.members(name) }.uniq
    end

    private_class_method :by_kind, :reaches?, :people_in_progress, :audience_members
  end
end
