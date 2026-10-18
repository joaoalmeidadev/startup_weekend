module Collaborator
  # The rewards as the collaborator sees them: only points (never the R$ cost), her balance and what she redeemed
  class RewardsMock
    def props
      rewards = Management::RewardCatalog.rewards.map { |reward| reward.slice(:id, :name, :icon, :category, :points, :stock) }
      {balance: learner_rewards[:balance], rewards: rewards, redeemed: learner_rewards[:redeemed]}
    end

    private

    def learner_rewards = @learner_rewards ||= Management::PersonMock.new(Learner::NAME.parameterize).props[:rewards]
  end
end
