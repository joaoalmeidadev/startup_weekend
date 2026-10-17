module Collaborator
  class JourneysController < BaseController
    def show
      render inertia: {journey: JourneyMock.new(preview: params[:preview]).props}
    end
  end
end
