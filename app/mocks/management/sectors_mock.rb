module Management
  # Example list of the work sectors and groups (data in SectorCatalog), each with a few faces, its goal and
  # its training cost, next to the company one
  class SectorsMock
    PREVIEW_SIZE = 4

    def props
      {company_rule: PointsRule.new.props, sectors: SectorCatalog.all.map { |sector| summary(sector) }}
    end

    private

    def summary(sector)
      name = sector[:name]
      members = SectorCatalog.members(name)
      {name: name, slug: name.parameterize, kind: sector[:kind], people_count: members.size,
       level: SectorCatalog.level(name)&.slice(:label, :target), people: members.first(PREVIEW_SIZE).map { |person| preview(person) },
       training_cost: SectorTrainingCost.new(sector).props}
    end

    def preview(person) = PersonOverview.new(person).props.slice(:id, :name, :avatar_url)
  end
end
