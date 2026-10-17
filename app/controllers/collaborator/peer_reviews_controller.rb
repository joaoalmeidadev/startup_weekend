module Collaborator
  class PeerReviewsController < BaseController
    def show
      render inertia: {peer_review: PeerReviewMock.new.props}
    end
  end
end
