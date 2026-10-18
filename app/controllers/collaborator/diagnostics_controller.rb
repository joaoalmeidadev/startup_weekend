module Collaborator
  class DiagnosticsController < BaseController
    def show
      render inertia: {diagnostic: DiagnosticMock.new.props}
    end

    def result
      session[:onboarded] = true
      render inertia: {result: DiagnosticMock.new.result}
    end
  end
end
