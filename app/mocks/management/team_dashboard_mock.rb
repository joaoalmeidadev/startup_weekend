module Management
  # Example dashboard metrics for the Atendimento team (14 people), per period.
  # Competencies and the funnel are a snapshot of today, so they don't change with the period.
  class TeamDashboardMock
    PERIODS = {
      "30d" => {
        label: "30 dias", change: 7, days_to_level: 38,
        over_time: [["sem 1", 50], ["sem 2", 52], ["sem 3", 55], ["sem 4", 57]],
        engagement: ["11 de 14", "1.284", "4,2 dias", "86"]
      },
      "90d" => {
        label: "90 dias", change: 21, days_to_level: 41,
        over_time: [["ago", 36], ["set", 45], ["out", 57]],
        engagement: ["10 de 14", "3.902", "3,8 dias", "241"]
      },
      "6m" => {
        label: "6 meses", change: 43, days_to_level: 46,
        over_time: [["mai", 14], ["jun", 21], ["jul", 29], ["ago", 36], ["set", 45], ["out", 57]],
        engagement: ["9 de 14", "7.410", "3,5 dias", "472"]
      }
    }.freeze
    DEFAULT_PERIOD = "6m"
    ENGAGEMENT_LABELS = ["Ativos por semana (média)", "Minutos estudados", "Sequência média", "Lições concluídas"].freeze

    def initialize(period = nil)
      @period = PERIODS.key?(period) ? period : DEFAULT_PERIOD
      @data = PERIODS.fetch(@period)
    end

    def props
      {
        sector: "Atendimento",
        period: @period,
        periods: PERIODS.map { |key, data| {key: key, label: "Últimos #{data[:label]}"} },
        leveled: {count: 8, total: 14, change: @data[:change], change_label: "em #{@data[:label]}"},
        days_to_level: @data[:days_to_level],
        leveled_over_time: @data[:over_time].map { |label, percent| {label: label, percent: percent} },
        company_target: 80,
        competencies: competencies,
        engagement: ENGAGEMENT_LABELS.zip(@data[:engagement]).map { |label, value| {label: label, value: value} },
        funnel: funnel
      }
    end

    private

    def competencies
      [
        {name: "Comunicação e Escuta Ativa", team_average: 82, goal: 80},
        {name: "Reclamações de Entrega", team_average: 71, goal: 85},
        {name: "Sistema de Pedidos", team_average: 68, goal: 75},
        {name: "Postura e Empatia", team_average: 79, goal: 85}
      ]
    end

    def funnel
      [
        {stage: "Começaram a jornada", count: 14},
        {stage: "Concluíram a Base", count: 12},
        {stage: "Concluíram Empresa", count: 10},
        {stage: "Concluíram Setor", count: 9},
        {stage: "Nivelados (selo)", count: 8}
      ]
    end
  end
end
