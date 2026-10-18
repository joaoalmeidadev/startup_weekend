require "rails_helper"

RSpec.describe Management::PersonOverview do
  let(:people) { Management::PeopleMock::PEOPLE.map { |person| described_class.new(person).props } }

  it "keeps the leveled at the end of their path and the others before it" do
    leveled, others = people.partition { |person| person[:status] == "leveled" }

    expect(leveled.map { |person| person[:progress][:percent] }).to all(eq(100))
    expect(others.map { |person| person[:progress][:percent] }).to all(be < 100)
  end

  it "shows each person's progress, score against the sector goal, activity and forecast" do
    maria = people.find { |person| person[:id] == "maria-souza" }

    expect(maria).to include(sector: "Atendimento", status: "on_track", goal: 75,
      activity: "há 2 dias · 35 min nesta semana", forecast: "Nivela em ~12 dias")
    expect(maria[:score]).to be < 75
    expect(maria[:progress]).to include(percent: 50, current_module: "Rotinas de atendimento")
  end

  it "keeps the leveled above the goal and the others below it" do
    leveled, others = people.select { |person| person[:goal] }.partition { |person| person[:status] == "leveled" }

    expect(leveled).to all(satisfy { |person| person[:score] >= person[:goal] })
    expect(others).to all(satisfy { |person| person[:score] < person[:goal] })
    expect(leveled.pluck(:forecast)).to all(eq("Nivelado ✓"))
  end

  it "uses the photos that exist and initials for the others" do
    avatars = people.pluck(:avatar_url).compact

    expect(avatars.size).to eq(5)
    expect(avatars).to all(satisfy { |url| Rails.public_path.join(url.delete_prefix("/")).exist? })
  end

  it "has no progress yet for someone no journey reaches" do
    newcomer = {name: "Ana Nova", sector: "Financeiro", status: "on_track", completed: 0, score: 40,
                last_active: "hoje", weekly_minutes: 0, days: 30}

    expect(described_class.new(newcomer).progress).to eq(percent: 0, current_module: nil)
  end
end
