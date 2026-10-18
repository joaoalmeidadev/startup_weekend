module Management
  # How study turns into savings and points. One hour of in-person training saves the hour of who teaches plus the
  # hour of who learns (monthly salary ÷ 220 h, no extra charges, so it stays conservative). The learner earns
  # points for the hours they study: their own hour × the company's share (1 point = R$ 1 in rewards).
  # A sector may have its own salaries (SectorCatalog); a person's informed salary prices their own points.
  class PointsRule
    HOURS_PER_MONTH = 220
    DEFAULTS = {teacher_salary: 4400, learner_salary: 2200, reward_share: 0.4}.freeze

    def self.for_sector(name)
      own = SectorCatalog.find(name)&.dig(:training_cost)
      own ? new(**own) : new
    end

    # Several sectors receive the journey: their cheapest hour, so its points never go beyond the real saving
    def self.cheapest(names)
      names.map { |name| for_sector(name) }.min_by(&:hour_cost) || new
    end

    def self.own_cost?(name) = SectorCatalog.find(name)&.dig(:training_cost).present?

    def initialize(**overrides)
      @rule = DEFAULTS.merge(overrides)
    end

    def props = @rule

    def teacher_hourly = hourly(@rule[:teacher_salary])

    def learner_hourly = hourly(@rule[:learner_salary])

    def hour_cost = (teacher_hourly + learner_hourly).round(2)

    # The hour of a given learner, from their own salary when it was informed
    def learner_hourly_for(salary) = salary ? hourly(salary) : learner_hourly

    def saved_with_learner(hours, learner_hourly) = (hours * (teacher_hourly + learner_hourly)).round

    # Points come from the learner's own hour (their salary when informed), never from who teaches
    def points_per_hour(salary: nil) = (learner_hourly_for(salary) * @rule[:reward_share]).round(1)

    def points_for(hours, salary: nil) = (hours * learner_hourly_for(salary) * @rule[:reward_share]).round

    def saved_for(hours) = (hours * hour_cost).round

    private

    def hourly(salary) = (salary.to_f / HOURS_PER_MONTH).round(2)
  end
end
