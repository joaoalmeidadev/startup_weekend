module Management
  # Example dashboard for the Atendimento team (14 people), per period: proof that the team is learning.
  # Competencies, the manager's on-the-job review and who studies the most are a snapshot of today, so they don't change with the period.
  class TeamDashboardMock
    PERIODS = {
      "30d" => {
        label: "30 dias", change: 7, days_to_level: 38, gain: [52, 71], new_hires: 2,
        over_time: [["sem 1", 50], ["sem 2", 52], ["sem 3", 55], ["sem 4", 57]],
        retention: [88, "11 de 14", 6]
      },
      "90d" => {
        label: "90 dias", change: 21, days_to_level: 41, gain: [50, 76], new_hires: 5,
        over_time: [["ago", 36], ["set", 45], ["out", 57]],
        retention: [86, "10 de 14", 6]
      },
      "6m" => {
        label: "6 meses", change: 43, days_to_level: 46, gain: [48, 79], new_hires: 9,
        over_time: [["mai", 14], ["jun", 21], ["jul", 29], ["ago", 36], ["set", 45], ["out", 57]],
        retention: [86, "9 de 14", 5]
      }
    }.freeze
    DEFAULT_PERIOD = "6m"
    # Hand-off hours per new hire (same as the pitch); their cost comes from the admin's PointsRule
    HANDOFF_HOURS_PER_HIRE = 23
    DAYS_TO_LEVEL_BEFORE = 90

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
        leveled_over_time: @data[:over_time].map { |label, percent| {label: label, percent: percent} },
        company_target: 80,
        knowledge_gain: {before: @data[:gain].first, now: @data[:gain].last},
        time_to_level: {days: @data[:days_to_level], before_days: DAYS_TO_LEVEL_BEFORE},
        savings: savings,
        retention: retention,
        competencies: competencies,
        on_the_job: on_the_job,
        study_share: StudyShareMock.new.props
      }
    end

    private

    def savings
      hours = @data[:new_hires] * HANDOFF_HOURS_PER_HIRE
      {new_hires: @data[:new_hires], hours: hours, amount: PointsRule.new.saved_for(hours)}
    end

    def retention
      accuracy, active_weekly, minutes = @data[:retention]
      {review_accuracy: accuracy, active_weekly: active_weekly, minutes_per_day: minutes}
    end

    # Goals follow the Atendimento sector goal (see SectorCatalog); "before" is the diagnostic average
    def competencies
      goal = SectorCatalog.target("Atendimento")
      [
        {name: "Comunicação", before: 55, now: 82, goal: goal},
        {name: "Reclamações", before: 42, now: 71, goal: goal},
        {name: "Sistema", before: 38, now: 68, goal: goal},
        {name: "Empatia", before: 58, now: 79, goal: goal}
      ]
    end

    def on_the_job
      {
        source: "Avaliação do gestor aos 30 dias",
        items: [
          {label: "Retrabalho por novato", before: 2.6, now: 1.6, unit: "por mês"},
          {label: "Reclamações de cliente", before: 8, now: 6, unit: "por mês"}
        ]
      }
    end
  end
end
