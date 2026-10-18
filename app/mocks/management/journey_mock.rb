module Management
  # Example data for the journey builder: the journey path, the whole catalog by origin and the goal to cover
  class JourneyMock
    SOURCE_TITLES = {"ai" => "Gerado por IA", "nivela" => "Produtos Nivela", "company" => "Produtos da empresa"}.freeze

    def initialize(id)
      @journey = JourneyCatalog.find(id)
    end

    def props
      {journey: journey_props, catalog: catalog, goal: goal}
    end

    private

    def journey_props
      @journey.slice(:id, :name, :status, :audience, :people_in_progress, :badge).merge(stretches: stretches)
    end

    def stretches
      JourneyCatalog::STRETCHES.map do |key, title|
        {key: key.to_s, title: title, modules: @journey[:modules][key].map { |id| ModuleCatalog.summary(id) }}
      end
    end

    def catalog
      ModuleCatalog::SOURCES.map do |source|
        {source: source, title: SOURCE_TITLES.fetch(source), modules: ModuleCatalog.by_source(source)}
      end
    end

    def goal
      {sector: @journey[:sector], competencies: sector_goal_competencies + @journey[:extra_goal]}
    end

    def sector_goal_competencies
      return [] unless @journey[:sector]

      SectorGoalMock.new(@journey[:sector]).props[:competencies].pluck(:name)
    end
  end
end
