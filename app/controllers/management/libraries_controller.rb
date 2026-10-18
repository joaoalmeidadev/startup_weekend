module Management
  class LibrariesController < BaseController
    def show
      render inertia: {library: LibraryMock.new.props}
    end
  end
end
