module Management
  class RoleChangesController < BaseController
    def show
      render inertia: {role_change: RoleChangeMock.new(params[:person_id]).props}
    end
  end
end
