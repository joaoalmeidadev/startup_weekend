module Management
  class CompaniesController < BaseController
    def index
      render inertia: CompaniesMock.new.props
    end
  end
end
