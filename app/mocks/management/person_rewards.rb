module Management
  # The badge, milestones and rewards of one person; the rewards catalog itself is still empty (Recompensas tab)
  class PersonRewards
    REDEEMED = {
      "leveled" => [{name: "Folga de meio período", date: "12/09", points: 300},
        {name: "Vale-lanche R$ 30", date: "28/08", points: 150}],
      "on_track" => [{name: "Vale-lanche R$ 30", date: "02/10", points: 150}],
      "late" => []
    }.freeze
    BADGE_DATE = "14/08"
    STREAK_MILESTONE = 3
    KIND_ORDER = JourneyCatalog::STRETCHES.keys.map(&:to_s).freeze

    def initialize(person, study)
      @person = person
      @study = study
    end

    def badge
      {label: badge_label, earned: leveled?, date: leveled? ? BADGE_DATE : nil, forecast: PersonOverview.new(@person).forecast}
    end

    def milestones
      finished_journeys.map { |journey| "Concluiu a jornada #{journey[:name]}" } + streak + earned_badge
    end

    def rewards
      redeemed = REDEEMED.fetch(@person[:status])
      {points: @study.points, balance: @study.points - redeemed.sum { |reward| reward[:points] }, redeemed: redeemed}
    end

    private

    def leveled? = @person[:status] == "leveled"

    def journeys = @journeys ||= JourneyCatalog.for_person(@person).sort_by { |journey| KIND_ORDER.index(journey[:kind]) }

    def done_ids = JourneyCatalog.path_for(@person).values.flatten.first(@person[:completed])

    def finished_journeys
      done = done_ids
      journeys.select { |journey| journey[:modules].any? && (journey[:modules] - done).empty? }
    end

    # The sector journey names the badge; without one, the person levels in their sector
    def badge_label
      journeys.find { |journey| journey[:kind] == "sector" }&.dig(:badge) || "Nivelado em #{@person[:sector]}"
    end

    def streak
      days = @study.streak_days
      (days >= STREAK_MILESTONE) ? ["#{days} dias seguidos de estudo"] : []
    end

    def earned_badge = leveled? ? ["Ganhou o selo #{badge_label}"] : []
  end
end
