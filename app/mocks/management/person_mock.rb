module Management
  # Example detail of one person: their path (every journey they receive), how they study, their badge and the rewards they redeemed
  class PersonMock
    def initialize(id)
      @person = PeopleMock::PEOPLE.find { |person| person[:name].parameterize == id }
      raise ActiveRecord::RecordNotFound, "Person #{id} not found" unless @person
    end

    def props
      PersonOverview.new(@person).props.merge(
        role: @person[:role], tenure: @person[:tenure], path: path,
        study: study.props, competencies: study.competencies,
        badge: rewards.badge, milestones: rewards.milestones, rewards: rewards.rewards
      )
    end

    private

    def path_ids = @path_ids ||= JourneyCatalog.path_for(@person)

    def module_ids = path_ids.values.flatten

    def study = @study ||= PersonStudy.new(@person, module_ids)

    def rewards = @rewards ||= PersonRewards.new(@person, study)

    # Base, Empresa and Setor, each named after the journeys that fill it
    def path
      names = JourneyCatalog.names_for(@person)
      position = 0
      JourneyCatalog::STRETCHES.map do |kind, title|
        modules = path_ids[kind].map do |id|
          position += 1
          {name: ModuleCatalog.find(id)[:name], status: module_status(position)}
        end
        {title: title, journeys: names[kind], modules: modules}
      end
    end

    def module_status(position)
      return "done" if position <= @person[:completed]

      (position == @person[:completed] + 1) ? "current" : "locked"
    end
  end
end
