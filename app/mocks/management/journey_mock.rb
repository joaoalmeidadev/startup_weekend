module Management
  # Example data for one journey and the Nivela library offered when adding modules
  class JourneyMock
    def initialize(id)
      @journey = JourneyCatalog.find(id)
    end

    def props
      {journey: journey_props, library: library}
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

    def library
      ModuleCatalog.base_library.reject { |mod| @journey[:modules][:base].include?(mod[:id]) }
    end
  end
end
