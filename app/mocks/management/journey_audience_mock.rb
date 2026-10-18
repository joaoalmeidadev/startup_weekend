module Management
  # Who can receive a journey: every sector and group, or people picked by name
  class JourneyAudienceMock
    def props
      {audience_options: SectorCatalog.audience_options, people: PeopleMock::PEOPLE.pluck(:name)}
    end
  end
end
