module Management
  # The salaries a work sector prices its training hour with: its own ones, or the company's (PointsRule).
  # Groups have none, since their people already belong to a work sector.
  class SectorTrainingCost
    def initialize(sector)
      @sector = sector
    end

    def props
      return if @sector[:kind] == "group"

      name = @sector[:name]
      PointsRule.for_sector(name).props.slice(:teacher_salary, :learner_salary).merge(own: PointsRule.own_cost?(name))
    end
  end
end
