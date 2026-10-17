module Users
  # Where each user lands: collaborators follow their journey, everyone else manages.
  class HomePathResolver
    include Rails.application.routes.url_helpers

    def initialize(user)
      @user = user
    end

    def path
      @user.collaborator? ? collaborator_journey_path : management_root_path
    end
  end
end
