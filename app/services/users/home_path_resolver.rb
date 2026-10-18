module Users
  # Where each user lands: collaborators follow their journey, everyone else manages.
  class HomePathResolver
    include Rails.application.routes.url_helpers

    def initialize(user)
      @user = user
    end

    def path
      return collaborator_journey_path if @user.collaborator?

      management_root_path
    end
  end
end
