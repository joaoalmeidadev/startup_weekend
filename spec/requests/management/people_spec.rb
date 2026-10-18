require "rails_helper"

RSpec.describe "Management people", :inertia do
  describe "GET /management/people" do
    %i[hr manager platform_admin].each do |role|
      it "renders the people list for #{role} users" do
        sign_in create(:user, role)

        get management_people_path

        expect_inertia.to render_component("management/people/index")
      end
    end

    it "lists people with their status and summary counts that match the list" do
      sign_in create(:user, :hr)

      get management_people_path

      people = inertia.props[:people]
      expect(people.size).to be_between(8, 10)
      expect(people.pluck(:status).uniq).to contain_exactly("leveled", "on_track", "late")
      expect(inertia.props[:summary].to_h).to eq(people.pluck(:status).tally)
      expect(inertia.props[:sectors].sum { |sector| sector[:count] }).to eq(people.size)
    end

    it "tells which journeys each sector receives, for the invite" do
      sign_in create(:user, :hr)

      get management_people_path

      journeys = inertia.props[:sectors].to_h { |sector| [sector[:name], sector[:journeys]] }
      expect(journeys).to eq(
        "Atendimento" => ["Base Nivela", "Jeito Distribuidora Sul", "Atendimento na prática"],
        "Comercial" => ["Base Nivela", "Jeito Distribuidora Sul"],
        "Logística" => ["Base Nivela", "Jeito Distribuidora Sul", "Logística na prática"]
      )
    end

    it "keeps the leveled at the end of their path and the others before it" do
      sign_in create(:user, :hr)

      get management_people_path

      leveled, others = inertia.props[:people].partition { |person| person[:status] == "leveled" }
      expect(leveled.map { |person| person[:progress][:percent] }).to all(eq(100))
      expect(others.map { |person| person[:progress][:percent] }).to all(be < 100)
    end

    it "shows each person's progress, score against the sector goal, activity and forecast" do
      sign_in create(:user, :hr)

      get management_people_path

      maria = inertia.props[:people].find { |person| person[:id] == "maria-souza" }
      expect(maria).to include(sector: "Atendimento", status: "on_track", goal: 75,
        activity: "há 2 dias · 35 min nesta semana", forecast: "Nivela em ~12 dias")
      expect(maria[:score]).to be < 75
      expect(maria[:progress]).to include(percent: 50, current_module: "Rotinas de atendimento")
    end

    it "keeps the leveled above the goal and the others below it" do
      sign_in create(:user, :hr)

      get management_people_path

      with_goal = inertia.props[:people].select { |person| person[:goal] }
      leveled, others = with_goal.partition { |person| person[:status] == "leveled" }
      expect(leveled).to all(satisfy { |person| person[:score] >= person[:goal] })
      expect(others).to all(satisfy { |person| person[:score] < person[:goal] })
      expect(leveled.pluck(:forecast)).to all(eq("Nivelado ✓"))
    end

    it "uses the photos that exist and initials for the others" do
      sign_in create(:user, :hr)

      get management_people_path

      avatars = inertia.props[:people].pluck(:avatar_url).compact
      expect(avatars.size).to eq(5)
      expect(avatars).to all(satisfy { |url| Rails.public_path.join(url.delete_prefix("/")).exist? })
    end

    it "names every management user as the same administrator" do
      sign_in create(:user, :manager)

      get management_people_path

      expect(inertia.props[:manager]).to include(name: "Ana Lima", role_label: "Administradora")
    end

    it "shares the signed-in manager for the layout" do
      sign_in create(:user, :hr)

      get management_people_path

      expect(inertia.props[:manager]).to include(name: "Ana Lima", company: "Distribuidora Sul")
    end

    it "gives each person an id for the detail page" do
      sign_in create(:user, :hr)

      get management_people_path

      expect(inertia.props[:people].pluck(:id)).to include("marcos-oliveira", "maria-souza")
    end

    it "sends collaborators back to their journey" do
      sign_in create(:user)

      get management_people_path

      expect(response).to redirect_to(collaborator_journey_path)
    end

    it "asks guests to sign in" do
      get management_people_path

      expect(response).to redirect_to(new_user_session_path)
    end
  end

  describe "GET /management/people/:id" do
    before { sign_in create(:user, :hr) }

    it "renders the person with their path and leveling snapshot" do
      get management_person_path("maria-souza")

      expect_inertia.to render_component("management/people/show")
      person = inertia.props[:person]
      expect(person).to include(name: "Maria Souza", status: "on_track", score: 68, goal: 75,
        forecast: "Nivela em ~12 dias", activity: "há 2 dias · 35 min nesta semana")
      expect(person[:progress]).to include(percent: 50)
      expect(person[:path].pluck(:title)).to eq(%w[Base Empresa Setor])
      expect(person[:path].pluck(:journeys)).to eq([["Base Nivela"], ["Jeito Distribuidora Sul"], ["Atendimento na prática"]])
      expect(person[:path].first[:modules].pluck(:status)).to eq(%w[done done])
      expect(person[:path].second[:modules].pluck(:status)).to eq(%w[done current])
      expect(person).not_to include(:journey)
      expect(person).not_to include(:feedback, :knows, :learning)
    end

    it "shows how the person studies" do
      get management_person_path("maria-souza")

      expect(inertia.props[:person][:study]).to include(weekly_minutes: 35, streak_days: 3, lessons_done: 12, review_accuracy: 82)
    end

    it "compares the diagnostic with today in what the person has studied so far" do
      get management_person_path("maria-souza")

      competencies = inertia.props[:person][:competencies]
      expect(competencies.pluck(:name)).to eq(["Comunicação clara", "Matemática básica", "Cultura da empresa", "Rotinas da Distribuidora"])
      expect(competencies.first).to include(before: 40, now: 70, goal: 75)
      expect(competencies.last).to include(before: 41, now: 53)
    end

    it "shows the badge forecast and the milestones reached" do
      get management_person_path("maria-souza")

      person = inertia.props[:person]
      expect(person[:badge]).to include(label: "Nivelado em Atendimento", earned: false, date: nil, forecast: "Nivela em ~12 dias")
      expect(person[:milestones]).to eq(["Concluiu a jornada Base Nivela", "3 dias seguidos de estudo"])
    end

    it "shows the points earned and the rewards redeemed" do
      get management_person_path("maria-souza")

      rewards = inertia.props[:person][:rewards]
      expect(rewards).to include(points: 240, balance: 90)
      expect(rewards[:redeemed]).to eq([{"name" => "Vale-lanche R$ 30", "date" => "02/10", "points" => 150}])
    end

    it "shows the earned badge of a leveled person" do
      get management_person_path("carla-silveira")

      person = inertia.props[:person]
      expect(person[:badge]).to include(earned: true, date: "14/08")
      expect(person[:milestones]).to include("Concluiu a jornada Atendimento na prática", "Ganhou o selo Nivelado em Atendimento")
      expect(person[:rewards][:redeemed].size).to eq(2)
      expect(person[:rewards][:balance]).to eq(person[:rewards][:points] - 450)
    end

    it "names the badge after the sector when no sector journey reaches the person" do
      get management_person_path("lucas-pereira")

      person = inertia.props[:person]
      expect(person[:badge][:label]).to eq("Nivelado em Comercial")
      expect(person[:path].third).to include(journeys: [], modules: [])
      expect(person[:milestones]).to include("Concluiu a jornada Base Nivela", "Concluiu a jornada Jeito Distribuidora Sul")
    end

    it "does not count an empty journey as finished" do
      stub_const("Management::JourneyCatalog::JOURNEYS", Management::JourneyCatalog::JOURNEYS.merge(
        "logistica-na-pratica" => Management::JourneyCatalog::JOURNEYS["logistica-na-pratica"].merge(modules: [])
      ))

      get management_person_path("marcos-oliveira")

      expect(inertia.props[:person][:milestones]).to eq([])
    end

    it "starts empty for someone who has not studied yet" do
      get management_person_path("marcos-oliveira")

      person = inertia.props[:person]
      expect(person[:rewards]).to include(points: 0, balance: 0, redeemed: [])
      expect(person[:milestones]).to eq([])
      expect(person[:competencies].pluck(:goal)).to all(be_nil)
    end

    it "answers 404 for an unknown person" do
      get management_person_path("nope")

      expect(response).to have_http_status(:not_found)
    end
  end
end
