module Collaborator
  class BaseController < InertiaController
    before_action :authenticate_user!
    before_action :require_collaborator

    inertia_share viewer: -> { ViewerMock.new.props }

    private

    def require_collaborator
      redirect_to_home unless current_user.collaborator?
    end
  end
end
