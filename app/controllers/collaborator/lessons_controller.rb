module Collaborator
  class LessonsController < BaseController
    def show
      render inertia: {lesson: LessonMock.new(params[:id]).props}
    end
  end
end
