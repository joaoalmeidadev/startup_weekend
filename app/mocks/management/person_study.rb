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
       hours_done: hours_done, review_accuracy: REVIEW_ACCURACY.fetch(@person[:status]),
       saved: saved, salary_informed: @person[:salary].present?,
       learner_hourly: rule.learner_hourly_for(@person[:salary]), reward_share: rule.props[:reward_share]}
    end

    def rule = @rule ||= PointsRule.for_sector(@person[:sector])

    # R$ of in-person training saved, content by content: who would give that training + the person's own hour
    def saved
      learner_hourly = rule.learner_hourly_for(@person[:salary])
      done_modules.sum do |mod|
        mod[:teaching_hours] * (rule.teacher_hourly_for(mod[:teacher_salary]) + learner_hourly)
      end.round
    end

    def streak_days
      minutes = @person[:weekly_minutes]
      minutes.positive? ? (minutes / 10).clamp(1, 7) : 0
    end

    # Hours studied × the person's own hour (their salary, or the sector's learner salary) × the company's share
    def points
      rule.points_for(hours_done, salary: @person[:salary])
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
