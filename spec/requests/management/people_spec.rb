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

    it "renders the person with their journey, strengths and colleague feedback" do
      get management_person_path("maria-souza")

      expect_inertia.to render_component("management/people/show")
      person = inertia.props[:person]
      expect(person).to include(name: "Maria Souza", status: "on_track", score: 68, goal: 75,
        forecast: "Nivela em ~12 dias", activity: "há 2 dias · 35 min nesta semana")
      expect(person[:progress]).to include(percent: 50)
      expect(person[:journey][:stretches].pluck(:title)).to eq(%w[Base Empresa Setor])
      expect(person[:feedback].size).to eq(3)
    end

    it "answers 404 for an unknown person" do
      get management_person_path("nope")

      expect(response).to have_http_status(:not_found)
    end
  end
end
