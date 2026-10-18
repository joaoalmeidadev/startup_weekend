module Management
  # Example data for "Conteúdos": the journeys and the content library with the origin of each module
  class JourneysMock
    def props
      {journeys: JourneyCatalog.all.map { |journey| summary(journey) }, library: library}
    end

    private

    def summary(journey)
      journey.slice(:id, :name, :status, :audience, :people_in_progress, :badge)
        .merge(modules_per_stretch: journey[:modules].transform_values(&:size))
    end

    def library
      ModuleCatalog.all.map { |mod| mod.merge(journeys_count: JourneyCatalog.using_module(mod[:id]).size) }
    end
  end
end
