module Management
  class SetupsController < BaseController
    def show
      render inertia: SetupMock.new.props
    end
  end
end
