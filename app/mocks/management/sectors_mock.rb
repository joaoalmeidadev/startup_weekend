module Management
  # Example list of the work sectors and groups (data in SectorCatalog), each with a few faces and its goal
  class SectorsMock
    PREVIEW_SIZE = 4

    def props
      {sectors: SectorCatalog.all.map { |sector| summary(sector) }}
    end

    private

    def summary(sector)
      name = sector[:name]
      members = SectorCatalog.members(name)
      {name: name, slug: name.parameterize, kind: sector[:kind], people_count: members.size,
       level: SectorCatalog.level(name)&.slice(:label, :target), people: members.first(PREVIEW_SIZE).map { |person| preview(person) }}
    end

    def preview(person) = PersonOverview.new(person).props.slice(:id, :name, :avatar_url)
  end
end
