require "rails_helper"

RSpec.describe "Management journeys", :inertia do
  before { sign_in create(:user, :hr) }

  describe "GET /management/journeys" do
    it "lists the journeys with their status and modules per stretch" do
      get management_journeys_path

      expect_inertia.to render_component("management/journeys/index")
      expect(inertia.props[:journeys].pluck(:name)).to eq(["Onboarding Atendimento", "Onboarding Logística", "Promoção para líder"])
      expect(inertia.props[:journeys].first).to include(status: "active", modules_per_stretch: {base: 2, company: 2, sector: 2})
    end
  end

  describe "GET /management/journeys/:id" do
    it "renders the three fixed stretches with their modules in order" do
      get management_journey_path("onboarding-atendimento")

      expect_inertia.to render_component("management/journeys/show")
      stretches = inertia.props[:journey][:stretches]
      expect(stretches.pluck(:key)).to eq(%w[base company sector])
      expect(stretches.second[:modules].pluck(:id)).to eq(%w[nossa-historia-e-valores rotinas-de-atendimento])
    end

    it "offers the Nivela library modules that are not in the journey yet" do
      get management_journey_path("onboarding-atendimento")

      expect(inertia.props[:library].pluck(:id)).not_to include("conversa-clara", "matematica-do-dia-a-dia")
      expect(inertia.props[:library]).not_to be_empty
    end

    it "answers 404 for an unknown journey" do
      get management_journey_path("nope")

      expect(response).to have_http_status(:not_found)
    end
  end

  it "is only for management" do
    sign_in create(:user)

    get management_journeys_path

    expect(response).to redirect_to(collaborator_journey_path)
  end
end
