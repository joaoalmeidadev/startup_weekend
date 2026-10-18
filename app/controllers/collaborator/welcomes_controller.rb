module Collaborator
  class WelcomesController < BaseController
    skip_before_action :keep_newcomer_on_onboarding

    def show
      render inertia: {}
    end
  end
end
