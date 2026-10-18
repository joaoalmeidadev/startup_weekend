module Users
  # Where each user lands: collaborators start at their home, everyone else manages.
  class HomePathResolver
    include Rails.application.routes.url_helpers

    def initialize(user)
      @user = user
    end

    def path
      return collaborator_home_path if @user.collaborator?

      management_root_path
    end
  end
end
