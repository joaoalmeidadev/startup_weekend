module Management
  # Example form to create a work sector or a group: everyone to pick from, the levels and the Base competencies
  class NewSectorMock
    BASE_COMPETENCIES = [
      ["Comunicação Clara", "record_voice_over"],
      ["Raciocínio Lógico", "psychology"],
      ["Escrita no Trabalho", "edit_note"]
    ].freeze

    def props
      {people: people, levels: SectorCatalog::LEVELS, competencies: competencies}
    end

    private

    def people
      PeopleMock::PEOPLE.map { |person| PersonOverview.new(person).props.slice(:id, :name, :sector, :avatar_url) }
    end

    def competencies
      BASE_COMPETENCIES.map do |name, icon|
        {name: name, icon: icon, experts_average: nil, goal: nil, reached: nil}
      end
    end
  end
end
