module Management
  class HomesController < BaseController
    def show
      render inertia: {dashboard: HomeMock.new(params[:period]).props}
    end
  end
end
