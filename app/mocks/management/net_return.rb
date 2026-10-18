module Management
  # What Nivela gave back in a period: training and rework saved minus the rewards paid and the platform price
  class NetReturn
    REWORK_COST = 80 # R$ per avoided rework, pitch assumption
    PRICE_PER_PERSON = 15 # R$ per person per month
    CURRENT_MONTH = "10"

    def initialize(training_saved:, rework_count:, people:, months:)
      @training_saved = training_saved
      @rework_count = rework_count
      @people = people
      @months = months
    end

    def props
      {training_saved: @training_saved, rework_count: @rework_count, rework_avoided: rework_avoided,
       rewards_paid: rewards_paid, platform_cost: platform_cost, balance: gained - spent,
       return_per_real: gained.fdiv(spent).round(1),
       assumptions: {rework_cost: REWORK_COST, price_per_person: PRICE_PER_PERSON, people: @people, months: @months}}
    end

    private

    def rework_avoided = @rework_count * REWORK_COST

    def platform_cost = @people * PRICE_PER_PERSON * @months

    def gained = @training_saved + rework_avoided

    def spent = rewards_paid + platform_cost

    # The listed redemptions go from August to October: one month keeps only October's
    def rewards_paid
      @rewards_paid ||= redemptions.sum { |name, _date| RewardCatalog.find(name)[:cost] }
    end

    def redemptions
      all = PersonRewards::REDEEMED.values.flatten(1)
      return all if @months > 1

      all.select { |_name, date| date.split("/").last == CURRENT_MONTH }
    end
  end
end
