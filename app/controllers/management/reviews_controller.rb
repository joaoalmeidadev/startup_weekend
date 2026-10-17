module Management
  class ReviewsController < BaseController
    def show
      person = PersonMock.new(params[:person_id]).props
      render inertia: {review: Collaborator::PeerReviewMock.new.props.slice(:statements, :scale).merge(person: person.slice(:id, :name))}
    end
  end
end
