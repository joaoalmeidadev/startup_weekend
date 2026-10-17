module Management
  # Example goal calibration from the Stitch "Meta do setor" screen
  class SectorGoalMock
    SECTORS = %w[Atendimento Comercial Logística].freeze

    def initialize(sector = nil)
      @sector = SECTORS.include?(sector) ? sector : SECTORS.first
    end

    def props
      competencies = send(:"#{@sector.parameterize.underscore}_competencies")
      {
        sector: @sector,
        sectors: SECTORS,
        experts_count: competencies.empty? ? 0 : 5,
        competencies: competencies
      }
    end

    private

    # Logística has no experts invited yet, which matches the alert on the HR home
    def logistica_competencies = []

    def comercial_competencies
      [
        competency("Negociação com Clientes", "handshake", 84, 75, 6, "atingiram esta meta."),
        competency("Cálculo de Descontos e Margem", "calculate", 90, 80, 4, "atingiram esta meta."),
        competency("Cadastro de Pedidos", "receipt_long", 86, 80, 7, "atingiram esta meta.")
      ]
    end

    def atendimento_competencies
      [
        competency("Comunicação e Escuta Ativa", "record_voice_over", 88, 80, 8, "do setor já atingiram esta meta."),
        competency("Resolução de Reclamações de Entrega", "local_shipping", 92, 85, 5, "atingiram esta meta."),
        competency("Uso do Sistema Interno de Pedidos", "terminal", 85, 75, 7, "atingiram esta meta."),
        competency("Postura e Empatia com Clientes Difíceis", "sentiment_satisfied", 90, 85, 6, "atingiram esta meta.")
      ]
    end

    def competency(name, icon, experts_average, goal, reached, reached_text)
      {name: name, icon: icon, experts_average: experts_average, goal: goal,
       reached: {count: reached, of: 10, text: reached_text}}
    end
  end
end
