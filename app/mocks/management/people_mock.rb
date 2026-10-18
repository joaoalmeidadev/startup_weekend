require "csv"

module Management
  # Example people from the Stitch "Pessoas" screen
  class PeopleMock
    STATUS_LABELS = {"attention" => "Precisa de atenção", "learning" => "Aprendendo", "leveled" => "Nivelado"}.freeze

    TEAM_SECTOR = "Atendimento"

    # team: true is the manager's view, limited to their own sector
    def initialize(team: false)
      @team = team
    end

    def props
      {summary: summary, sectors: sectors, people: people, total: @team ? 14 : 42, team: @team}
    end

    def to_csv
      CSV.generate do |csv|
        csv << %w[Nome Setor Status]
        PEOPLE.each { |person| csv << [person[:name], person[:sector], STATUS_LABELS.fetch(person[:status])] }
      end
    end

    private

    def summary
      {
        leveled: {count: 21, percent: 50},
        learning: {count: 14, percent: 33},
        attention: {count: 7, percent: 17}
      }
    end

    def sectors
      [{name: "Atendimento", count: 14}, {name: "Comercial", count: 16}, {name: "Logística", count: 12}]
    end

    def people
      visible = @team ? PEOPLE.select { |person| person[:sector] == TEAM_SECTOR } : PEOPLE
      visible.map { |person| person.slice(:name, :sector, :status, :alert, :progress, :achievement).compact.merge(card_extras(person)) }
    end

    def card_extras(person)
      {id: person[:name].parameterize, avatar_url: "/mocks/people/#{person[:name].parameterize}.jpg"}
    end

    # Shared with PersonMock: journey and progress drive the detail page
    PEOPLE = [
      {name: "Marcos Oliveira", sector: "Logística", status: "attention", role: "Conferente", tenure: "2 meses de casa",
       journey_id: "onboarding-logistica", completed: 0, alert: {icon: "error", text: "Parado em Matemática Básica há 32 dias"}},
      {name: "Maria Souza", sector: "Atendimento", status: "learning", role: "Atendente", tenure: "1 mês de casa",
       journey_id: "onboarding-atendimento", completed: 3, progress: {step: "Passo 4 de 6 da trilha", percent: 80, label: "80% na Base"}},
      {name: "Carla Silveira", sector: "Atendimento", status: "leveled", role: "Atendente", tenure: "8 meses de casa",
       journey_id: "onboarding-atendimento", completed: 6, achievement: "Selo Nivelado em Atendimento conquistado"},
      {name: "João Batista", sector: "Comercial", status: "learning", role: "Vendedor interno", tenure: "3 meses de casa",
       journey_id: "onboarding-logistica", completed: 2, progress: {step: "Passo 2 de 5 da trilha", percent: 40, label: "40% concluído"}},
      {name: "Paula Santos", sector: "Comercial", status: "attention", role: "Vendedora interna", tenure: "4 meses de casa",
       journey_id: "onboarding-atendimento", completed: 1, alert: {icon: "schedule", text: "Sem acesso há 20 dias"}}
    ].freeze
  end
end
