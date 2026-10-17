module Management
  class LessonReviewsController < BaseController
    def index
      redirect_to management_lesson_review_path(LessonReviewMock::FIRST_PENDING)
    end

    def show
      render inertia: {lesson_review: LessonReviewMock.new(params[:id].to_i).props}
    end
  end
end
