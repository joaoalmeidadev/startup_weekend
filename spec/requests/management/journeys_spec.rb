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

    it "leaves the content library to its own page" do
      get management_journeys_path

      expect(inertia.props).not_to have_key(:library)
    end
  end

  describe "GET /management/journeys/:id" do
    it "renders the three fixed stretches with their modules in order" do
      get management_journey_path("onboarding-atendimento")

      expect_inertia.to render_component("management/journeys/show")
      stretches = inertia.props[:journey][:stretches]
      expect(stretches.pluck(:key)).to eq(%w[base company sector])
      expect(stretches.second[:modules].pluck(:id)).to eq(%w[nossa-historia-e-valores rotinas-de-atendimento])
      expect(stretches.second[:modules].second).to include(source: "ai", teaching_hours: 6, lessons: 8)
    end

    it "offers the whole catalog grouped by origin" do
      get management_journey_path("onboarding-atendimento")

      catalog = inertia.props[:catalog]
      expect(catalog.pluck(:source)).to eq(%w[nivela ai company])
      expect(catalog.first[:modules].pluck(:id)).to include("conversa-clara", "atendimento-ao-cliente")
      expect(catalog.second[:modules].pluck(:source).uniq).to eq(["ai"])
    end

    it "brings the sector goal competencies the journey should cover" do
      get management_journey_path("onboarding-atendimento")

      expect(inertia.props[:goal]).to include(
        sector: "Atendimento",
        competencies: ["Comunicação e Escuta Ativa", "Resolução de Reclamações de Entrega",
          "Uso do Sistema Interno de Pedidos", "Postura e Empatia com Clientes Difíceis", "Rotinas da Distribuidora"]
      )
    end

    it "offers the ready-made Nivela journey with Base and general sector products only" do
      get management_journey_path("onboarding-atendimento")

      ready = inertia.props[:ready_journey]
      expect(ready.pluck(:key)).to eq(%w[base company sector])
      expect(ready.flat_map { |stretch| stretch[:modules] }.pluck(:source).uniq).to eq(["nivela"])
      expect(ready.third[:modules].pluck(:id)).to include("atendimento-ao-cliente")
      expect(inertia.props[:start_ready]).to be(false)
    end

    it "starts from the ready-made journey when asked" do
      get management_journey_path("onboarding-atendimento", ready: 1)

      expect(inertia.props[:start_ready]).to be(true)
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
