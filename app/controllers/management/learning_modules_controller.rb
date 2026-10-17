module Management
  class LearningModulesController < BaseController
    # mode=manual opens the hand-written editor; otherwise the AI upload flow
    def new
      component = (params[:mode] == "manual") ? "management/learning_modules/manual" : "management/learning_modules/new"
      render inertia: component, props: NewModuleMock.new(params[:journey]).props
    end

    def show
      render inertia: {learning_module: LearningModuleMock.new(params[:id]).props}
    end
  end
end
