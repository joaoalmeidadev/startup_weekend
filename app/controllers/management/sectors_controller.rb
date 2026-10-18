module Management
  class SectorsController < BaseController
    def index
      render inertia: SectorsMock.new.props
    end

    def show
      render inertia: SectorMock.new(params[:slug]).props
    end

    def new
      render inertia: NewSectorMock.new.props
    end
  end
end
