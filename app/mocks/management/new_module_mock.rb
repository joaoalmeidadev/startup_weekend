module Management
  # Example "Novo conteúdo": the upload is illustrative and always yields the reviewed sample module.
  # Nivela products are not registered here; they already come ready in the library.
  class NewModuleMock
    def initialize(journey_id)
      @journey = JourneyCatalog.find(journey_id) if journey_id.present?
    end

    def props
      {
        journey: @journey&.slice(:id, :name),
        generated: {lessons: 8, review_path: Rails.application.routes.url_helpers.management_lesson_review_path(1)},
        competency_groups: competency_groups
      }
    end

    private

    # The goal competencies of each sector and group first, so the content counts towards a goal,
    # then the other competencies already used in the library
    def competency_groups
      goals = SectorCatalog.all.map do |sector|
        label = (sector[:kind] == "group") ? "#{sector[:name]} (grupo)" : sector[:name]
        {label: label, competencies: sector[:competencies].map(&:first)}
      end
      in_goals = goals.flat_map { |group| group[:competencies] }
      others = ModuleCatalog.competencies - in_goals
      goals + [{label: "Outras da Biblioteca", competencies: others}]
    end
  end
end
