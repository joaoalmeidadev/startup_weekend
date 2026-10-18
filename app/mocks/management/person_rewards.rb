module Management
  # The badge, milestones and rewards of one person (rewards from the RewardCatalog)
  class PersonRewards
    # What each kind of person already traded points for (1 point = R$ 1 of the reward's cost)
    REDEEMED = {
      "leveled" => [["Meio período de folga", "12/09"], ["Vale-lanche", "28/08"]],
      "on_track" => [["Vale-lanche", "02/10"]],
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
      redeemed = REDEEMED.fetch(@person[:status]).map do |name, date|
        {name: name, date: date, points: RewardCatalog.find(name)[:points]}
      end
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
