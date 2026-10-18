module Management
  class ApprovalsController < BaseController
    def index
      render inertia: ApprovalsMock.new.props
    end

    def show
      render inertia: ApprovalsMock.new.detail(params[:id])
    end
  end
end
