module Management
  # Example last step of "Novo conteúdo": who receives the reviewed module and where it lands in the journey
  class PublicationMock
    def initialize(module_id)
      @module = ModuleCatalog.find(module_id)
    end

    def props
      {
        module_name: @module[:name],
        lessons: @module[:lessons],
        sector: "Atendimento",
        audience_count: 32,
        default_audiences: %w[sector newcomers],
        journey_outline: journey_outline,
        done_path: Rails.application.routes.url_helpers.management_journeys_path
      }
    end

    private

    def journey_outline
      [
        {title: "1. Base (Soft skills)", status: "done"},
        {title: "2. Trecho Empresa: #{@module[:name]}", status: "new"},
        {title: "3. Setor: Atendimento ao Cliente", status: "upcoming"}
      ]
    end
  end
end
