require "rails_helper"

RSpec.describe "Management people", :inertia do
  describe "GET /management/people" do
    %i[hr manager platform_admin].each do |role|
      it "sends #{role} users to the sectors, where people now live" do
        sign_in create(:user, role)

        get management_people_path

        expect(response).to redirect_to(management_sectors_path)
      end
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

      expect(inertia.props[:person][:study]).to include(weekly_minutes: 35, streak_days: 3, lessons_done: 12, hours_done: 8, review_accuracy: 82)
    end

    it "measures the saving with the person's own salary when it was informed" do
      get management_person_path("maria-souza")

      # 8 h × (who teaches R$ 20/h + Maria R$ 2.090 ÷ 220 = R$ 9,50/h)
      expect(inertia.props[:person][:study]).to include(saved: 236, salary_informed: true)
    end

    it "measures the saving with the sector value when the salary was not informed" do
      get management_person_path("bruna-costa")

      expect(inertia.props[:person][:study]).to include(saved: 6 * 30, salary_informed: false)
    end

    it "prices the points with the person's own salary, or the sector value without one" do
      get management_person_path("maria-souza")
      # 8 h studied × Maria's R$ 9,50/h × 40%
      expect(inertia.props[:person][:rewards][:points]).to eq(30)

      get management_person_path("bruna-costa")
      # 6 h × the sector learner's R$ 10/h × 40%
      expect(inertia.props[:person][:rewards][:points]).to eq(24)
    end

    it "compares the diagnostic with today in what the person has studied so far" do
      get management_person_path("maria-souza")

      competencies = inertia.props[:person][:competencies]
      expect(competencies.pluck(:name)).to eq(%w[Comunicação Matemática Cultura Rotinas])
      expect(competencies.first).to include(before: 40, now: 70, goal: 75)
      expect(competencies.last).to include(before: 41, now: 53)
    end

    it "shows the badge forecast and the milestones reached" do
      get management_person_path("maria-souza")

      person = inertia.props[:person]
      expect(person[:badge]).to include(label: "Nivelado em Atendimento", earned: false, date: nil, forecast: "Nivela em ~12 dias")
      expect(person[:milestones]).to eq(["Concluiu a jornada Base Nivela", "3 dias seguidos de estudo"])
    end

    it "earns points for the in-person training hours of the completed modules" do
      get management_person_path("maria-souza")

      rewards = inertia.props[:person][:rewards]
      expect(rewards).to include(points: 30, balance: 5)
      expect(rewards[:redeemed]).to eq([{"name" => "Caneca Nivela", "date" => "02/10", "points" => 25}])
    end

    it "shows the earned badge of a leveled person" do
      get management_person_path("carla-silveira")

      person = inertia.props[:person]
      expect(person[:badge]).to include(earned: true, date: "14/08")
      expect(person[:milestones]).to include("Concluiu a jornada Atendimento na prática", "Ganhou o selo Nivelado em Atendimento")
      expect(person[:rewards][:redeemed].size).to eq(2)
      expect(person[:rewards][:balance]).to eq(person[:rewards][:points] - 55)
      expect(person[:rewards]).to include(points: 110, balance: 55)
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
