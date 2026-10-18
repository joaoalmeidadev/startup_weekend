module Management
  # How study turns into points, set by the admin: one hour of in-person training costs the hour of the manager
  # who teaches plus the hour of the person taught; a share of that saving becomes points (1 point = R$ 1 in rewards).
  class PointsRule
    DEFAULTS = {manager_hourly: 60, person_hourly: 25, reward_share: 0.4}.freeze

    def initialize(**overrides)
      @rule = DEFAULTS.merge(overrides)
    end

    def props = @rule

    def hour_cost = @rule[:manager_hourly] + @rule[:person_hourly]

    def points_per_hour = (hour_cost * @rule[:reward_share]).round

    def points_for(hours) = (hours * points_per_hour).round

    def saved_for(hours) = (hours * hour_cost).round
  end
end
