module Management
  # Example "Novo conteúdo": the upload is illustrative and always yields the reviewed sample module.
  # The ready-made Nivela products back the "Usar um produto Nivela" choice.
  class NewModuleMock
    def initialize(journey_id)
      @journey = JourneyCatalog.find(journey_id) if journey_id.present?
    end

    def props
      {
        journey: @journey&.slice(:id, :name),
        generated: {lessons: 8, review_path: Rails.application.routes.url_helpers.management_lesson_review_path(1)},
        nivela_products: ModuleCatalog.by_source("nivela")
      }
    end
  end
end
