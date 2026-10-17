module Collaborator
  class ProfilesController < BaseController
    def show
      render inertia: {profile: ProfileMock.new.props}
    end
  end
end
