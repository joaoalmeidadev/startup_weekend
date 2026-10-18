module Management
  # Example "Recompensas": the rule, the catalog, ideas to register and the recent redemptions
  class RewardsMock
    CURRENT_MONTH = "10"
    RECENT = 6

    def props
      {rule: RewardCatalog.rule, rewards: RewardCatalog.rewards, ideas: RewardCatalog.ideas,
       redemptions: redemptions.first(RECENT).map { |redemption| redemption.except(:earned) }, month: month}
    end

    private

    def redemptions
      @redemptions ||= PeopleMock::PEOPLE.flat_map { |person| redemptions_of(person) }
        .sort_by { |redemption| redemption[:date].split("/").reverse }.reverse
    end

    def redemptions_of(person)
      overview = PersonOverview.new(person).props
      rewards = PersonMock.new(overview[:id]).props[:rewards]
      rewards[:redeemed].map do |reward|
        {person: overview.slice(:id, :name, :avatar_url), reward: reward[:name], date: reward[:date],
         points: reward[:points], earned: rewards[:points]}
      end
    end

    # Spent on rewards this month against the training already saved by whoever redeemed
    def month
      this_month = redemptions.select { |redemption| redemption[:date].end_with?("/#{CURRENT_MONTH}") }
      spent = this_month.sum { |redemption| RewardCatalog.find(redemption[:reward])[:cost] }
      saved = this_month.uniq { |redemption| redemption[:person][:id] }.sum { |redemption| RewardCatalog.saved_for(redemption[:earned]) }
      {spent: spent, saved: saved.round}
    end
  end
end
