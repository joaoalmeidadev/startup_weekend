module Management
  class JourneysController < BaseController
    def index
      render inertia: JourneysMock.new.props
    end

    def show
      render inertia: JourneyMock.new(params[:id]).props
    end
  end
end
