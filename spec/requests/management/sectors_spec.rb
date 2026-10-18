require "rails_helper"

RSpec.describe "Management sectors", :inertia do
  before { sign_in create(:user, :hr) }

  describe "GET /management/sectors" do
    it "lists the work sectors and the groups with their people and goal" do
      get management_sectors_path

      expect_inertia.to render_component("management/sectors/index")
      sectors = inertia.props[:sectors]
      expect(sectors.pluck(:name)).to eq(%w[Atendimento Comercial Logística Staff])
      expect(sectors.pluck(:kind)).to eq(%w[sector sector sector group])
      expect(sectors.pluck(:slug)).to eq(%w[atendimento comercial logistica staff])
    end

    it "counts the people of each one and previews a few of them" do
      get management_sectors_path

      staff = inertia.props[:sectors].find { |sector| sector[:name] == "Staff" }
      expect(staff[:people_count]).to eq(4)
      expect(staff[:people].first).to include(:id, :name, :avatar_url)
      expect(inertia.props[:sectors].pluck(:people_count).first(3).sum).to eq(Management::PeopleMock::PEOPLE.size)
    end

    it "tells each goal level, or nil when there is no goal yet" do
      get management_sectors_path

      levels = inertia.props[:sectors].to_h { |sector| [sector[:name], sector[:level]] }
      expect(levels["Atendimento"]).to include(label: "Médio", target: 75)
      expect(levels["Staff"]).to include(label: "Fácil", target: 60)
      expect(levels["Logística"]).to be_nil
    end

    it "no longer brings a company training cost to the list" do
      get management_sectors_path

      expect(inertia.props).not_to have_key(:company_rule)
      expect(inertia.props[:sectors]).to all(satisfy { |sector| !sector.key?(:training_cost) })
    end
  end

  describe "GET /management/sectors/:slug" do
    it "offers the library competencies to add to the goal" do
      get management_sector_path("atendimento")

      competencies = inertia.props[:library_competencies]
      expect(competencies).to include("Rotinas", "Cultura", "Comunicação")
      expect(competencies).to eq(competencies.uniq.sort)
    end

    it "shows a work sector with its people and its goal" do
      get management_sector_path("atendimento")

      expect_inertia.to render_component("management/sectors/show")
      sector = inertia.props[:sector]
      expect(sector).to include(name: "Atendimento", slug: "atendimento", kind: "sector", level: "medium")
      expect(sector[:people].pluck(:sector).uniq).to eq(["Atendimento"])
      expect(sector[:people].first).to include(:id, :role, :status, :avatar_url, :progress, :score, :goal, :activity, :forecast)
      expect(sector[:levels].pluck(:key)).to eq(%w[easy medium hard])
      expect(sector[:competencies].pluck(:goal)).to all(eq(75))
      expect(sector[:competencies].first).to include(experts_average: 88)
    end

    it "counts who reaches each goal out of the real people of the sector" do
      get management_sector_path("atendimento")

      sector = inertia.props[:sector]
      reached = sector[:competencies].pluck(:reached)
      expect(reached.pluck(:of)).to all(eq(sector[:people].size))
      expect(reached).to all(satisfy { |row| row[:count].between?(0, row[:of]) })
    end

    it "tells the training cost of a work sector against the company one" do
      get management_sector_path("logistica")

      expect(inertia.props[:company_rule]).to include(teacher_salary: 4400, reward_share: 0.4)
      expect(inertia.props[:training_cost]).to include(own: true, teacher_salary: 3960, learner_salary: 1980)
    end

    it "leaves the training cost out of a group, whose people already have a work sector" do
      get management_sector_path("staff")

      expect(inertia.props[:company_rule]).to be_present
      expect(inertia.props[:training_cost]).to be_nil
    end

    it "shows a group with people from different sectors" do
      get management_sector_path("staff")

      sector = inertia.props[:sector]
      expect(sector).to include(name: "Staff", kind: "group", level: "easy")
      expect(sector[:people].pluck(:name))
        .to contain_exactly("Carla Silveira", "Diego Fernandes", "Lucas Pereira", "Rafael Lima")
      expect(sector[:people].pluck(:sector).uniq.size).to be > 1
    end

    it "shows Logística without a goal or veterans yet" do
      get management_sector_path("logistica")

      sector = inertia.props[:sector]
      expect(sector).to include(level: nil, experts_count: 0)
      expect(sector[:competencies].pluck(:goal, :experts_average, :reached).flatten).to all(be_nil)
    end

    it "offers the work sectors to invite people into" do
      get management_sector_path("comercial")

      expect(inertia.props[:invite_sectors].pluck(:name)).to eq(%w[Atendimento Comercial Logística])
      expect(inertia.props[:invite_sectors].first[:journeys]).to eq(["Base Nivela", "Jeito Distribuidora Sul", "Atendimento na prática"])
    end

    it "answers 404 for an unknown sector" do
      get management_sector_path("financeiro")

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "GET /management/sectors/new" do
    it "offers everyone to pick, the levels and the Base competencies" do
      get new_management_sector_path

      expect_inertia.to render_component("management/sectors/new")
      expect(inertia.props[:people].size).to eq(Management::PeopleMock::PEOPLE.size)
      expect(inertia.props[:people].first).to include(:id, :name, :sector, :avatar_url)
      expect(inertia.props[:levels].pluck(:target)).to eq([60, 75, 90])
      expect(inertia.props[:competencies].pluck(:name))
        .to eq(%w[Comunicação Raciocínio Escrita])
      expect(inertia.props[:competencies].pluck(:goal)).to all(be_nil)
      expect(inertia.props[:library_competencies]).to include("Rotinas")
    end
  end

  it "sends the old goal address to the sectors" do
    get "/management/sector_goal"

    expect(response).to redirect_to("/management/sectors")
  end

  it "is only for management" do
    sign_in create(:user)

    get management_sectors_path

    expect(response).to redirect_to(collaborator_home_path)
  end
end
