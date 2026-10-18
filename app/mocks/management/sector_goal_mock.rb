module Management
  # Example sector goal: the HR picks a market level and fine-tunes each competency,
  # using the veterans average only as a reference.
  class SectorGoalMock
    SECTORS = %w[Atendimento Comercial Logística].freeze

    LEVELS = [
      {key: "easy", label: "Fácil", target: 60, hint: "Funções de entrada ou o primeiro mês na empresa."},
      {key: "medium", label: "Médio", target: 75, hint: "O padrão do mercado para a função."},
      {key: "hard", label: "Difícil", target: 90, hint: "Times que atendem clientes exigentes ou lidam com risco."}
    ].freeze

    # Logística has no goal yet, which matches the alert on the HR home
    SECTOR_LEVELS = {"Atendimento" => "medium", "Comercial" => "medium", "Logística" => nil}.freeze

    def initialize(sector = nil)
      @sector = SECTORS.include?(sector) ? sector : SECTORS.first
    end

    def props
      competencies = send(:"#{@sector.parameterize.underscore}_competencies")
      {
        sector: @sector,
        sectors: SECTORS,
        levels: LEVELS,
        level: level_key,
        experts_count: level_key ? 5 : 0,
        competencies: competencies
      }
    end

    # Overall score a person needs to be Nivelado in this sector; nil while there is no goal
    def target
      LEVELS.find { |level| level[:key] == level_key }&.fetch(:target)
    end

    private

    def level_key = SECTOR_LEVELS.fetch(@sector)

    def logistica_competencies
      [
        competency("Conferência e Expedição", "inventory_2"),
        competency("Matemática Básica", "calculate"),
        competency("Raciocínio Lógico", "psychology")
      ]
    end

    # Comercial has 16 people
    def comercial_competencies
      [
        competency("Negociação com Clientes", "handshake", 84, [10, 16]),
        competency("Cálculo de Descontos e Margem", "calculate", 90, [9, 16]),
        competency("Cadastro de Pedidos", "receipt_long", 86, [12, 16])
      ]
    end

    # Atendimento has 14 people and 8 Nivelados (see TeamDashboardMock), so every goal is reached by at least 8
    def atendimento_competencies
      [
        competency("Comunicação e Escuta Ativa", "record_voice_over", 88, [12, 14]),
        competency("Resolução de Reclamações de Entrega", "local_shipping", 92, [8, 14]),
        competency("Uso do Sistema Interno de Pedidos", "terminal", 85, [8, 14]),
        competency("Postura e Empatia com Clientes Difíceis", "sentiment_satisfied", 90, [10, 14])
      ]
    end

    def competency(name, icon, experts_average = nil, reached = nil)
      count, of = reached
      {name: name, icon: icon, experts_average: experts_average, goal: target,
       reached: reached && {count: count, of: of}}
    end
  end
end
