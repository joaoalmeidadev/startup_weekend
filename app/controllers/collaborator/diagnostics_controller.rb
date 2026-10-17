module Collaborator
  class DiagnosticsController < BaseController
    def show
      render inertia: {diagnostic: DiagnosticMock.new.props}
    end

    def result
      render inertia: {result: DiagnosticMock.new.result}
    end
  end
end
