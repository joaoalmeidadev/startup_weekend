module Management
  # Example data for the journey builder: the journey with its ordered modules, the whole Biblioteca by origin,
  # who can receive it and the goal of the first sector or group that receives it
  class JourneyMock
    SOURCE_TITLES = {"ai" => "Gerado por IA", "nivela" => "Produtos Nivela", "company" => "Produtos da empresa"}.freeze

    # Nivela products come first: they work even when the company has no material yet
    CATALOG_ORDER = %w[nivela ai company].freeze

    def initialize(id, start_ready: false)
      @journey = JourneyCatalog.find(id)
      @start_ready = start_ready
    end

    def props
      {journey: journey_props, catalog: catalog, goal: goal, ready_journey: ready_journey,
       start_ready: @start_ready && ready_journey.present?}.merge(JourneyAudienceMock.new.props)
    end

    private

    def journey_props
      @journey.slice(:id, :name, :kind, :status, :audience, :people_in_progress, :badge)
        .merge(modules: summaries(@journey[:modules]))
    end

    def summaries(ids) = ids.map { |id| ModuleCatalog.summary(id) }

    # Only a base journey can start from the ready-made Base Nivela
    def ready_journey
      summaries(JourneyCatalog::READY_BASE) if @journey[:kind] == "base"
    end

    def catalog
      CATALOG_ORDER.map do |source|
        {source: source, title: SOURCE_TITLES.fetch(source), modules: ModuleCatalog.by_source(source)}
      end
    end

    def goal
      sector = goal_sector
      {sector: sector&.dig(:name), slug: sector && sector[:name].parameterize,
       competencies: sector ? sector[:competencies].map(&:first) : []}
    end

    # People picked one by one have no sector goal
    def goal_sector
      audience = @journey[:audience]
      SectorCatalog.find(audience[:names].first) if audience[:type] == "sectors"
    end
  end
end
