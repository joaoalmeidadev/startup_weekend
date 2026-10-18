module Management
  # Example sector goal (data in SectorCatalog): the HR picks a market level and fine-tunes each competency,
  # using the veterans average only as a reference.
  class SectorGoalMock
    SECTORS = SectorCatalog::SECTORS.select { |sector| sector[:kind] == "sector" }.pluck(:name).freeze
    LEVELS = SectorCatalog::LEVELS

    def initialize(sector = nil)
      @sector = SECTORS.include?(sector) ? sector : SECTORS.first
    end

    def props
      {
        sector: @sector,
        sectors: SECTORS,
        levels: LEVELS,
        level: level_key,
        experts_count: level_key ? 5 : 0,
        competencies: SectorCatalog.find(@sector)[:competencies].map { |row| competency(*row) }
      }
    end

    # Overall score a person needs to be Nivelado in this sector; nil while there is no goal
    def target = SectorCatalog.target(@sector)

    private

    def level_key = SectorCatalog.find(@sector)[:level]

    def competency(name, icon, experts_average = nil, reached = nil)
      count, of = reached
      {name: name, icon: icon, experts_average: experts_average, goal: target,
       reached: reached && {count: count, of: of}}
    end
  end
end
