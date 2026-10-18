module Collaborator
  # Maria Souza as the collaborator sees herself, from the same data the admin uses: the journeys that reach her
  # (one at a time), what each step is worth in points, her points and balance, streak and badges.
  class Learner
    NAME = "Maria Souza"
    KIND_ORDER = Management::JourneyCatalog::STRETCHES.keys.map(&:to_s).freeze

    def props
      {name: NAME, journeys: journeys, next_step: next_step, points: points,
       streak_days: detail[:study][:streak_days], badges: badges}
    end

    private

    def person = @person ||= Management::PeopleMock::PEOPLE.find { |row| row[:name] == NAME }

    def detail = @detail ||= Management::PersonMock.new(NAME.parameterize).props

    def rule = @rule ||= Management::PointsRule.for_sector(person[:sector])

    # Every module of her path, in order, so each step knows if it is done, the current one or still locked
    def path_ids = @path_ids ||= Management::JourneyCatalog.path_for(person).values.flatten

    def step_status(module_id)
      index = path_ids.index(module_id)
      return "done" if index < person[:completed]

      (index == person[:completed]) ? "current" : "locked"
    end

    def journeys
      @journeys ||= Management::JourneyCatalog.for_person(person)
        .sort_by { |journey| KIND_ORDER.index(journey[:kind]) }
        .map { |journey| journey_props(journey) }
    end

    def journey_props(journey)
      steps = journey[:modules].map { |id| step_props(id) }
      {id: journey[:id], name: journey[:name], kind: journey[:kind], badge: journey[:badge], status: journey_status(steps),
       steps: steps, points_total: steps.sum { |step| step[:points] },
       points_earned: steps.select { |step| step[:status] == "done" }.sum { |step| step[:points] }}
    end

    def step_props(module_id)
      mod = Management::ModuleCatalog.summary(module_id)
      {module_id: module_id, name: mod[:name], hours: mod[:teaching_hours], lessons: mod[:lessons],
       points: rule.points_for(mod[:teaching_hours], salary: person[:salary]), status: step_status(module_id)}
    end

    def journey_status(steps)
      return "done" if steps.all? { |step| step[:status] == "done" }

      (steps.any? { |step| step[:status] == "current" }) ? "active" : "queued"
    end

    def next_step
      journey = journeys.find { |item| item[:status] == "active" }
      step = journey && journey[:steps].find { |item| item[:status] == "current" }
      step && {journey: journey[:name], module_id: step[:module_id], name: step[:name], points: step[:points]}
    end

    def points
      rewards = detail[:rewards]
      {study: rewards[:study_points], sharing: rewards[:sharing_points], total: rewards[:points], balance: rewards[:balance]}
    end

    def badges
      sector_journey = journeys.find { |journey| journey[:kind] == "sector" }
      [{title: "Base concluída", icon: "verified", earned: journeys.first[:status] == "done"},
        {title: "#{detail[:study][:streak_days]} dias seguidos", icon: "local_fire_department", earned: detail[:study][:streak_days] >= 3},
        {title: "Compartilhou conhecimento", icon: "volunteer_activism", earned: points[:sharing].positive?},
        {title: sector_journey ? sector_journey[:badge] : "Nivelado", icon: "military_tech", earned: person[:status] == "leveled"}]
    end
  end
end
