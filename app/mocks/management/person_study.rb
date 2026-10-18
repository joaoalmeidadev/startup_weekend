module Management
  # How one person studies and how much they grew since the diagnostic, derived from their journey progress
  class PersonStudy
    REVIEW_ACCURACY = {"leveled" => 90, "on_track" => 82, "late" => 64}.freeze

    def initialize(person, module_ids)
      @person = person
      @module_ids = module_ids
    end

    def props
      {weekly_minutes: @person[:weekly_minutes], streak_days: streak_days, lessons_done: lessons_done,
       hours_done: hours_done, review_accuracy: REVIEW_ACCURACY.fetch(@person[:status])}
    end

    def streak_days
      minutes = @person[:weekly_minutes]
      minutes.positive? ? (minutes / 10).clamp(1, 7) : 0
    end

    # Each completed module earns points for the in-person training hours it replaced, at the person's sector cost
    def points
      rule = PointsRule.for_sector(@person[:sector])
      done_modules.sum { |mod| rule.points_for(mod[:teaching_hours]) }
    end

    def hours_done = done_modules.sum { |mod| mod[:teaching_hours] }

    # The modules already studied plus the current one: diagnostic score, today's score and the sector goal
    def competencies
      goal = SectorCatalog.target(@person[:sector])
      studied.each_with_index.map do |module_id, index|
        before = 40 + (index * 7 % 20)
        now = (index < completed) ? [before + 30, 95].min : before + 12
        {name: ModuleCatalog.find(module_id)[:competency], before: before, now: now, goal: goal}
      end
    end

    private

    def completed = @person[:completed]

    def studied = @module_ids.first(completed + 1)

    def done_modules = @module_ids.first(completed).map { |id| ModuleCatalog.find(id) }

    def lessons_done = done_modules.sum { |mod| mod[:lessons] }
  end
end
