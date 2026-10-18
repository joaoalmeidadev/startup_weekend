module Collaborator
  class JourneysController < BaseController
    def index
      render inertia: {learner: Learner.new.props}
    end
  end
end
