module Collaborator
  class ProgressesController < BaseController
    def show
      render inertia: {progress: ProgressMock.new.props}
    end
  end
end
