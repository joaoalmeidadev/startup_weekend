module Users
  # Where each user lands: collaborators follow their journey, managers see their team, HR manages.
  class HomePathResolver
    include Rails.application.routes.url_helpers

    def initialize(user)
      @user = user
    end

    def path
      return collaborator_journey_path if @user.collaborator?
      return management_team_path if @user.manager?

      management_root_path
    end
  end
end
