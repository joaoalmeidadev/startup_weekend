module Management
  # Example "Novo conteúdo": the upload is illustrative and always yields the reviewed sample module
  class NewModuleMock
    def initialize(journey_id)
      @journey = JourneyCatalog.find(journey_id) if journey_id.present?
    end

    def props
      {
        journey: @journey&.slice(:id, :name),
        generated: {lessons: 8, review_path: Rails.application.routes.url_helpers.management_lesson_review_path(1)}
      }
    end
  end
end
