module Collaborator
  class ContributionsController < BaseController
    def index
      render inertia: ContributionsMock.new.props
    end

    def new
      render inertia: ContributionsMock.new.form_props
    end
  end
end
