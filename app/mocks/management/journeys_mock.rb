module Management
  # Example data for the "Jornadas" list
  class JourneysMock
    def props
      {journeys: JourneyCatalog.all.map { |journey| summary(journey) }}
    end

    private

    def summary(journey)
      journey.slice(:id, :name, :status, :audience, :people_in_progress, :badge)
        .merge(modules_per_stretch: journey[:modules].transform_values(&:size))
    end
  end
end
