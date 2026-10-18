require "rails_helper"

RSpec.describe "Management journeys", :inertia do
  before { sign_in create(:user, :hr) }

  describe "GET /management/journeys" do
    it "lists the journeys with their kind, audience and module count" do
      get management_journeys_path

      expect_inertia.to render_component("management/journeys/index")
      journeys = inertia.props[:journeys]
      expect(journeys.pluck(:name)).to eq(["Base Nivela", "Jeito Distribuidora Sul", "Atendimento na prática",
        "Logística na prática", "Promoção para líder"])
      expect(journeys.pluck(:kind)).to eq(%w[base company sector sector company])
      expect(journeys.third).to include(status: "active", modules_count: 2,
        audience: {type: "sectors", names: ["Atendimento"]})
    end

    it "brings the sectors and groups to label the audience" do
      get management_journeys_path

      expect(inertia.props[:audience_options]).to include({name: "Staff", kind: "group", people_count: 4})
    end

    it "leaves the content library to its own page" do
      get management_journeys_path

      expect(inertia.props).not_to have_key(:library)
    end
  end

  describe "GET /management/journeys/new" do
    it "offers the sectors, groups and people who can receive the journey" do
      get new_management_journey_path

      expect_inertia.to render_component("management/journeys/new")
      expect(inertia.props[:audience_options].pluck(:name)).to eq(%w[Atendimento Comercial Logística Staff])
      expect(inertia.props[:people]).to include("Maria Souza", "Marcos Oliveira")
    end
  end

  describe "GET /management/journeys/:id" do
    it "renders the journey with its kind, audience and one ordered list of modules" do
      get management_journey_path("jeito-distribuidora-sul")

      expect_inertia.to render_component("management/journeys/show")
      journey = inertia.props[:journey]
      expect(journey).to include(kind: "company", audience: {type: "sectors", names: %w[Atendimento Comercial Logística]})
      expect(journey[:modules].pluck(:id)).to eq(%w[nossa-historia-e-valores rotinas-de-atendimento])
      expect(journey[:modules].second).to include(source: "ai", teaching_hours: 6, lessons: 8)
    end

    it "offers the whole Biblioteca grouped by origin, Nivela first" do
      get management_journey_path("atendimento-na-pratica")

      catalog = inertia.props[:catalog]
      expect(catalog.pluck(:source)).to eq(%w[nivela ai company])
      expect(catalog.first[:modules].pluck(:id)).to include("conversa-clara", "atendimento-ao-cliente")
      expect(catalog.second[:modules].pluck(:source).uniq).to eq(["ai"])
    end

    it "brings the goal of the first sector that receives the journey" do
      get management_journey_path("atendimento-na-pratica")

      expect(inertia.props[:goal]).to include(
        sector: "Atendimento", slug: "atendimento",
        competencies: %w[Comunicação Reclamações Sistema Empatia]
      )
    end

    it "uses the goal of a group too" do
      get management_journey_path("promocao-para-lider")

      expect(inertia.props[:goal]).to include(sector: "Staff", slug: "staff")
    end

    it "brings who can receive the journey" do
      get management_journey_path("atendimento-na-pratica")

      expect(inertia.props[:audience_options].pluck(:name)).to include("Staff")
      expect(inertia.props[:people]).to include("Maria Souza")
    end

    it "prices each content with the training cost of the sector that receives the journey" do
      get management_journey_path("atendimento-na-pratica")

      expect(inertia.props[:points_rule]).to include(teacher_salary: 4400, learner_salary: 2200, reward_share: 0.4)
      expect(inertia.props[:points_rule_source]).to eq("Atendimento · padrão da empresa")
      expect(inertia.props[:journey][:modules].pluck(:teaching_hours)).to eq([5, 4])
    end

    it "uses a sector's own training cost" do
      get management_journey_path("logistica-na-pratica")

      expect(inertia.props[:points_rule]).to include(teacher_salary: 3960, learner_salary: 1980)
      expect(inertia.props[:points_rule_source]).to eq("Logística · valor próprio")
    end

    it "uses the cheapest sector when several receive the journey" do
      get management_journey_path("base-nivela")

      expect(inertia.props[:points_rule]).to include(teacher_salary: 3960)
      expect(inertia.props[:points_rule_source]).to eq("menor valor entre Atendimento, Comercial e Logística")
    end

    it "offers the ready-made Base Nivela only on base journeys" do
      get management_journey_path("base-nivela")

      ready = inertia.props[:ready_journey]
      expect(ready.pluck(:source).uniq).to eq(["nivela"])
      expect(ready.pluck(:stretch).uniq).to eq(["base"])
      expect(inertia.props[:start_ready]).to be(false)

      get management_journey_path("atendimento-na-pratica")

      expect(inertia.props[:ready_journey]).to be_nil
    end

    it "starts from the ready-made Base when asked" do
      get management_journey_path("base-nivela", ready: 1)

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
