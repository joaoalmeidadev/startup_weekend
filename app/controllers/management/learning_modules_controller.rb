module Management
  class LearningModulesController < BaseController
    def new
      render inertia: NewModuleMock.new(params[:journey]).props
    end

    def show
      render inertia: {learning_module: LearningModuleMock.new(params[:id]).props}
    end
  end
end
