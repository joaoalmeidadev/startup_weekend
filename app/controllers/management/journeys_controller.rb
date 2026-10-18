module Management
  class JourneysController < BaseController
    def index
      render inertia: JourneysMock.new.props
    end

    def new
      render inertia: JourneyAudienceMock.new.props
    end

    def show
      render inertia: JourneyMock.new(params[:id], start_ready: params[:ready].present?).props
    end
  end
end
