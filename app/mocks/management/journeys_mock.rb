module Management
  # Example data for "Jornadas": each journey with its kind, who receives it and how many modules it has
  class JourneysMock
    def props
      {journeys: JourneyCatalog.all.map { |journey| summary(journey) }, audience_options: SectorCatalog.audience_options}
    end

    private

    def summary(journey)
      journey.slice(:id, :name, :kind, :status, :audience, :people_in_progress, :badge)
        .merge(modules_count: journey[:modules].size)
    end
  end
end
