module Management
  class BaseController < InertiaController
    before_action :authenticate_user!
    before_action :require_management

    inertia_share manager: -> { ManagerMock.new(current_user).props }

    private

    def require_management
      redirect_to_home if current_user.collaborator?
    end
  end
end
