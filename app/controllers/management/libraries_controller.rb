module Management
  class LibrariesController < BaseController
    def show
      render inertia: LibraryMock.new.props
    end
  end
end
