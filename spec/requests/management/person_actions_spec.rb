require "rails_helper"

RSpec.describe "Management actions on a person", :inertia do
  before { sign_in create(:user, :hr) }

  describe "GET /management/people/:id/role_change" do
    it "offers new roles with what the person still needs to learn for each" do
      get management_person_role_change_path("maria-souza")

      expect_inertia.to render_component("management/role_changes/show")
      props = inertia.props[:role_change]
      expect(props[:person]).to include(id: "maria-souza", role: "Atendente")
      supervisor = props[:roles].find { |role| role[:title] == "Supervisor de atendimento" }
      expect(supervisor[:missing]).to include("Resolução de Reclamações de Entrega")
      expect(supervisor[:missing]).not_to include("Comunicação clara")
    end

    it "answers 404 for an unknown person" do
      get management_person_role_change_path("nope")

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "GET /management/people/:id/review" do
    it "renders the manager review with the same statements colleagues answer" do
      get management_person_review_path("maria-souza")

      expect_inertia.to render_component("management/reviews/show")
      expect(inertia.props[:review][:person]).to include(name: "Maria Souza")
      expect(inertia.props[:review][:statements].size).to eq(3)
    end
  end
end
