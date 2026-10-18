require "csv"

module Management
  # Example people of the Distribuidora Sul, one row each, late ones first
  class PeopleMock
    CSV_HEADERS = %w[Nome Setor Status Progresso Nota Meta Previsão].freeze

    def props
      {summary: summary, sectors: sectors, people: overviews.map(&:props)}
    end

    def to_csv
      CSV.generate do |csv|
        csv << CSV_HEADERS
        overviews.each { |overview| csv << csv_row(overview) }
      end
    end

    private

    def overviews = PEOPLE.map { |person| PersonOverview.new(person) }

    def summary = PEOPLE.pluck(:status).tally.transform_keys(&:to_sym)

    def sectors
      counts = PEOPLE.pluck(:sector).tally
      SectorGoalMock::SECTORS.map { |name| {name: name, count: counts.fetch(name, 0), journeys: journeys_for(name)} }
    end

    # The journeys a new person of the sector receives when invited
    def journeys_for(sector) = JourneyCatalog.for_sector(sector).pluck(:name)

    def csv_row(overview)
      person = overview.props
      [person[:name], person[:sector], overview.status_label, "#{person[:progress][:percent]}%",
        person[:score], person[:goal] || "sem meta", person[:forecast]]
    end

    # Shared with PersonMock. completed = modules done along the path (JourneyCatalog.path_for); days = to level (or late by).
    # The first five have photos in public/mocks/people.
    PEOPLE = [
      {name: "Marcos Oliveira", sector: "Logística", status: "late", role: "Conferente", tenure: "2 meses de casa",
       completed: 0, score: 41, last_active: "há 32 dias", weekly_minutes: 0,
       days: 21, photo: true},
      {name: "Paula Santos", sector: "Comercial", status: "late", role: "Vendedora interna", tenure: "4 meses de casa",
       completed: 1, score: 54, last_active: "há 20 dias", weekly_minutes: 0,
       days: 15, photo: true},
      {name: "Bruna Costa", sector: "Atendimento", status: "late", role: "Atendente", tenure: "2 meses de casa",
       completed: 2, score: 58, last_active: "há 9 dias", weekly_minutes: 10,
       days: 8},
      {name: "Maria Souza", sector: "Atendimento", status: "on_track", role: "Atendente", tenure: "1 mês de casa",
       completed: 3, score: 68, last_active: "há 2 dias", weekly_minutes: 35,
       days: 12, photo: true},
      {name: "Rafael Lima", sector: "Atendimento", status: "on_track", role: "Atendente", tenure: "1 mês de casa",
       completed: 4, score: 72, last_active: "hoje", weekly_minutes: 50,
       days: 6},
      {name: "João Batista", sector: "Comercial", status: "on_track", role: "Vendedor interno", tenure: "3 meses de casa",
       completed: 2, score: 70, last_active: "hoje", weekly_minutes: 45,
       days: 18, photo: true},
      {name: "Fernanda Rocha", sector: "Logística", status: "on_track", role: "Auxiliar de expedição",
       tenure: "3 semanas de casa", completed: 2, score: 63,
       last_active: "há 3 dias", weekly_minutes: 25, days: 20},
      {name: "Carla Silveira", sector: "Atendimento", status: "leveled", role: "Atendente", tenure: "8 meses de casa",
       completed: 6, score: 86, last_active: "ontem", weekly_minutes: 20,
       photo: true},
      {name: "Diego Fernandes", sector: "Atendimento", status: "leveled", role: "Atendente", tenure: "1 ano de casa",
       completed: 6, score: 81, last_active: "há 3 dias", weekly_minutes: 15},
      {name: "Lucas Pereira", sector: "Comercial", status: "leveled", role: "Vendedor interno", tenure: "6 meses de casa",
       completed: 4, score: 79, last_active: "ontem", weekly_minutes: 25}
    ].freeze
  end
end
