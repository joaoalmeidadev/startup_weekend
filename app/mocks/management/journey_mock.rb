module Management
  # Example data for the journey builder: the journey path, the whole catalog by origin and the goal to cover
  class JourneyMock
    SOURCE_TITLES = {"ai" => "Gerado por IA", "nivela" => "Produtos Nivela", "company" => "Produtos da empresa"}.freeze

    # Nivela products come first: they work even when the company has no material yet
    CATALOG_ORDER = %w[nivela ai company].freeze

    def initialize(id, start_ready: false)
      @journey = JourneyCatalog.find(id)
      @start_ready = start_ready
    end

    def props
      {journey: journey_props, catalog: catalog, goal: goal, ready_journey: stretches(JourneyCatalog::READY_MODULES),
       start_ready: @start_ready}
    end

    private

    def journey_props
      @journey.slice(:id, :name, :status, :audience, :people_in_progress, :badge).merge(stretches: stretches(@journey[:modules]))
    end

    def stretches(modules)
      JourneyCatalog::STRETCHES.map do |key, title|
        {key: key.to_s, title: title, modules: modules[key].map { |id| ModuleCatalog.summary(id) }}
      end
    end

    def catalog
      CATALOG_ORDER.map do |source|
        {source: source, title: SOURCE_TITLES.fetch(source), modules: ModuleCatalog.by_source(source)}
      end
    end

    def goal
      {sector: @journey[:sector], competencies: sector_goal_competencies + @journey[:extra_goal]}
    end

    def sector_goal_competencies
      return [] unless @journey[:sector]

      SectorCatalog.find(@journey[:sector])[:competencies].map(&:first)
    end
  end
end
