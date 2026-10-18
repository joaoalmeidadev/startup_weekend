module Collaborator
  class HomesController < BaseController
    def show
      render inertia: {learner: Learner.new.props}
    end
  end
end
