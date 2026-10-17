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

    it "lists people with their status and the summary counts" do
      sign_in create(:user, :hr)

      get management_people_path

      expect(inertia.props[:people].pluck(:status)).to include("attention", "learning", "leveled")
      expect(inertia.props[:summary]).to include(leveled: {count: 21, percent: 50})
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
      expect(person).to include(name: "Maria Souza", status: "learning")
      expect(person[:journey][:stretches].pluck(:title)).to eq(%w[Base Empresa Setor])
      expect(person[:feedback].size).to eq(3)
    end

    it "answers 404 for an unknown person" do
      get management_person_path("nope")

      expect(response).to have_http_status(:not_found)
    end
  end
end
