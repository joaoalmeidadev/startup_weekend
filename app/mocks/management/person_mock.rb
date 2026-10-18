module Management
  # Example detail of one person: where they are in the journey and what colleagues say
  class PersonMock
    FEEDBACK = {
      "leveled" => ["Resolve as reclamações sem precisar de ajuda.", "Ajuda os novatos do setor.", "Comunica-se com clareza com os clientes."],
      "on_track" => ["Explica as coisas com clareza.", "Pede ajuda quando tem dúvida.", "Ainda confunde os prazos de devolução."],
      "late" => ["É pontual e cuidadoso.", "Tem dificuldade com contas de porcentagem.", "Precisa de apoio para usar o sistema."]
    }.freeze

    def initialize(id)
      @person = PeopleMock::PEOPLE.find { |person| person[:name].parameterize == id }
      raise ActiveRecord::RecordNotFound, "Person #{id} not found" unless @person
    end

    def props
      PersonOverview.new(@person).props.merge(
        role: @person[:role],
        tenure: @person[:tenure],
        journey: journey,
        knows: competencies.first(@person[:completed]).last(3),
        learning: competencies.drop(@person[:completed]).first(3),
        feedback: FEEDBACK.fetch(@person[:status])
      )
    end

    private

    def journey_data = @journey_data ||= JourneyCatalog.find(@person[:journey_id])

    def module_ids = JourneyCatalog::STRETCHES.keys.flat_map { |key| journey_data[:modules][key] }

    def competencies = module_ids.map { |id| ModuleCatalog.find(id)[:competency] }

    def journey
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
