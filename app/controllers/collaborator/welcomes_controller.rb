module Collaborator
  class WelcomesController < BaseController
    def show
      render inertia: {}
    end
  end
end
