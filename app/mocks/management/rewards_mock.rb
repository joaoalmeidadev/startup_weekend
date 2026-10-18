module Management
  # Example "Recompensas": the admin's points rule, the catalog, ideas to register and the recent redemptions
  class RewardsMock
    CURRENT_MONTH = "10"
    RECENT = 6

    def props
      {points_rule: rule.props, rewards: RewardCatalog.rewards, ideas: RewardCatalog.ideas,
       redemptions: redemptions.first(RECENT).map { |redemption| redemption.except(:hours_done) }, month: month}
    end

    private

    def rule = @rule ||= PointsRule.new

    def redemptions
      @redemptions ||= PeopleMock::PEOPLE.flat_map { |person| redemptions_of(person) }
        .sort_by { |redemption| redemption[:date].split("/").reverse }.reverse
    end

    def redemptions_of(person)
      overview = PersonOverview.new(person).props
      detail = PersonMock.new(overview[:id]).props
      rewards, study = detail.values_at(:rewards, :study)
      rewards[:redeemed].map do |reward|
        {person: overview.slice(:id, :name, :avatar_url), reward: reward[:name], date: reward[:date],
         points: reward[:points], hours_done: study[:hours_done]}
      end
    end

    # Spent on rewards this month (1 point = R$ 1) against the training already saved by whoever redeemed
    def month
      this_month = redemptions.select { |redemption| redemption[:date].end_with?("/#{CURRENT_MONTH}") }
      spent = this_month.sum { |redemption| RewardCatalog.find(redemption[:reward])[:cost] }
      saved = this_month.uniq { |redemption| redemption[:person][:id] }.sum { |redemption| rule.saved_for(redemption[:hours_done]) }
      {spent: spent, saved: saved}
    end
  end
end
