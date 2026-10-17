module Management
  # Example "Criar módulo com IA": the upload is illustrative and always yields the reviewed sample module
  class NewModuleMock
    SAMPLE_MODULE = "rotinas-de-atendimento"

    def initialize(journey_id)
      @journey = JourneyCatalog.find(journey_id) if journey_id.present?
    end

    def props
      {
        journey: @journey&.slice(:id, :name),
        generated: {lessons: 8, review_path: Rails.application.routes.url_helpers.management_learning_module_path(SAMPLE_MODULE)}
      }
    end
  end
end
