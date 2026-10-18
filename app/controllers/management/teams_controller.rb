module Management
  class TeamsController < BaseController
    def show
      render inertia: {dashboard: TeamDashboardMock.new(params[:period]).props}
    end
  end
end
