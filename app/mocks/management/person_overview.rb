module Management
  # One person's leveling snapshot (progress, score against the sector goal, activity and forecast),
  # shared by the people list, its CSV export and the detail page
  class PersonOverview
    STATUS_LABELS = {"leveled" => "Nivelado", "on_track" => "No ritmo", "late" => "Atrasado"}.freeze

    def initialize(person)
      @person = person
    end

    def props
      @person.slice(:name, :sector, :status, :score).merge(
        id: id, avatar_url: avatar_url, goal: goal, progress: progress, activity: activity, forecast: forecast
      )
    end

    def id = @person[:name].parameterize

    def status_label = STATUS_LABELS.fetch(@person[:status])

    def goal = SectorGoalMock.new(@person[:sector]).target

    def progress
      {percent: @person[:completed] * 100 / module_ids.size, current_module: current_module}
    end

    def forecast
      case @person[:status]
      when "leveled" then "Nivelado ✓"
      when "late" then "Atrasado #{@person[:days]} dias"
      else "Nivela em ~#{@person[:days]} dias"
      end
    end

    private

    def avatar_url = @person[:photo] ? "/mocks/people/#{id}.jpg" : nil

    def activity
      minutes = @person[:weekly_minutes]
      week = minutes.positive? ? "#{minutes} min nesta semana" : "sem estudo nesta semana"
      "#{@person[:last_active]} · #{week}"
    end

    def current_module
      module_id = module_ids[@person[:completed]]
      module_id && ModuleCatalog.find(module_id)[:name]
    end

    def module_ids
      modules = JourneyCatalog.find(@person[:journey_id])[:modules]
      JourneyCatalog::STRETCHES.keys.flat_map { |key| modules[key] }
    end
  end
end
