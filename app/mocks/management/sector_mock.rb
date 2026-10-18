module Management
  # Example detail of one work sector or group (data in SectorCatalog): its people and its goal.
  # The HR picks a market level and fine-tunes each competency, using the veterans average only as a reference.
  class SectorMock
    def initialize(slug)
      @sector = SectorCatalog.find_by_slug(slug)
      raise ActiveRecord::RecordNotFound, "Sector #{slug} not found" unless @sector
    end

    def props
      {sector: sector, invite_sectors: PeopleMock.new.sectors}
    end

    private

    def name = @sector[:name]

    def members = @members ||= SectorCatalog.members(name)

    def sector
      {name: name, slug: name.parameterize, kind: @sector[:kind], people: people,
       levels: SectorCatalog::LEVELS, level: @sector[:level], experts_count: experts_count,
       competencies: @sector[:competencies].map { |row| competency(*row) }}
    end

    def people
      members.map { |person| PersonOverview.new(person).props.merge(role: person[:role]) }
    end

    # Veterans are the people already Nivelado, when the sector has their reference averages
    def experts_count
      return 0 unless @sector[:competencies].any? { |row| row[2] }

      members.count { |person| person[:status] == "leveled" }
    end

    def competency(name, icon, experts_average = nil, reached = nil)
      {name: name, icon: icon, experts_average: experts_average, goal: SectorCatalog.target(self.name),
       reached: reached && reached_among_members(*reached)}
    end

    # The catalog keeps a reference sample (e.g. 12 of 14); scale it to the people really in the sector
    def reached_among_members(count, sample)
      of = members.size
      {count: (count * of.to_f / sample).round.clamp(0, of), of: of}
    end
  end
end
