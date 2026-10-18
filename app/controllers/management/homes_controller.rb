module Management
  class HomesController < BaseController
    def show
      render inertia: {dashboard: TeamDashboardMock.new(params[:period]).props}
    end
  end
end
