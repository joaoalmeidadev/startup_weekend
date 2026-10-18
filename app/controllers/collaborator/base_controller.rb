module Collaborator
  class BaseController < InertiaController
    before_action :authenticate_user!
    before_action :require_collaborator
    before_action :keep_newcomer_on_onboarding

    inertia_share viewer: -> { ViewerMock.new.props }

    private

    def require_collaborator
      redirect_to_home unless current_user.collaborator?
    end

    # The demo newcomer goes through welcome → diagnostic first; those controllers skip this
    def keep_newcomer_on_onboarding
      redirect_to collaborator_welcome_path if OnboardingMock.new.pending?(current_user, session)
    end
  end
end
