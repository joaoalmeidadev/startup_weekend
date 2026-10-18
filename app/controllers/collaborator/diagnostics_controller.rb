module Collaborator
  class DiagnosticsController < BaseController
    skip_before_action :keep_newcomer_on_onboarding

    def show
      render inertia: {diagnostic: DiagnosticMock.new.props}
    end

    def result
      session[:onboarded] = true
      render inertia: {result: DiagnosticMock.new.result}
    end
  end
end
