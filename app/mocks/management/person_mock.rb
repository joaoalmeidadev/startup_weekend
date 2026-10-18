module Management
  # Example detail of one person: their journey, how they study, their badge and the rewards they redeemed
  class PersonMock
    def initialize(id)
      @person = PeopleMock::PEOPLE.find { |person| person[:name].parameterize == id }
      raise ActiveRecord::RecordNotFound, "Person #{id} not found" unless @person
    end

    def props
      PersonOverview.new(@person).props.merge(
        role: @person[:role], tenure: @person[:tenure], journey: journey,
        study: study.props, competencies: study.competencies,
        badge: rewards.badge, milestones: rewards.milestones, rewards: rewards.rewards
      )
    end

    private

    def journey_data = @journey_data ||= JourneyCatalog.find(@person[:journey_id])

    def module_ids = JourneyCatalog::STRETCHES.keys.flat_map { |key| journey_data[:modules][key] }

    def study = @study ||= PersonStudy.new(@person, module_ids)

    def rewards = @rewards ||= PersonRewards.new(@person, journey, study)

    def journey
      @journey ||= build_journey
    end

    def build_journey
      position = 0
      stretches = JourneyCatalog::STRETCHES.map do |key, title|
        modules = journey_data[:modules][key].map do |id|
          position += 1
          {name: ModuleCatalog.find(id)[:name], status: module_status(position)}
        end
        {title: title, modules: modules}
      end
      {id: journey_data[:id], name: journey_data[:name], stretches: stretches}
    end

    def module_status(position)
      return "done" if position <= @person[:completed]

      (position == @person[:completed] + 1) ? "current" : "locked"
    end
  end
end
