module Management
  # The single list of work sectors and custom groups (e.g. Staff), each with its people and its goal.
  # A person belongs to one work sector (PeopleMock :sector) and may also be in groups.
  class SectorCatalog
    LEVELS = [
      {key: "easy", label: "Fácil", target: 60, hint: "Funções de entrada ou o primeiro mês na empresa."},
      {key: "medium", label: "Médio", target: 75, hint: "O padrão do mercado para a função."},
      {key: "hard", label: "Difícil", target: 90, hint: "Times que atendem clientes exigentes ou lidam com risco."}
    ].freeze

    # Competencies: [name, icon, veterans average, [people who reach the goal, of]]
    SECTORS = [
      {name: "Atendimento", kind: "sector", level: "medium", competencies: [
        ["Comunicação", "record_voice_over", 88, [12, 14]],
        ["Reclamações", "local_shipping", 92, [8, 14]],
        ["Sistema", "terminal", 85, [8, 14]],
        ["Empatia", "sentiment_satisfied", 90, [10, 14]]
      ]},
      {name: "Comercial", kind: "sector", level: "medium", competencies: [
        ["Vendas", "handshake", 84, [10, 16]],
        ["Margem", "calculate", 90, [9, 16]],
        ["Pedidos", "receipt_long", 86, [12, 16]]
      ]},
      # Logística has no goal yet and pays a bit less, so it has its own training cost (see PointsRule)
      {name: "Logística", kind: "sector", level: nil, training_cost: {teacher_salary: 3960, learner_salary: 1980}, competencies: [
        ["Conferência", "inventory_2"],
        ["Matemática", "calculate"],
        ["Raciocínio", "psychology"]
      ]},
      {name: "Staff", kind: "group", level: "easy",
       members: ["Carla Silveira", "Diego Fernandes", "Lucas Pereira", "Rafael Lima"], competencies: [
         ["Comunicação", "record_voice_over"],
         ["Raciocínio", "psychology"],
         ["Colaboração", "diversity_3"]
       ]}
    ].freeze

    def self.all = SECTORS

    def self.names = SECTORS.pluck(:name)

    def self.find(name) = SECTORS.find { |sector| sector[:name] == name }

    def self.find_by_slug(slug) = SECTORS.find { |sector| sector[:name].parameterize == slug }

    def self.members(name)
      sector = find(name)
      return [] unless sector

      if sector[:kind] == "group"
        PeopleMock::PEOPLE.select { |person| sector[:members].include?(person[:name]) }
      else
        PeopleMock::PEOPLE.select { |person| person[:sector] == name }
      end
    end

    def self.level(name) = LEVELS.find { |level| level[:key] == find(name)&.dig(:level) }

    # Overall score a person needs to be Nivelado here; nil while there is no goal
    def self.target(name) = level(name)&.fetch(:target)

    def self.audience_options
      SECTORS.map { |sector| {name: sector[:name], kind: sector[:kind], people_count: members(sector[:name]).size} }
    end
  end
end
