module Management
  class RewardsController < BaseController
    def show
      render inertia: RewardsMock.new.props
    end
  end
end
