module Collaborator
  class LearningModulesController < BaseController
    def show
      render inertia: {learning_module: LearningModuleMock.new(params[:id]).props}
    end
  end
end
