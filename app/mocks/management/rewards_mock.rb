module Management
  # Example "Recompensas": the admin's points rule, the catalog, ideas to register and the recent redemptions
  class RewardsMock
    CURRENT_MONTH = "10"
    RECENT = 6

    def props
      {points_rule: rule.props, rewards: rewards, ideas: RewardCatalog.ideas.map { |idea| idea.merge(redeemed: 0) },
       redemptions: redemptions.first(RECENT).map { |redemption| redemption.except(:hours_done) }, month: month}
    end

    private

    def rule = @rule ||= PointsRule.new

    # Each redemption takes one unit out of the stock (nil stock = unlimited)
    def rewards
      counts = redemptions.pluck(:reward).tally
      RewardCatalog.rewards.map do |reward|
        redeemed = counts.fetch(reward[:name], 0)
        reward.merge(redeemed: redeemed, stock: reward[:stock] && [reward[:stock] - redeemed, 0].max)
      end
    end

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
