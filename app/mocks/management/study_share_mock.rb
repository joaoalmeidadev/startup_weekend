module Management
  # Who studies the most today: the in-person training hours replaced by completed contents (PersonStudy#hours_done),
  # split per work sector and per person. A snapshot of today, like the competencies, so it ignores the period.
  class StudyShareMock
    TOP_PEOPLE = 4
    OTHERS = "Outros"

    def props
      {by_sector: by_sector, by_person: by_person}
    end

    private

    def by_sector
      hours = studies.group_by { |person, _| person[:sector] }.transform_values { |rows| rows.sum(&:last) }
      slices(work_sectors.map { |name| {label: name, hours: hours.fetch(name, 0)} })
    end

    def by_person
      ranked = slices(studies.map { |person, hours| {label: first_name(person), hours: hours} })
      top, rest = ranked.first(TOP_PEOPLE), ranked.drop(TOP_PEOPLE)
      rest.empty? ? top : top + [{label: OTHERS, hours: rest.sum { |slice| slice[:hours] }}]
    end

    # Most first; ties keep their original order
    def slices(rows) = rows.each_with_index.sort_by { |row, index| [-row[:hours], index] }.map(&:first)

    def studies
      @studies ||= PeopleMock::PEOPLE.map { |person| [person, hours_done(person)] }
    end

    def hours_done(person) = PersonMock.new(person[:name].parameterize).props.dig(:study, :hours_done)

    def first_name(person) = person[:name].split.first

    def work_sectors = SectorCatalog.all.select { |sector| sector[:kind] == "sector" }.pluck(:name)
  end
end
