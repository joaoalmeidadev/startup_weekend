module Collaborator
  class JourneysController < BaseController
    def show
      return redirect_to collaborator_welcome_path if OnboardingMock.new.pending?(current_user, session)

      render inertia: {journey: JourneyMock.new(preview: params[:preview]).props}
    end
  end
end
