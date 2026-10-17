module Management
  class SectorGoalsController < BaseController
    def show
      render inertia: {sector_goal: SectorGoalMock.new(params[:sector]).props}
    end
  end
end
