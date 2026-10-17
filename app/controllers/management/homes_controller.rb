module Management
  class HomesController < BaseController
    def show
      render inertia: {home: HomeMock.new.props}
    end
  end
end
